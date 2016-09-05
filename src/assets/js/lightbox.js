"use strict";

(function($, document, window) {
	// Don't do anything if the lightbox already exists.
	if ($[lightbox]) return;

	var
	// Default settings object.
	globalDefaults = {

		// behavior and appearance
		transition: 'fade',
		speed: 300,
		fadeOut: 300,
		scaleImages: true,
		scrolling: true,
		opacity: 0.85,
		preloading: true,
		className: 'test',
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		data: undefined,
		showCloseButton: true,
		isOpen: false,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: 'start slideshow',
		slideshowStop: 'stop slideshow',
		imageRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,

		// alternate image paths for high-res displays
		retinaImage: false,
		retinaUrl: false,
		retinaSuffix: '@2x.$1',

		// internationalization
		current: 'image {current} of {total}',
		previous: 'Previous',
		next: 'Next',
		close: 'Close',
		xhrError: 'This content failed to load.',
		imgError: 'This image failed to load.',

		// accessbility
		returnFocus: true,
		trapFocus: true,

		// callbacks
		onOpening: false,
		onOpened: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosing: false,
		onClosed: false
    },
    elementDefaults = {
		rel: function() {
			return this.rel;
		},
		href: function() {
			// using this.href would give the absolute url, when the href may have been inteded as a selector (e.g. '#container')
			return $(this).attr('href');
		},
		title: function() {
			return this.title;
		},
		description: function() {
			return $(this).attr('data-description');
		},
		externalURL: function() {
			return $(this).attr('data-url');
		},
		img: function() {
			var img = new Image();
            if (!$(img).attr('id')) $(img).attr('id', prefix + 'img')
			return img;
		},
        isImage: null
	},

	// Abstracting the HTML and event identifiers for easy rebranding
	lightbox = 'lightbox',
	prefix = 'lb-',
	boxElement = prefix + 'Element',

	// Events
	event_opening = prefix + '_opening',
	event_opened = prefix + '_opened',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closing = prefix + '_closing',
	event_closed = prefix + '_closed',

	// Cached jQuery Object Variables
	$window,
    $root,
	$overlay,
	$container,
    $loadingBay,
	$loadedContent,
    $title,
	$close,
	$top,
	$loadingOverlay,
	$imgContainer,
	$imgLink,
	$controls,
	$middle,
	$description,
	$bottomLeft,
	$bottomCenter,
	$bottomRight,
	$bottom,
	$related,
	$next,
	$prev,
	$events = $({}),

	// Variables for cached values or use across multiple functions
	globalSettings,
    currentElement = {},
    image,
	index,
	isOpen,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = 'div',
	requests = 0,
	init,
	topContentWidth;

	// ****************
	// HELPER FUNCTIONS
	// ****************

	// Convenience function for creating new jQuery objects
	function $tag(tag, params) {
		var element = document.createElement(tag);

		if (params) {
			if (typeof params === 'object') {
				var attrs = ['id', 'class', 'css', 'role', 'tabindex'];
				if (params.hasOwnProperty('id')) params.id = prefix + params.id;
				$.each(attrs, function(i, attr) {
					if (params.hasOwnProperty(attr)) $(element).attr(attr, params[attr]);
				});
			}
			else { element.id = prefix + params; }
		}
		return $(element);
	}

    // Helper function to parse and adjust transform matricies.
    function transformMatrix(matrix, property, value) {
		if (!value) {
			value = property;
			property = matrix;
			matrix = 'matrix(1, 0, 0, 1, 0, 0)';
		}
        var matrix = matrix.substr(7).slice(0,-1).replace(/,/g,'').split(' ');
        if (typeof property == 'object') {
            $.each(property, function(property, value) {
                matrix = doTransformMatrix(matrix, property, value)
            })
            return  'matrix(' + matrix.join(', ') + ')';
        }
        else return 'matrix(' + doTransformMatrix(matrix, property, value).join(', ') + ')';

        function doTransformMatrix(matrix, property, value) {

			var propertyPrefix;

            function getRegExp(prop, axis) {
                return new RegExp('^' + prop + '[' + axis + ']?$', 'i');
            }

            if (/^scale/.test(property)) {
                propertyPrefix = 'scale';
                if(property.match(getRegExp(propertyPrefix, 'x'))) matrix[0] = value;
                if(property.match(getRegExp(propertyPrefix, 'y')))  matrix[3] = value;
            }
            else if (/^translate/.test(property)) {
                propertyPrefix = 'translate';
                if(property.match(getRegExp(propertyPrefix, 'x')))  matrix[4] = value;
                if(property.match(getRegExp(propertyPrefix, 'y')))  matrix[5] = value;
            }
            else if (/^skew/.test(property)) {
                propertyPrefix = 'skew';
                if(property.match(getRegExp(propertyPrefix, 'x')))  matrix[2] = value;
                if(property.match(getRegExp(propertyPrefix, 'y')))  matrix[1] = value;
            }
            else throw new Error('Invalid property for transformMatrix()');

            return matrix;
        }
        
        
        
    }

	function Settings(param1, param2) {
        var options, global = null, context;
        
        if (typeof param1 === 'boolean') global = param1;
        else if (typeof param1 === 'object') {
            if (typeof param2 === 'boolean') {
                global = param2;
                options = $.extend({}, param1);
                context = this;
            }
            else if (typeof param2 === 'object') {
                options = $.extend({}, param2);
                context = param1;
            }
            else { throw new Error('Invalid parameters for Settings'); }
            
        }
        else { throw new Error('Invalid parameters for Settings'); }

        var defaults = global === true ? globalDefaults : $.extend({}, elementDefaults);
        var settings = typeof options === 'object' ? options : {}
		
        $.each(defaults, function(key, val) {
        	var value = typeof settings[key] === 'undefined' ? defaults[key] : settings[key];
            settings[key] = value;
        })

		this.get = function(key, call, callback) {
			call = call || !global;
			callback = callback || null;

            function get(key, call, callback) {
                var value = typeof settings[key] === 'undefined' ? defaults[key] : settings[key];
                if ($.isFunction(value)) {
					return global
						? call
							? value.call(context, callback)
							: settings[key] = value
						: settings[key] = value.call(context, callback);
				}
				else return settings[key] = value;
            }

            if (key) {
				get(key, call, callback);
				return settings[key];
			}
            else {
                $.each(defaults, function(key, val) {
					get(key, call, callback);
                });
				return settings;
            }       
		};

        this.set = function(key, value) {
            settings[key] = value;
            return settings[key];
        }
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var max = $related.length,
			newIndex = (index + increment) % max;

		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Checks an element's settings to see if it is an image.
	// There is a force image option (isImage: true) for image hrefs that cannot be matched by the regex.
	function isImage($element) {
        $element = $element || currentElement.element;
		
		return $element.data(lightbox).get('isImage') || globalSettings.get('imageRegex').test($element.data(lightbox).get('href'));
	}

	function retinaUrl(url) {
		return globalSettings.get('retinaUrl') && window.devicePixelRatio > 1 ? url.replace(globalSettings.get('imageRegex'), globalSettings.get('retinaSuffix')) : url;
	}

	function trapFocus(e) {
		if ('contains' in $container[0] && !$container[0].contains(e.target) && e.target !== $overlay[0]) {
			e.stopPropagation();
			$container.focus();
		}
	}

	function setRelated(rel) {
		index = 0;

		if (rel && rel !== false && rel !== 'nofollow') {
			$related = $('.' + boxElement).filter(function () {
				return $.data(this, lightbox).get('rel') === rel;
			});

			index = $related.index(currentElement.$element);

			// Check direct calls to the lightbox.
			if (index === -1) {
				$related = $related.add(currentElement);
				index = $related.length - 1;
			}
		} else {
			$related = element;
		}
	}

	function trigger(event) {
		// for external use
		$(document).trigger(event);
		// for internal use
		$events.triggerHandler(event);
	}

	// var slideshow = (function(){
	// 	var active,
	// 		className = prefix + 'Slideshow_',
	// 		click = 'click.' + prefix,
	// 		timeOut;

	// 	function clear () {
	// 		clearTimeout(timeOut);
	// 	}

	// 	function set() {
	// 		if (globalSettings.get('loop') || $related[index + 1]) {
	// 			clear();
	// 			timeOut = setTimeout(publicMethod.next, globalSettings.get('slideshowSpeed'));
	// 		}
	// 	}

	// 	function start() {
	// 		$slideshow
	// 			.html(globalSettings.get('slideshowStop'))
	// 			.unbind(click)
	// 			.one(click, stop);

	// 		$events
	// 			.on(event_complete, set)
	// 			.on(event_load, clear);

	// 		$container.removeClass(className + 'off').addClass(className + 'on');
	// 	}

	// 	function stop() {
	// 		clear();

	// 		$events
	// 			.unbind(event_complete, set)
	// 			.unbind(event_load, clear);

	// 		$slideshow
	// 			.html(globalSettings.get('slideshowStart'))
	// 			.unbind(click)
	// 			.one(click, function () {
	// 				publicMethod.next();
	// 				start();
	// 			});

	// 		$container.removeClass(className + 'on').addClass(className + 'off');
	// 	}

	// 	function reset() {
	// 		active = false;
	// 		$slideshow.hide();
	// 		clear();
	// 		$events
	// 			.unbind(event_complete, set)
	// 			.unbind(event_load, clear);
	// 		$container.removeClass(className + 'off ' + className + 'on');
	// 	}

	// 	return function(){
	// 		if (active) {
	// 			if (!globalSettings.get('slideshow')) {
	// 				$events.unbind(event_cleanup, reset);
	// 				reset();
	// 			}
	// 		} else {
	// 			if (globalSettings.get('slideshow') && $related[1]) {
	// 				active = true;
	// 				$events.one(event_cleanup, reset);
	// 				if (globalSettings.get('slideshowAuto')) {
	// 					start();
	// 				} else {
	// 					stop();
	// 				}
	// 				$slideshow.show();
	// 			}
	// 		}
	// 	};

	// })();


	// Add the lightbox elements when the DOM loads
	function addToDOM() {
		if (!$container) {
			var css = document.createElement('link');

			$(css).attr({
				rel: 'stylesheet',
				href: SITE_ROOT + 'assets/css/jquery.lightbox.min.css'
			});

			init = false;

			$window = $(window);
            $root = $tag(div).attr('id','lb').hide();
			$overlay = $tag(div, 'overlay')
                .css('cursor', globalSettings.get('overlayClose') ? 'pointer' : '');
			$container = $tag(div,
				{
					id: 'container',
					role: 'dialog',
					tabindex: '-1'
				})
				.css('transform', transformMatrix('scale', 0.9));

			$title = $tag('h1', 'title');
			$close = $tag('button', 'close').html('&times;').attr('aria-label', globalSettings.get('close'));

 			$top = $tag(div, 'top')
				.addClass('top')
				.append($title).append($close);

			var circles = [];
            for (var i = 1; i <= 12; i++) {
                circles.push($tag(div, {class: 'loading-circle loading-circle-' + i}));
            }

			$loadingOverlay = $tag(div, 'loadingOverlay')
				.append($tag(div, {class: 'loading-circles'}).append(circles));

			$imgLink = $tag('a', 'img-link').attr('target', '_blank');
			$imgContainer = $tag(div, 'img-container').append($imgLink);
			
			$prev = $tag('button', 'prev').html('&lsaquo;').attr('aria-label', globalSettings.get('previous'));
			$next = $tag('button', 'next').html('&rsaquo;').attr('aria-label', globalSettings.get('next'));
			$controls = $tag(div, 'controls').append($prev, $next);

			$middle = $tag(div, 'middle')
				.addClass('middle clearfix')
				.append($loadingOverlay, $imgContainer, $controls);

			$description = $tag(div, 'description');

			$bottomLeft = $tag(div, 'bottomLeft').addClass('left').append($description);
			$bottomCenter = $tag(div, 'bottomCenter').addClass('center'),
			$bottomRight = $tag(div, 'bottomRight').addClass('right');
			$bottom = $tag(div, 'bottom')
				.addClass('bottom clearfix')
				.append($bottomLeft, $bottomCenter, $bottomRight);

			$container.append($top, $middle, $bottom);

			$loadingBay = $tag(div, 'loadingBay');

			$loadedContent = $tag(div, 'loadedContent');
			
		}
		if (document.body && !$container.parent().length) {
			var parent = $('#main').length == 0 ? $(document.body) : $('#main');
			parent.append($root.append(css, $overlay, $container, $loadingBay));
		}
	}

	// Add the lightbox's event bindings
	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				doOpen($(this));
			}
		}

		if ($container) {
			if (!init) {
				init = true;

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (globalSettings.get('overlayClose')) {
						publicMethod.close();
					}
				});

				// Key Bindings
				$(document).on('keydown.' + lightbox, function (e) {
					var key = e.keyCode;
					if (isOpen && globalSettings.get('escKey') && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (isOpen && globalSettings.get('arrowKey') && $related[1] && !e.altKey) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});
				$(document).on('click.' + lightbox, '.'+boxElement, clickHandler);
			}
			return true;
		}
		return false;
	}

    function doOpen($element) {

		if (isOpen || closing) return;

        isOpen = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
        
		trigger(event_opening);

		if (typeof globalSettings.get('onOpening') === 'function') globalSettings.get('onOpening', true, opener);
		else opener();

		function opener() {

			currentElement = {
				$element: $element,
				data: $element.data(lightbox).get()
			}

			var rel = typeof currentElement.data.rel === 'undefined' ? false : currentElement.data.rel;
			setRelated(rel);

			// Disable scrolling
			$window.on(
				'touchmove.' + lightbox
				+ ' scroll.' + lightbox
				+ ' mousewheel.' + lightbox, 
				function(e) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			);

			$('body').addClass('lightbox-visible');
			
			var opacity = parseFloat(globalSettings.get('opacity'));
			opacity = isNaN(opacity) ? '' : opacity;

			if (globalSettings.get('showCloseButton')) $close.show();
			else $close.hide();

			loadContent();

			$root.css('visibility','hidden').show();

			$title.css('white-space', 'nowrap');
			topContentWidth = $title.outerWidth(true) + $close.outerWidth(true) + 1;
			$title.css('white-space', '');

			publicMethod.resize();
			
			$overlay.css('opacity', opacity).show();
			$root.css('visibility','');
			$container.css({
				transform: transformMatrix($container.css('transform'), 'scale', 1),
				opacity: 1
			});

			$window.on('resize.' + lightbox, publicMethod.resize);
			
			
			$container.focus();

			if (globalSettings.get('trapFocus')) {
				// Confine focus to the modal
				document.addEventListener('focus', trapFocus, true);

				$events.one(event_closed, function () {
					document.removeEventListener('focus', trapFocus, true);
				});
			}

			trigger(event_opened);
			globalSettings.get('onOpened', true);
		}
	}

    function loadContent() {
		var request = ++requests;

		active = true;
		trigger(event_load);
		globalSettings.get('onLoad');

        if (!isImage(currentElement.$element)) return;
        if($('#' + prefix + 'image').length) $('#' + prefix + 'image').remove();

        loadingTimer = setTimeout(function () {
			$loadingOverlay.show();
		}, 100);

        var href = currentElement.data.href,
			retinaHRef = retinaUrl(href);
		
		image = currentElement.data.img;

	    $(image)
		.one('error.'+ lightbox, function () {
            $(image).one('error.'+ lightbox, imageError)
            $(image).src = href;
        })
		.one('load', imageFileLoaded);

		image.src = retinaHRef;

		$imgLink.attr('href', image.src);

		if (currentElement.data.title) $title.html(currentElement.data.title).show();
		else $title.html('').hide();

		if (currentElement.data.description || currentElement.data.externalURL) {
			if (currentElement.data.externalURL) {
				var description,
					link = document.createElement('a'),
					text;
					
					link.href = currentElement.data.externalURL;
					text = link.hostname;

				if (currentElement.data.description) description = currentElement.data.description + ' // <a href="' + link.href + '" target="_blank">' + text + '</a>';
				else description = link.href;

				$description.html(description);
			}
			else $description.html(currentElement.data.description);

			$description.show();
		}
		else $description.html('').hide();

        function imageFileLoaded() {
            if (request !== requests) return;

            $loadingBay.append(image);

            // A small pause because some browsers will occassionaly report a
			// img.width and img.height of zero immediately after the img.onload fires
			setTimeout(function() {
				var percent;

				if (globalSettings.get('retinaImage') && window.devicePixelRatio > 1) {
					$(image).height = $(image).height / window.devicePixelRatio;
					$(image).width = $(image).width / window.devicePixelRatio;
				}

				if (globalSettings.get('scaleImages')) {
					var setResize = function () {
						$(image).height -= $(image).height * percent;
						$(image).width -= $(image).width * percent;
					};
					if (globalSettings.mw && $(image).width > globalSettings.mw) {
						percent = ($(image).width - globalSettings.mw) / $(image).width;
						setResize();
					}
					if (globalSettings.mh && $(image).height > globalSettings.mh) {
						percent = ($(image).height - globalSettings.mh) / $(image).height;
						setResize();
					}
				}

				if ($related[1] && (globalSettings.get('loop') || $related[index + 1])) {
					$(image).css('cursor', 'pointer');

					$(image).on('click.' + lightbox, function () {
						publicMethod.next();
					});
				}
                $imgLink.append(image);
			}, 1);
        }
	}

    function imageError() {

    }


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.lightbox.close();
	// ****************

	publicMethod = $.fn[lightbox] = $[lightbox] = function (options, callback) {

		options = options || {};

		var elementOptions = {};

		if (!this[0]) { // lightbox being applied to empty collection
			console.warn('$.lightbox selector does not exist.');
			return false;
		}

        $.each(options, function(i,e) {
            if (typeof elementDefaults[i] !== 'undefined') {
                elementOptions[i] = e;
                delete options[i];
            }
        });

        globalSettings = new Settings(options, true);

		$(addToDOM);

		if (addBindings()) {

			if (callback) options.onComplete = callback;

			this.each(function () {
				var old = $.data(this, lightbox) || {},
                    elementSettings = new Settings(this, elementOptions);
                if(old instanceof Settings) {
                    $.data(this, lightbox, $.extend(true, old, elementSettings));
                } else {
                    $.data(this, lightbox, elementSettings);
                }
			}).addClass(boxElement);

			

			// Open immediately on load.
			if (globalSettings.get('isOpen')) doOpen($(this[0]));
		}

		return this;
	};

	publicMethod.resize = function (options) {
		if (!isOpen) return;

        options = options || {};

		var containerWidth =
			Math.max(
				image.naturalWidth,
				topContentWidth
			)
			+ (parseInt($container.css('padding-left')) + parseInt($container.css('margin-left'))) * 2;

		if (window.innerWidth < image.naturalWidth) containerWidth = window.innerWidth;

		$container.css('max-width', containerWidth);

		var containerHeightWithoutImage = $top.outerHeight(true) + $bottom.outerHeight(true) + (parseInt($container.css('padding-top')) + parseInt($container.css('margin-top'))) * 2;

		$(image).css('max-height', window.innerHeight - containerHeightWithoutImage);		

	};

	// publicMethod.prep = function (object) {
	// 	if (!isOpen) return;

	// 	var speed = globalSettings.get('transition') === 'none' ? 0 : globalSettings.get('speed');

	// 	$loadedContent.append(object);

	// 	var callback = function () {
	// 		var total = $related.length,
	// 			complete;

	// 		if (!isOpen) return;

	// 		complete = function () {
	// 			clearTimeout(loadingTimer);
	// 			$loadingOverlay.hide();
	// 			trigger(event_complete);
	// 			globalSettings.get('onComplete');
	// 		};


			

	// 		if (total > 1) { // handle grouping
	// 			if (typeof globalSettings.get('current') === 'string') {
	// 				$imgContainer.html(globalSettings.get('current').replace('{current}', index + 1).replace('{total}', total)).show();
	// 			}

	// 			$next[(globalSettings.get('loop') || index < total - 1) ? 'show' : 'hide']().html(globalSettings.get('next'));
	// 			$prev[(globalSettings.get('loop') || index) ? 'show' : 'hide']().html(globalSettings.get('previous'));

	// 			slideshow();

	// 			// Preloads images within a rel group
	// 			if (globalSettings.get('preloading')) {
	// 				$.each([getIndex(-1), getIndex(1)], function(){
	// 					var img,
	// 						i = $related[this],
	// 						settings = new Settings(i, $.data(i, lightbox)),
	// 						src = settings.get('href');

	// 					if (src && isImage(settings, src)) {
	// 						src = retinaUrl(settings, src);
	// 						img = document.createElement('img');
	// 						img.src = src;
	// 					}
	// 				});
	// 			}
	// 		} else {
	// 			$controls.hide();
	// 		}

	// 		complete();

	// 		if (globalSettings.get('transition') === 'fade') {
	// 			$container.fadeTo(speed, 1);
	// 		}
	// 	};

	// 	if (globalSettings.get('transition') === 'fade') {
	// 		$container.fadeTo(speed, 0);
	// 	}
	// };

	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (globalSettings.get('loop') || $related[index + 1])) {
			index = getIndex(1);
			doOpen($related[index]);
		}
	};

	publicMethod.prev = function () {
		if (!active && $related[1] && (globalSettings.get('loop') || index)) {
			index = getIndex(-1);
			doOpen($related[index]);
		}
	};

	publicMethod.close = function () {
		if (isOpen && !closing) {
			var speed = globalSettings.get('fadeOut');

			closing = true;
			isOpen = false;

			trigger(event_cleanup);
			globalSettings.get('onCleanup');
			trigger(event_closing);
			globalSettings.get('onClosing', true);

			$window.off('.' + lightbox);

			if (globalSettings.get('returnFocus')) currentElement.$element.focus(); // Return focus on closing
			$overlay.fadeTo(globalSettings.get('fadeOut') || 0, 0);
			$container.stop().fadeTo(
				speed || 0,
				0,
				function() {
					$container.css('transform', transformMatrix($container.css('transform'), 'scale', 0.9));
					$root.hide();
					$title.empty();
					$imgLink.empty().attr('href', '');
					$loadedContent.empty();
					$loadingBay.empty();
					$('body').removeClass('lightbox-visible');
					setTimeout(function () {
						closing = false;
						trigger(event_closed);
						globalSettings.get('onClosed', true);
					}, 1);
				}
			);
		}
	};

	// Removes changes the lightbox made to the document, but does not remove the plugin.
	publicMethod.remove = function () {
		if (!$container) { return; }

		$container.stop();
		$[lightbox].close();
		$container.stop(false, true).remove();
		$overlay.remove();
		closing = false;
		$container = null;
		$('.' + boxElement)
			.removeData(lightbox)
			.removeClass(boxElement);

		$(document).unbind('click.' + lightbox).unbind('keydown.' + lightbox);
	};

	// A method for fetching the current element the lightbox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return currentElement.$element;
	};

    publicMethod.settings = function(key, value) {
        return value ? globalSettings.set(key, value) : globalSettings.get(key);
    }
    
})(jQuery, document, window);