// page-about.js
var i=0;
(function page() {
    if (typeof tip !== 'object') {
        i++;
        if (i<=25) { setTimeout(function() { page(); }, 200); }
        else { throw 'dependency error: Required object \'tip\' is missing.' }
        return;
    }
    
    tip.page.create('about');

    tip.page.about.css = new tip.PageCSS('about');

    // Add lightboxes
    tip.page.about.lightbox = new tip.Lightbox('about', {gallery: true});

})();
