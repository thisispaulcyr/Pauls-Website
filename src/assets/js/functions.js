// functions.js

"use strict";

var tip = tip || {};

tip.resource = tip.resource || {};
tip.resource.RETRYWAIT = 100; // ms
tip.resource.MAXWAIT = 7500 / tip.resource.RETRYWAIT; // ms


tip.Carousel = function(selector, options) {
	// Require instantiation
	if (!(this instanceof tip.Carousel)) {
		tip.scopeWarn('tip.Carousel');
		return new tip.Carousel(selector, options);
	} 

	var self = this;
	this.selector = selector;
	this.options = options || {};

	this.init = function() {
		this.resourceRetryCounter = this.resourceRetryCounter || 0;
		if (typeof $.fn.Cloud9Carousel != 'function') {
			if (this.resourceRetryCounter < tip.resource.MAXWAIT) {
				this.resourceRetryCounter++;
				setTimeout(self.init, tip.resource.RETRYWAIT);
				return;
			}
			else { throw 'missing resource: Cloud9Carousel'; }
		}
		if ($.inArray(tip.browser.name, ['MSIE', 'Edge']) == -1) { options['xOrigin'] = 0; }

		$(selector).Cloud9Carousel(options);
		self.size();
		$(window).off('resize.carousel-' + selector.trim().slice(1));

		function exec() {
			if (!$(selector).length) {
				$(window).off('resize.carousel-' + selector.trim().slice(1));
				return false;
			}
			self.size();
		};

		var execTimer = new tip.ExecTimer(exec);

		$(window).on('resize.carousel-' + selector.trim().slice(1), execTimer.exec)

		$(window).off('navigate.carousel-' + selector.trim().slice(1));
		$(window).on('navigate.carousel-' + selector.trim().slice(1), function() {
			if (!$(selector).length) {
				$(window).off('navigate.carousel-' + selector.trim().slice(1));
				return false;
			}
			self.size()
		});

		(function reveal() {
			if ($('.overlay', $(selector).parent()).length > 0) {
				if (typeof $(selector).data('carousel') == 'object') {
					$('.overlay', $(selector).parent()).animate({opacity: 0}, 250);
				}
				else { setTimeout(reveal, 50); }
			}
		})();
	}
	this.size = function() {
		$(this.selector).data('carousel').yOrigin = $(this.selector).height() / 3;
		$(this.selector).data('carousel').xRadius = $(this.selector).width() * 0.45;
		$(this.selector).data('carousel').yRadius = $(this.selector).height() / 3;
	}

	if (typeof $.fn.Cloud9Carousel != 'function') { $.getScript(SITE_ROOT + 'assets/js/cloud9carousel.min.js'); }
}

tip.PageCSS = function(page) {
	// Require instantiation
	if (!(this instanceof tip.PageCSS)) {
		tip.scopeWarn('tip.PageCSS');
		return new tip.PageCSS(file);
	}

	page = page || '';

	var $link,
		identifier = page || 'front',
		filePath = SITE_ROOT + 'assets/css/' + identifier + '.min.css';

	if (!$('link[rel="stylesheet"][href="' + filePath + '"]', 'head')) return false;

	$link = $(document.createElement('link')).attr({
		rel: 'stylesheet',
		href: filePath
	})

	$('head').append($link);

	// Check for whether navigate events are active. If not, add a listener for this page.
    if(!$._data(window, 'events').navigate || !$._data(window, 'events').navigate['css'] || !$._data(window, 'events').navigate.css[identifier]) {
        $(window).on('navigate.css.' + identifier,
            function (e) {
                // If the window navigates away from current page, stop listening for navigate events from this page and remove the top level function for cleanup.
                if([SITE_ROOT + page, SITE_ROOT.substr(0, SITE_ROOT.length-1)].indexOf(e.target.location.href) === -1) {
                    $(window).off('navigate.css.' + identifier);
                    $link.remove();
                }
        });
    }

}

tip.ExecTimer = function(delay, theFunction, params) {
	// Require instantiation
	if (!(this instanceof tip.ExecTimer)) {
		tip.scopeWarn('tip.ExecTimer');
		return new tip.ExecTimer(delay, theFunction, params);
	}

	if (typeof theFunction !== 'function') {
		theFunction = delay;
		delay = null;
	}

	this.delay = delay || $.fx.interval;

	var triggered = false;

	this.exec = function() {
		if (triggered) return;
		triggered = true;
		theFunction(params);
		setTimeout(function() {
				theFunction(params);
				triggered = false;
			},
			this.delay
		);
	}
}

