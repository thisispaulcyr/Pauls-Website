<?php
/**
 *  pages/404.php
 */
namespace app;

$this->titleSet('Page Not Found');
?>
<h1 role="presentation">(&#xE4F;&#x2009;&#x32F;&#x361;&#xE4F;&#x2009;)</h1>
<h2><?php _e('Page Not Found'); ?></h2>
<p><?php echo sprintf(_('If there should be a page here, I would be grateful if you would <a href="%s">send me a note</a> to let me know.'), SITE_ROOT_URL . _('contact')); ?></p>