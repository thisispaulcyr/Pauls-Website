// page-login.js
var i=0;
(function page() {
    if (typeof tip !== 'object') {
        i++;
        if (i<=25) { setTimeout(function() { page(); }, 200); }
        else { throw 'dependency error: Required object \'tip\' is missing.' }
        return;
    }
    
    tip.page.create('client_login');

    tip.page.client_login.css = new tip.PageCSS('client_login');

    // Create form
    tip.page.client_login.form = new tip.Form('#login-client');

})();