tip.Form = function(id, options) {
	// Require instantiation
	if (!(this instanceof tip.Form)) {
		tip.scopeWarn('tip.Form');
		return new tip.Form(id, options);
	} 

	var self = this,
		defaultMessages = {
			form: {
				SUBMITBUTTON: 'Submit',
				SENDING: 'Sending...',
				SENT: 'Message sent.',
			},
			error: {
				GENERAL: 'Please contact me at <a href="mailto:web@thisispaul.ca" target="_blank">web@thisispaul.ca</a>.',
				UNKNOWN: 'An unknown error occurred. It probably doesn\'t have anything to do with your submission and is likely just a technical issue.',
				authentication: { GENERAL: 'The username or password is incorrect.'},
				form: {
					CAPTCHAINVALID: 'Please complete the captcha before submitting. It\'s the "I\'m not a robot" box just above the Submit button',
					db: {
						CONNECTION: 'There was a internal technical error. It probably doesn\'t have anything to do with your submission.',
						INSERT: 'There was a internal technical error. It probably doesn\'t have anything to do with your submission.',
					},
					EMAIL: 'There was a internal technical error. It probably doesn\'t have anything to do with your submission.',
					type: {
						NOTPROVIDED: 'There was an error with the form information that was submitted by your internet browser.',
						NOTRECOGNIZED: 'There was an error with the form information that was submitted by your internet browser.',
					}
				},
				validation: {
					GENERAL: 'There was an error with some of the information you entered. Please re-check your entries and try again.</p>'
						+ '<p style="font-size:small;">If you still receive this message after re-checking what you entered, please contact me at <a href="mailto:web@thisispaul.ca" target="_blank">web@thisispaul.ca</a></p>',
					fields: {
						'name-first': 'Enter your first name.',
						'name-last': 'Enter your last name.',
						'street-address': 'Enter a valid street address or leave blank.',
						'city': 'Enter a valid city name or leave blank.',
						'pcode': 'Enter a valid postal / ZIP code or leave blank.',
						'email': 'Enter your email address.',
						'tel': 'Enter a valid telephone number or leave blank.',
						'subject': 'Enter a message subject.',
						'message': 'Enter a message.'
					}
				}
			}
		}

	this.id = id;
	this.options = typeof options == 'object' ? options : {};
	this.options.captchaKey = '6LelYxUTAAAAABaegvqayigChCnT5OgKR-0bgQi2';

	this.submit = function() {

		var formMessages = self.options.messages,
			serializedForm = $(self.id).serialize();

		// Remove any existing alerts
		if ($('.alert', self.id).length) $('.alert', self.id).remove();

		// Create an alert box for result message
		$(document.createElement('div'))
			.attr({
				'class': 'alert alert-dismissible fade in',
				'role': 'alert',
				'style': 'display:none;'
			})
			.append(
				$(document.createElement('button')).attr({
					'type': 'button',
					'class': 'close',
					'data-dismiss': 'alert',
					'aria-label': 'Close'
				})
				.append('<span aria-hidden="true">&times;</span>')
			)
			.append($(document.createElement('div')).addClass('message'))
			.insertBefore('.submit input[type="submit"]', self.id);

		// Disable inputs while processing
		$('input,select,textarea,button,.form-control', self.id).attr('disabled', 'disabled');
		
		// Set the message on the submit button while processing
		$('input[type="submit"]', self.id).attr('value', formMessages.sendingMessage);
		

		// Send the form
		$.ajax({
			url: window.location.href,
			type: 'POST',
			dataType: 'json',
			data: serializedForm,
			error: function(jqXHR, textStatus, errorThrown) {
				var errorCode, errorMessage, responseMessage;

				$('.alert', self.id).addClass('alert-danger');

				try {
					errorCode = $.parseJSON(jqXHR['responseText'])['details']['code'];
					errorMessage =
					$.parseJSON(jqXHR['responseText'])['details']['code'].split('.').reduce(
						function(prev, curr) {
							if (prev.hasOwnProperty(curr)) { return prev[curr]; }
							else { return formMessages.error.UNKNOWN; }
						},
						formMessages
					);
					responseMessage = $.parseJSON(jqXHR['responseText'])['message'];
				}
				catch(e) {
					errorCode = null;
					errorMessage = formMessages.error.UNKNOWN;
					responseMessage = 'Unknown error.';
				}
				if (
					errorMessage == formMessages.error.UNKNOWN
					|| [
						'error.form.EMAIL',
						'error.form.db.CONNECTION',
						'error.form.db.INSERT',
						'error.form.type.NOTPROVIDED',
						'error.form.type.NOTRECOGNIZED',
					].indexOf(errorCode) !== -1
				) errorMessage += '</p><p>' + formMessages.error.GENERAL;
				errorMessage += '</p><p class="note">&lt;Error: ' + responseMessage + '&gt;';
				$('.alert .message', self.id).html('<p>' + errorMessage + '</p>');
			},
			success: function(data, textStatus, jqXHR) {
				$(':input', self.id)
					.removeAttr('checked')
					.removeAttr('selected')
					.not(':button, :submit, :reset, :hidden, :radio, :checkbox')
					.val('');
				$('.alert', self.id).addClass('alert-success');
				$('.alert .message', self.id).html(formMessages.form.SENT);
			},
			complete: function() {
				$('input,select,textarea,button,.form-control', self.id).attr('disabled', null);
				if (typeof grecaptcha !== "undefined") { grecaptcha.reset(); }
				$('input[type="submit"]', self.id).attr('value', formMessages.submitButtonValue);
				$('.submit .alert', self.id).slideDown();
			}
		});
	}

	function loadValidate() {
		$(self.id).validate({
			errorClass: 'has-error',
			validClass: '',
			highlight: function(element, errorClass, validClass) {
				$(element).attr('aria-invalid', 'true');
				$(element).parent('.form-group').addClass(errorClass).removeClass(validClass);
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).attr('aria-invalid', 'false');
				$(element).parent('.form-group').addClass(validClass).removeClass(errorClass);
			},
			errorPlacement: function(error, element) {
				if (element.parent('.form-group').hasClass('has-error')) {
					error.hide();
					error.addClass('help-block');
					error.insertAfter($(element).siblings('.control-label').first());
					error.slideDown('fast');
				}
			},
			success: function(label) {
				label.slideUp('fast', function() { $(this).remove(); });
			},
			messages: self.options.messages.error.validation.fields,
			submitHandler: self.submit
		});
	}

	// Populate default messages if not provided
	if (typeof options == 'object'
		&& options.hasOwnProperty('messages')
		&& typeof options.messages == 'object'
	) {
		this.options.messages = $.extend(true, defaultMessages, options.messages)
	} else { this.options.messages = defaultMessages; }

	// Form validation
	if (typeof $.fn.validate !== 'function') {
		var folder = SITE_ROOT + 'assets/js/jquery.validate/';
		$.getScript(folder + 'jquery.validate.min.js',
			function() { 
				$.getScript(
					folder + 'additional-methods.min.js',
					loadValidate()
				);
			}
		);
	}
	else { loadValidate(); }

	if ($('.recaptcha', this.id).length) { $.getScript('https://www.google.com/recaptcha/api.js?render=explicit'); }
}

