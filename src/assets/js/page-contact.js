// page-contact.js
var i=0;
(function page() {
    if (typeof tip !== 'object') {
        i++;
        if (i<=25) { setTimeout(function() { page(); }, 200); }
        else { throw 'dependency error: Required object \'tip\' is missing.' }
        return;
    }
    
    tip.page.create('contact');

    // Create form
    tip.page.contact.form = new tip.Form(
        '#contact', {
            messages: {
                error: {
                    validation: {
                        GENERAL: 'There was an error with some of the information you entered. Please re-check your entries and try again.</p>'
                            + '<p style="font-size:small;">If you still receive this message after re-checking what you entered, please contact me using the email address or phone number provided at the top of this page.'
        }}}}
    );

    // Add captcha
    (tip.page.contact.form.captcha = function() {

        if(typeof grecaptcha == 'object') {
            // Timeout to deal with reCaptcha bug with async reloading
            setTimeout(function() { grecaptcha.render('g-recaptcha', {'sitekey' : tip.page.contact.form.options.captchaKey}) }, 1000);
        }
        else if (window.location.href == SITE_ROOT + 'contact') {
            setTimeout(function() { tip.page.contact.form.captcha(); }, 100);
        }
    })();

})();
