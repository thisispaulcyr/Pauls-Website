// scroll-snap.js

function scrollSnap() {
	scrollSnap.create();
	scrollSnap.init();
	scrollSnap.exec();
}

scrollSnap.init = function() {
	var resizeExecTimer = new ExecTimer(100, backToTop.exec);
	$(window).on('resize.backToTop', function() {
		if(!resizeExecTimer.triggered) {
			resizeExecTimer.exec();
		}
	});

	var scrollExecTimer = new ExecTimer(jQuery.fx.interval, backToTop.exec);
	$(window).scroll(function() {
		if(!scrollExecTimer.triggered) {
			scrollExecTimer.exec()
		}
	});
}

scrollSnap.exec = function(snappedObject, container) {
	var objectOffsetY = $(snappedObject).offset().top;
	var threshold = {
		min: $(container).offset().top,
		max: $(container).offset().top + $(container).outerHeight() - $(snappedObject).outerHeight()
	};
	if(Math.abs(parseInt($(snappedObject).css('right')) - $('body').width()*0.02) > 1)
		$(snappedObject).css('right', $('body').width()*0.02 + 'px');
	if($(window).scrollTop() + $(window).outerHeight()) {
		$(snappedObject).css('top', threshold.min - $(window).scrollTop());
	} else if(pos < threshold.max) {

		$(snappedObject).removeClass('snapped-above-range');
		$(snappedObject).addClass('snapped-in-range');
	} else {
		$(snappedObject).removeClass('snapped-in-range');
		$(snappedObject).addClass('snapped-above-range');
	}
	}
}