tip.Lightbox = function(page, options) {
	// Initialize
	var i=0;
	if (typeof $.fn.lightbox !== 'function') {
		$.getScript(SITE_ROOT + 'assets/js/jquery.lightbox.min.js');
		function init() {
			if (typeof $.fn.lightbox !== 'function') {
				i++;
				if (i <= tip.resource.MAXWAIT) setTimeout(init, tip.resource.RETRYWAIT);
				else { throw 'dependency error: Required object \'$.fn.lightbox\' is missing.' }
			} else { create(options); }
		}
		init();
	} else { create(options); }

	function create(options) {
		var options = options || {};
		options.onOpening = function(callback) { $('#header-nav-primary').slideUp(100, callback) }
		options.onClosing = function(callback) { $('#header-nav-primary').slideDown(200, callback) }
		if(options.hasOwnProperty('gallery') && options.gallery) {
			options.rel = options.gallery === true ? 'page-' + page : options.gallery;
			delete options.gallery;
		}

		$('.thumbnails a.thumbnail').lightbox(options);

		// Check for whether navigate events are active. If not, add a listener for this page.
		if(!$._data(window, 'events').hasOwnProperty('navigate') || !$._data(window, 'events').navigate.hasOwnProperty(page)) {
			$(window).on('navigate.' + page,
				function (e) {
					// If the window navigates away from current page, stop listening for navigate events from this page and remove the top level function for cleanup.
					if(e.target.location.href != SITE_ROOT + page) {
						$('.thumbnails a.thumbnail').lightbox.remove();
					}
			});
		}
	}
}

tip.Menu = function(id) {
	// Require instantiation
	if (!(this instanceof tip.Menu)) {
		tip.scopeWarn('tip.Menu');
		return new tip.Menu(id);
	} 

	if (!$(id).length) throw new Error('Not a valid element ID: ' + id);

	var self = this,
		$menu = $('.menu', id),
		$toggle = $('.toggle', id),
		focusCheckIID,
		toggleEnabled,
		fixedHeight;

	this.id = id;

	function setHeight() {
		if ($(self.id).hasClass('fixed') || $menu.css('display') == 'block') {
			fixedHeight = $(window).height() - $toggle.outerHeight() + 1
			if (!$(self.id).hasClass('fixed')) {
				fixedHeight += -$(self.id).position().top + $(window).scrollTop();
			}
			if ($menu.height() > fixedHeight) $menu.height(fixedHeight);
			else $menu.css('height', '');
		}
	}

	function focusCheck() {
		if ($(self.id).has(document.activeElement).length == 0 && focusCheckIID) {
			clearInterval(focusCheckIID);
			focusCheckIID = null;
			if (toggleEnabled && !(window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('print').matches))
				$toggle.click();
		}
	}

	this.toggle = function() {
		if ($menu.hasClass('visible')) {
			$menu.removeClass('visible')
			if (focusCheckIID) {
				clearInterval(focusCheckIID);
				focusCheckIID = null;
			}
			//$toggle.blur();
		} else {
			$menu.addClass('visible')
			//$('[tabindex="1"]', $(self)).focus();
			focusCheckIID = setInterval(focusCheck, $.fx.interval);
		}
	}

	this.enableToggle = function(state) {
		toggleEnabled = state;
		if (state) {
			$toggle.on('click.' + self.id + '.menu', self.toggle);
		}
		else $toggle.off('click.' + self.id + '.menu');
	}

	function resizeExec() {
		if (window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('print').matches) {
			if (toggleEnabled) self.enableToggle(!toggleEnabled);
		} else {
			if (!toggleEnabled) self.enableToggle(!toggleEnabled);
			setHeight();
		}
	}

	var resizeExecTimer = new tip.ExecTimer(resizeExec),
		scrollExecTimer = new tip.ExecTimer(setHeight);

	$(window).on('resize.' + this.id + '.menu', resizeExecTimer.exec);
	$(window).on('scroll.' + this.id + '.menu', scrollExecTimer.exec);

	setHeight();
	this.enableToggle(true);
}

// uses duck-typing via feature detection
tip.browser = {
	name: (function() {
		if (/*@cc_on!@*/false || !!document.documentMode) { return 'MSIE'; }
		else if (!!window.StyleMedia) { return 'Edge'; }
		else if (!!window.chrome) { return 'Chrome' }
		else if (typeof InstallTrigger !== 'undefined') { return 'Firefox';	}
		else if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) { return 'Opera' }
		else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { return 'Safari'; }
		return undefined;
	})()
}
tip.browser.version = (function() {
	switch (tip.browser.name) {
		case ('Blink'): return '[1,undefined)';
		case ('Chrome'):
			if (!!window.CSS) { return '[28,undefined)'; }
			else { return '[1,28)'; }
		case ('Edge'): return '[20,undefined)';
		case ('Firefox'): return '[1,undefined)';
		case ('MSIE'): return '[6,11]';
		case ('Opera'):
			if (!!window.opr && !!opr.addons) { return '[20,undefined)'; }
			else { return '[8,20)'; }
		case ('Safari'): return '[3,undefined)';
		default: return undefined;
	}
})();

tip.oS = (function() {
	var userAgent = window.navigator.userAgent,
		oSes = { 
			'Windows NT 10' : 'Windows 10 / Server 2016',
			'Windows NT 6.3' : 'Windows 8.1 / Server 2012 R2',
			'Windows NT 6.2' : 'Windows 8 / Server 2012',
			'Windows NT 6.1' : 'Windows 7 / Server 2008 R2',
			'Windows NT 6.0' : 'Windows Vista / Server 2008',
			'Windows NT 5.2' : 'Windows XP Pro x64 / Windows Server 2003',
			'Windows NT 5.1' : 'Windows XP',
			'Windows NT 5.0' : 'Windows 2000 / Server 2000',
			'Mac' : 'Mac/iOS',
			'X11' : 'UNIX',
			'Linux' : 'Linux'
		},
		oS = 'Unknown';
	$.each(oSes, function(index, element) {
		if (userAgent.indexOf(index) != -1) { oS = element; }
	});
	return oS;
})();

