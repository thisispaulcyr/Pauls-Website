<?php
/**
 *  includes/_404.php
 */
namespace App\_404;

if(__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
	header('Location: ' . SITE_ROOT_URL, TRUE, 403);
	exit('This file can not be accessed directly.');
}

set_page_title('Page Not Found');
?>
<div class="container">
    <h1 class="dontRead"><?php _e('Page Not Found'); ?></h1>
    <p><?php echo sprintf(_('If there should be a page here, please <a href="%s">let us know</a>.'), SITE_ROOT_URL . _('contact')); ?></p>
</div>