// validator.js

var tip = tip || {};

tip.validator = function(selector, Form, messages, submitHandler) {

	// Require instantiation
	if (!(this instanceof tip.validator)) {
		tip.scopeWarn('validator');
		return new tip.validator(selector, messages, submitHandler);
	}

	if(typeof $.fn.validate !== 'function') {
		var folder = SITE_ROOT + 'assets/js/jquery.validate/';
		$.getScript(folder + 'jquery.validate.min.js',
			function() { $.getScript(folder + 'additional-methods.min.js'); }
		);
	}

	selector = selector || 'form';
	messages = messages || {
		'name-first': 'Enter your first name.',
		'name-last': 'Enter your last name.',
		'street-address': 'Enter a valid street address or leave blank.',
		'city': 'Enter a valid city name or leave blank.',
		'pcode': 'Enter a valid postal / ZIP code or leave blank.',
		'email': 'Enter your email address.',
		'tel': 'Enter a valid telephone number or leave blank.',
		'subject': 'Enter a message subject.',
		'message': 'Enter a message.'
	};

	(function init() {
		if(typeof $.fn.validate === 'function') {
			$(selector).validate({
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
					if(element.parent('.form-group').hasClass('has-error')) {
						error.hide();
						error.addClass('help-block');
						error.insertAfter($(element).siblings('.control-label').first());
						error.slideDown('fast');
					}
				},
				success: function(label) {
					label.slideUp('fast', function() { $(this).remove(); });
				},
				messages: messages,
				submitHandler: function() { submitHandler(Form) }
			});
		}
		else { setTimeout(function() { init(); }, 100); }
	})();
}