tip.ajax = {
	init: function() {
		$.ajaxSetup({
			timeout: 7500,
			cache: true,
		});
		$(window).on('popstate', function() {
			var URL = window.location.href;
			if (!tip.isSameTarget(URL, tip.ajax.prevURL))
				tip.ajax.pageLoader(URL);
		});
	},

	prevURL: (function() {
		var location = window.location;
		return {
			protocol: location.protocol,
			hostname: location.hostname,
			pathname: location.pathname
		}
	})(),

	attachListeners: function() {
		$('a').filter(function() {
				return this.href // ...and it has a URL...
					&& !this.href.match(/^.+\.\S{3,4}$/i) // ...but the URL does not include a file extention
					// ...and it does not have a "target" attribute or it does and that attribue is "_self", effectively excluding targets such as "_blank"
					&& (
						!$(this).attr('target')
						|| $(this).attr('target') == '_self'
					);
			})
			.off('click.ajax')
			.on('click.ajax', function(event){
				event.preventDefault();
				if (tip.isSameTarget(this.href)) history.pushState(null, document.title, this.href);
				else tip.ajax.pageLoader(this);
			});
	},

	pageLoader: function(linkObject) {
		var ajaxInProgress,
			$targetElement,
			overlayNav,
			url,
			nav,
			scrollPos = 0;

		if (ajaxInProgress) {
			nav.abort();
			tip.loadingAnimation.remove($targetElement);
		}

		url = typeof linkObject == 'string' ? linkObject : $(linkObject).attr('href');

		$targetElement =
			typeof linkObject == 'string'
			|| $(linkObject).parents('#main').length == 0
			? $('#main')
			: $(linkObject).closest('div').attr('class','container').parent();

		overlayNav = ('.overlay', $targetElement).first();

		if (url[url.length-1]=='/') url = url.slice(0,-1);

		if ($('> .overlay', $targetElement).length == 0) {
			tip.loadingAnimation.add(
				$targetElement,
				{speed: 200, classes: 'nav'},
				doAjax
			);
		}
		else doAjax();

		function doAjax() {
			if ($(window).scrollTop() > scrollPos) $('html, body').scrollTop(scrollPos);
			nav = $.ajax({
				url: url,
				dataType: 'json',
				cache: false,
				headers: {'X-Request-Type': 'ajax'},
				beforeSend: function() { ajaxInProgress = true; },
				error: error,
				success: success,
				complete: function(jqXHR, textStatus) { ajaxInProgress = false; }
			});
		}

		function error(jqXHR, textStatus, errorThrown) {
			var message = '<div class="ajax message">\
				<p style="font-weight:bold; font-size: 2em; margin-bottom:0.75em;">:(</p>\
				<p>An error occured.</p><p><a class="ajax retry" tabindex="0.1">Retry</a>&emsp;<a class="ajax cancel" tabindex="0.2">Cancel</a></p>\
				<p style="font-size:small;">Result: ' + errorThrown + '</p></div>';

			tip.loadingAnimation.message($targetElement, message);
			// Remove focus from clicked link
			if (typeof linkObject == 'object') { $(linkObject).blur(); }
			
			$('.ajax.cancel',overlayNav).click(function() {
				$(document).off('keydown.tip.ajax.pageLoader');
				tip.loadingAnimation.remove($targetElement);
			});
			$('.ajax.retry',overlayNav).click(function() {
				$(document).off('keydown.tip.ajax.pageLoader');
				$('.ajax.message', $targetElement).hide();
				tip.ajax.pageLoader(url);
			});
			$(document).off('keydown.tip.ajax.pageLoader');
			$(document).on('keydown.tip.ajax.pageLoader', function(e) {
				switch (e.which) {
					case 13:
						$(document).off('keydown.tip.ajax.pageLoader');
						tip.ajax.pageLoader(url);
						break;
					case 27: 
						$(document).off('keydown.tip.ajax.pageLoader');
						tip.loadingAnimation.remove($targetElement);
						break;
					}
			});
			
			if ($(window).scrollTop() > scrollPos) {
				$('html, body').animate({ scrollTop: scrollPos }, 500);
			}
		}	

		function success(data, textStatus, jqXHR) {
			var $animationContainer = $(document.createElement('div')).addClass('animation-container'),
				$container = $('> .container', $targetElement).first(),
				observer,
				location;

			function contentLoaded() {
				observer.disconnect();
				$container.unwrap();
				tip.svgAttributes('#main');
				tip.pageLoad();
				$('#header .primary a.current-page').focus();
				$('#header .primary a.current-page').blur();
				$('title').text(data.title);
				$('body').removeClass().addClass(data.pageClass);
				$('body').css('overflow-y', '');
				$('body').css('overflow-x', '');
				tip.loadingAnimation.remove(
					$targetElement,
					{speed: 100},
					function() { $(window).trigger(window.onAjaxNavigateFinished); }
				);
			}
			
			history.pushState(null, data.title, url);
			$(window).trigger(window.onNavigate);
			location = tip.currentURL();
			$.each(tip.ajax.prevURL, function(i,e) {
				tip.ajax.prevURL[i] = location[i];
			});
			if ($('body').height() > window.innerHeight) $('body').css('overflow-y', 'scroll');
			if ($('body').width() > window.innerWidth) $('body').css('overflow-x', 'scroll');
			$container.wrapAll($animationContainer);
			observer = new MutationObserver(contentLoaded);
			observer.observe($container[0] , {childList: true, subtree: true });
			$animationContainer.fadeOut(
				100,
				function() { $container.html(data.contents); }
			);		
		}
	},
}

tip.background = function() {
	var resolution = null, factor,
		resolutions = {
			'1920px': false,
			'1440px': false,
			'1280px': false,
			'1024px': false,
		},
		execTimer = new tip.ExecTimer(exec);
	
	function exec() {
		factor = 6;
		$('#bgs').css('top', (-$(window).scrollTop()/factor) + 'px');
	}
	exec();

	for (var key in resolutions) {
		if (
			(window.matchMedia('(min-device-width: ' + key + ')').matches ||
				window.matchMedia('(min-device-height: ' + key + ')').matches) &&
			!resolution
		) {
			resolution = key;
		}
	};
	if (!resolution) { resolution = '640px'; }
	$('<div id="bgs"></div>').insertBefore($('#header'))
	$('#bgs').append($('<img />', {
		class: 'bg',
		src: SITE_ROOT + 'assets/img/bg_' + resolution.slice(0, -2) + '.jpg'
	}));
	$('#bgs').append($('<div></div>', {class: 'bg'}).css({
		position: 'absolute',
		bottom: '0',
		height: '384px',
		'background-image': 'linear-gradient(to bottom, hsla(46, 100%, 92.5%, 0) 0%, hsl(46, 100%, 92.5%) 100%)'
	}));

	$(window).scroll(execTimer.exec);
}

tip.backToTop = function() {
	var $backToTop = $(document.createElement('button')).attr('aria-hidden', 'true').addClass('back-to-top intra-page float'),
		execTimer;

	tip.backToTop.exec = function() {
		if (!$('#main > .container').length) return;
		var pos = $(window).scrollTop() + window.innerHeight,
			threshold = {
				min: $(window).height() * 2,
				max: $('#main').offset().top + $('#main').outerHeight()
			},
			left = $('#main > .container').offset().left
				+ $('#main > .container').width()
				+ parseFloat($('#main > .container').css('padding-left'))
				- $backToTop.outerWidth();

		$backToTop.css('left', left + 'px');
		if (pos < threshold.min)
			$backToTop.removeClass('visible in-range above-range');
		else if (pos < threshold.max)
			$backToTop.removeClass('above-range').addClass('visible in-range');
		else
			$backToTop.removeClass('in-range').addClass('visible above-range');
	}

	execTimer = new tip.ExecTimer(tip.backToTop.exec);
	$(window).on('resize.backToTop scroll.backToTop', execTimer.exec); 
	$backToTop.html('<div class="arrow">&laquo;</div><span class="text">Top</span>');
	$backToTop.appendTo('#main');
	$backToTop.off('click');
	$backToTop.on('click', function() {
		$(this).blur();
		$('html, body').animate({scrollTop: 0}, 250);
	});
}

tip.currentPageClass = function() {
	$('a').each(function() {
		if (tip.isSameTarget(this.href)) { $(this).addClass('current-page'); }
		else { $(this).removeClass('current-page'); }
	});
}

tip.headerNavPrimary = function() {
	var $nav = $('#header-nav-primary'),
		$menu = $('.menu', $nav),
		$aElm = $('a', $menu),
		paddingInitial = parseInt($aElm.css('padding-top')),
		execTimer = new tip.ExecTimer(exec);

	function exec() {

		(function menuHeight() {
			var menuMinHeight;
			if (window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('print').matches) {
				if ($menu.css('min-height')) $menu.css('min-height', '');
			} else {
				menuMinHeight = window.innerHeight - $menu.offset().top;
				$menu.css('min-height', menuMinHeight + 'px');
			}
		})();

		(function aElmHeight() {
			if($('body').hasClass('lightbox-visible')) return;

			var paddingDelta, paddingNew,
				navSuperHeight = $('#header-nav-super').height();
			
			if ($(window).scrollTop() >= navSuperHeight) {
				$nav.addClass('fixed');
				if (window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('print').matches) {
					paddingDelta = (navSuperHeight - $(window).scrollTop())/2;
					paddingNew = paddingInitial + paddingDelta;
					if (paddingNew <= paddingInitial) {
						if (paddingNew < Math.ceil(paddingInitial/2)) paddingNew = Math.ceil(paddingInitial/2);
						if (paddingNew == parseInt($aElm.css('padding-top'))) return;
						var paddingNewPx = paddingNew + 'px';
						$aElm.css({
							'padding-top': paddingNewPx,
							'padding-bottom': paddingNewPx
						});
					}
				} else {
					$aElm.css({
						'padding-top': '',
						'padding-bottom': ''
					});
				}
			} else {
				$nav.removeClass('fixed');
				$aElm.css({
					'padding-top': '',
					'padding-bottom': ''
				});
			}
			if (
				$(window).scrollTop() >= navSuperHeight
				&& (window.matchMedia('(min-width: 1024px)').matches || window.matchMedia('print').matches)
				&& paddingNew < paddingInitial
				&& paddingNew > Math.ceil(paddingInitial/2)
			) $nav.addClass('height-variable');
			else $nav.removeClass('height-variable');
		})();
	}

	exec();
	$(window).on('resize.headerNavPrimary scroll.headerNavPrimary', execTimer.exec);


}

tip.icons = function(scope) {
	tip.icons.backgrounds = {};
	var icons = typeof scope === 'string' ? $('.icon .image', scope) : $('.icon .image');

	// Create object of backround image URLs and the elements that use it.
	icons.each(function() {
		var image = $(this).css('background-image');
		if (image == 'none') return;
		image = image.replace(/^url\("?/i, '').replace(/"?\)$/i, '');
		if (!tip.icons.backgrounds.hasOwnProperty(image)) tip.icons.backgrounds[image] = {
			loaded: null,
			elements: []
		};
		if ($.inArray(this, tip.icons.backgrounds[image].elements) === -1 ) tip.icons.backgrounds[image].elements.push(this);
	});

	// Attempt to load images. If successful, hide the alt element for the image div.
	$.each(tip.icons.backgrounds, function(url, obj) {
		if (obj.loaded !== null) return;
		$.ajax(url)
			.done(function() {
				obj.loaded = true;
				$(obj.elements).closest('.icon').addClass('alt-hidden');
				$('.alt', obj.elements).each(function() {
					$(this).closest('.icon').append($('<div class="tooltip">' + this.innerHTML + '</div>'));
					$(this).remove();
				});
				$(obj.elements).each(function() {
					tip.tooltips($(this).closest('.icon'));
				});
			})
			.fail(obj.loaded = false)
	});
}

tip.isSameTarget = function(url, currentURL) {
	var currentBaseURL,
		a = document.createElement('a'),				
		baseURL;

	if (currentURL) {
		if (!(currentURL.protocol && currentURL.hostname && currentURL.pathname))
			throw new Error('Invalid value for \'currentURL\'');

		currentBaseURL = currentURL.protocol + '//' + currentURL.hostname + currentURL.pathname;
		
		if (currentBaseURL.substr(-1) === '/')
			currentBaseURL = currentBaseURL.slice(0, -1);
	}
	else currentBaseURL = tip.currentURL().baseNoTrailingSlash;

	a.href = url;
	baseURL = a.protocol + '//' + a.hostname + a.pathname;
	baseURL = a.pathname.substr(-1) === '/' ? baseURL.slice(0, -1) : baseURL;
	
	return baseURL === currentBaseURL;
}

tip.jumpTo = function() {
	var hash = tip.currentURL().hash.slice(1);
	if (targetExists(hash)) doJump(hash);
	attachListeners();

	$(window).on('ajaxNavigateFinished.jumpTo', function() {
		doJump(tip.currentURL().hash.slice(1));
		attachListeners();
	});

	$(window).on('popstate', function() {
		doJump(tip.currentURL().hash.slice(1));
	});

	function targetExists(name) {
		return $('[name="' + name + '"]').length > 0; // Target exists
	}
	function attachListeners() {
		$('a[href^="#"]')
			.filter(function() {
				return targetExists($(this).attr('href').substr(1));
			})
			.off('click.jumpTo')
			.on('click.jumpTo', function(event){ doJump($(this).attr('href').substr(1)) });
				
	}
	function doJump(name) {
		if(!targetExists(name)) return false;

		var currentScroll = {x: window.scrollX, y: window.scrollY},
			$target = $('[name="' + name + '"]').first(),
			targetOffset = $target.offset(),
			viewport = {width: window.innerWidth, height: window.innerHeight},
			fontSize = parseInt($target.css('font-size')),
			scrollTo = {x: targetOffset.left - fontSize, y: targetOffset.top - fontSize},
			instantaneous;

		if (scrollTo.y > $('#header-nav-super').outerHeight()) scrollTo.y -= 34; // account for fixed primary header

		instantaneous = Math.abs(currentScroll.y - scrollTo.y) > viewport.height || Math.abs(currentScroll.x - scrollTo.x) > viewport.width; // use instantaneous scrolling if the amount to scroll is greater than the viewport width and/or height.

		if (instantaneous) window.scrollTo(scrollTo.x, scrollTo.y);
		else $('html, body').animate({
				scrollLeft: scrollTo.x,
				scrollTop: scrollTo.y
			}, 500);
	}
}

tip.keydownListener = function() {
	$(document).on('keydown.keydownListener', function(e) {
		switch (e.which) {
			// Enter
			case 13:
				document.activeElement.click();
				break;
			// Escape
			case 27: 
				break;
		}
	});
}

tip.loadingAnimation = {
	add: function(object, settings, callback) {
		var speed = 0, classes = null;
		if (typeof settings == 'function' && !callback) {
			callback = settings;
		} else if (typeof settings == 'object') {
			if ('speed' in settings) { speed = settings.speed; }
			if ('classes' in settings) { classes = settings.classes; }
		}
		$(object).prepend(
			'<div class="overlay" style="display:none;">\
				<div class="loading-animation">\
					<div class="sk-folding-cube">\
						<div class="sk-cube1 sk-cube"></div>\
						<div class="sk-cube2 sk-cube"></div>\
						<div class="sk-cube3 sk-cube"></div>\
						<div class="sk-cube4 sk-cube"></div>\
					</div>\
				</div>\
			</div>'
		);
		$('> .overlay', object).addClass(classes);
		$('> .overlay', object).fadeIn(speed, function() {
			if (typeof callback == 'function') { callback(); }
		});
	},
	message: function(object, message) {
		$('> .overlay', object).html(message);
	},
	remove: function(object, settings, callback) {
		var speed = 400;
		if (typeof settings == 'function' && !callback) {
			callback = settings;
		} else if (typeof settings == 'object') {
			if ('speed' in settings) { speed = settings.speed; }
		}
		$('> .overlay', object).fadeOut(speed, function() {
			$('> .overlay', object).remove();
			if (typeof callback == 'function') { callback(); }
		});
	}
}

tip.mainHeight = function() {
	var headerHeight, footerHeight, mainMinHeight,
		execTimer = new tip.ExecTimer(exec);

	function exec() {
		headerHeight = $('#header').height();
		footerHeight = $('#footer').height();
		mainMinHeight = window.innerHeight - headerHeight - footerHeight;
		if (window.matchMedia('(min-width: 1024px)').matches) {
			$('#main').css('min-height', mainMinHeight);
			$('#main > .container').css('min-height', '');
		} else {
			$('#main').css('min-height', '');
			$('#main > .container').css('min-height', mainMinHeight);
		}
	}
	exec();

	$(window).on('resize.mainHeight', execTimer.exec);
}

tip.menusInit = function() {
	tip.menus = tip.menus || {};
	tip.menus.headerPrimary = new tip.Menu('#header-nav-primary');
}

tip.msie = function() {
	if ($.inArray(tip.browser.name, ['MSIE', 'Edge']) != -1) {

		$('html').addClass(tip.browser.name.toLowerCase());

		if ($('body').hasClass('front-page')) {
			(function setSpeed() {
				if ($('#carousel-it') && typeof $('#carousel-it').data('carousel') == 'object') {
					$('#carousel-it').data('carousel').speed = 0;
				} else {
					window.setTimeout(setSpeed, $.fx.interval);
				}
			})();
		}
	}
	if ($('html.ie-old').length && !Cookies.get('ie-warn-close')) {
		var alert, string;
		switch (tip.oS) {
			case 'Windows 2000 / Server 2000':
			case 'Windows XP':
			case 'Windows XP Pro x64 / Windows Server 2003':
				var osText, supportEnd;
				switch (tip.oS) {
					case 'Windows 2000 / Server 2000':
						osText = 'Windows 2000';
						supportEnd = '2010';
						break;
					case 'Windows XP':
					case 'Windows XP Pro x64 / Windows Server 2003':
						osText = 'Windows XP';
						supportEnd = '2014';
						break;
				}
				string = '<p style="font-size: 4em; margin-bottom:0.5em;" aria-hidden="true">&#9888;</p><p>It appears that you are using an old version of Internet Explorer on ' + osText + ', which may cause this site to not work correctly.</p><p><b>Using ' + osText + ' creates a <em>serious</em> security risk for you</b> as security updates for ' + osText + ' ended in ' + supportEnd + '. Just by connecting your computer to the internet, you may be exposing yourself to viruses and identity theft.</p><p>Please <a href="https://microsoft.com/windows/" target="_blank">upgrade to your computer to a current version of Windows</a>.</p>';
				break;
			case 'Windows Vista / Server 2008':
				string = '<p style="font-weight:bold; font-size: 2em; margin-bottom:0.75em;">:(</p><p>It appears that you are using a version of Internet Explorer that has been depreciated (i.e. discontinued). <b>This creates a security risk for you</b> and it may cause this site to not work correctly.</p><p>Unfortunately, the version of Windows that you are using does not support the latest version of Internet Explorer. Please either <a href="https://microsoft.com/windows/" target="_blank">upgrade to your computer to a newer version of Windows</a> or use another modern web browser such as <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>, <a href="https://www.mozilla.org/firefox/" target="_blank">Mozilla Firefox</a>, or <a href="https://opera.com/" target="_blank">Opera</a>.';
				break;
			default:
				string = '<p style="font-weight:bold; font-size: 2em; margin-bottom:0.75em;">:(</p><p>It appears that you are using a version of Internet Explorer that has been depreciated (i.e. discontinued). <b>This creates a security risk for you</b> and it may cause this site to not work correctly.</p><p>Please <a href="https://microsoft.com/ie/" target="_blank">upgrade to the latest version of Internet Explorer</a>, or use another modern web browser such as <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>, <a href="https://www.mozilla.org/firefox/" target="_blank">Mozilla Firefox</a>, or <a href="https://opera.com/" target="_blank">Opera</a>.';
				break;
		}
		string += '<p style="margin-bottom:0;"><a href="#" id="ie-warn-close" onClick="event.preventDefault(); document.getElementById(\'ie-warn\').remove();Cookies.set(\'ie-warn-close\', true);">Close</a></p>';
		alert = $(document.createElement('div')).attr({
				id: 'ie-warn',
				role: 'alert'
			})
			.addClass('alert alert-warning')
			.html(string);
		$('body').prepend(alert);
	}
}

tip.page = {
	create: function(page, navigateOff) {
		if (!page.length) throw new Error('No page name provided.');

		tip.page[page] = tip.page[page] || {};

		tip.page[page].name = page;
		tip.page[page].navigateOff = navigateOff;
		tip.page[page].onNavigate = function(page, navigateOff) {
			// Check for whether navigate events are active. If not, add a listener for this page.
			if(!$._data(window, 'events').navigate || !$._data(window, 'events').navigate[page]) {
				$(window).on('navigate.' + page,
					function (e) {
						// If the window navigates away from current page, stop listening for navigate events from this page and remove the top level function for cleanup.
						if (e.target.location.href != SITE_ROOT + page) {
							$(window).off('navigate.' + page);
							if (typeof navigateOff === 'function') navigateOff.call();
							delete tip.page[page];
						}
				});
			}
		}(page, navigateOff);
	}
}

tip.pageLoad = function() {
	var functions = {
		msie: '',
		currentPageClass: '',
		icons: '#main',
		svgAttributes: '',
		tooltips: '',
	};
	tip.ajax.attachListeners();
	tip.backToTop.exec();
	$.each(functions, function(theFunction, args) {
		//try {
			var fn = tip[theFunction];
			if (typeof args !== 'array' && typeof args !== 'undefined') args = [args];
			if (typeof fn === "function") fn.apply(tip, args);
		//}
		//catch (e) { console.error(e.name + ': ' + e.message); }
	});
}

tip.preloadImages = function(imgs) {
	if (typeof imgs == 'object') {
		for (var i = 0; i < imgs.length; i++) {
			$("<img />").attr("src", imgs[i]);
		}
	} else {
		$("<img />").attr("src", imgs);
	}
	tip.svgAttributes('#main');
}

tip.randInt = function(base) {
	var base = base || 10;
	return (Math.floor(Math.random()*4294967295)+1).toString(base);
}

tip.scopeWarn = function(functionName) {
	console.warn('Function \'' + functionName + '\' should be instantiated with \'new\' operator.')
}

tip.setTabIndicies = function() {
	var tabIndicies = $("[tabindex]").map(function() {
			return $(this).attr('tabindex')
		}),
		tabIndexGreatest = Math.max.apply(Math, tabIndicies),
		focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [contentEditable=true]',
		noTabIndex = $(focusable).not('[tabindex]');

	$(noTabIndex).each(function() {
		tabIndexGreatest++;
		$(this).attr('tabindex', tabIndexGreatest);
	});
	$(focusable, '#header .super').each(function(){
		tabIndexGreatest++;
		$(this).attr('tabindex', tabIndexGreatest);
	})
}

tip.svgAttributes = function(context) {
	var images = {}, ajaxs = 0, context = context || 'body';

	$('.icon.svg', context).each(function () {
		var bgImage = $('.image', this).length > 0 ? $('.image', this).css('background-image') : $(this).css('background-image');
		if (bgImage) {
			bgImageURL = bgImage.replace(/^url\("/i, '').replace(/"\)$/i, '');
			if (images[bgImageURL] === undefined) {
				images[bgImageURL] = null;
				ajaxs++;
				$.ajax({
					url: bgImageURL,
					type: 'HEAD',
					accepts: 'svg+xml'
				})
				.done(function() { images[bgImageURL] = true; })
				.fail(function() { images[bgImageURL] = false; })
				.always(function() {
					ajaxs--;
					if (ajaxs === 0) { replaceImages() }
				})
			}
		}
	});
	function replaceImages() {
		$('.icon', context).each(function () {
			var self = this;
			var bgImage = $('.image', this).length > 0 ? $('.image', this).css('background-image') : $(this).css('background-image');
			if (bgImage) {
				bgImageURL = bgImage.replace(/^url\("/i, '').replace(/"\)$/i, '');
				if (images[bgImageURL] === true) replaceImage(self, bgImage);
			}
		});
	}
	function replaceImage(self, bgImage) {
		var image = $('.image', self).length > 0 ? $('.image', self) : $(self);
		if ($(self).hasClass('svg') && bgImage.indexOf('?') == -1) {
			var fill = $(self).closest('[data-svg-fill]').attr('data-svg-fill'),
				background = $(self).closest('[data-svg-background]').attr('data-svg-background'),
				params = {};
			if (fill) params['fill'] = fill;
			if (background) params['background'] = background;
			$.each(params, function(i,e) {
				if (e == 'inherit') { params[i] = $(self).css('color'); }
			})
			if (Object.keys(params).length) {
				params = '?' + $.param(params);
				bgImage = bgImage.slice(0, -2) + params + '")';
				image.css('background-image', bgImage);
				image.css('width', '1em');
				if ($('.alt', self).length > 0) { $('.alt', self).remove(); }
			}
		}
		
		var bgPos = image.css('background-position').split(' ');
		if (!parseInt(bgPos[1])) {
			var icons = ['at-sign', 'cloud', 'computer', 'handset', 'linkedin', 'phone', 'printer', 'server', 'twitter'];
			$(icons).each(function(i,e) {
				if ($(self).hasClass(e)) {
					bgPos[1] = i/(icons.length-1) * 100 + '%';
					//bgPos[1] = (10 * ((icons.length - (i+1)) / (icons.length-1) ) + 110*i ) / (110*icons.length-100) * 100 + '%';
					bgPos = bgPos[0] + ' ' + bgPos[1];
					image.css('background-position', bgPos);
				}
			});
		}
	}
}

tip.tooltips = function(context) {
	if (typeof context === 'object' && context instanceof Array) {
		$(context).each(function() {
			tip.tooltips(this);
		});
		return;
	}
	
	var selector = typeof context === 'object' && context instanceof jQuery ? $('.tooltip', context) : $('.tooltip');
	selector.closest('.icon').each(function() {
		if (typeof $._data(this, 'events') !== 'object' || !$._data(this, 'events').hasOwnProperty('mouseenter.tooltip')) {
			$(this).on('mouseenter.tooltip', function() {
				this.mouseover = true;
				var self = this;
				setTimeout(function() {
					if (self.mouseover) $('.tooltip', self).fadeIn(200);
				}, 1000);
			});
		}
		if (!$._data(this, 'events').hasOwnProperty('mouseleave.tooltip')) {
			$(this).on('mouseleave.tooltip', function() {
				this.mouseover = false;
				$('.tooltip', this).fadeOut(100);
			});
		}
	});
}

tip.currentURL = function() {
	var location = window.location,
		currentURL = {
			protocol: location.protocol,
			hostname: location.hostname,
			pathname: location.pathname,
			hash: location.hash
		}
	currentURL.base = currentURL.protocol + '//' + currentURL.hostname + currentURL.pathname;
	currentURL.baseNoTrailingSlash = currentURL.pathname.substr(-1) === '/'
		? currentURL.base.slice(0, -1)
		: currentURL.base;
	return currentURL;
}

$(document).ready(function(){
	$('noscript').remove();
	window.onNavigate = $.Event('navigate');
	window.onAjaxNavigateFinished = $.Event('ajaxNavigateFinished');
});

$(window).load(function() {
	if (!window.console) console = {log: function() {}};
	
	// todo: add support for nested object methods
	var functions = [
		'headerNavPrimary',
		'icons',
		'menusInit',
		'setTabIndicies',
		'background',
		'mainHeight',
		'jumpTo',
		'backToTop',
		'keydownListener',
		'pageLoad'
	];

	tip.ajax.init();

	$.each(functions, function() {
		//try {
			var fn = tip[this];
			if (typeof fn === "function") fn();
		//}
		//catch (e) { console.error(e.name + ': ' + e.message); }
	});

	$('script.site-root').remove();
	setTimeout(function() {
		$('body > .overlay').fadeOut('250ms', function(){
			$(this).remove();
		})
	  },
	  250
	);
});