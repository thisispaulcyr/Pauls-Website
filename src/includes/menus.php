<?php
/**
 *  includes/menus.php
 *
 *  Note that this file handles app-level configuration, whereas the root config.php file configures app initiation.
 */
namespace App;
use App\NavMenu;

if(__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
	header('Location: ' . SITE_ROOT_URL, TRUE, 403);
	exit('This file can not be accessed directly.');
}

$menuSuper = [
	["href" => "https://ca.linkedin.com/in/paulcyr1", "title" => "Go to my LinkedIn profile", "target" => "_blank", "icon" => "linkedin", "alt" => "LinkedIn"],
    ["href" => "mailto:web@thisispaul.ca?subject=Web%20Inquiry", "target" => "_blank", "icon" => "email", "alt" => "Email"],
    ["href" => "tel:+1-226-476-1961", "target" => "_blank", "icon" => "phone", "alt" => "Telephone"]
];
$this->menuSuper = new NavMenu($menuSuper);

$menuPrimary = [
    ["href" => SITE_ROOT_URL, "label" => _('Home')],
	["href" => SITE_ROOT_URL . _('about'), "label" => _('About')],
    ["href" => SITE_ROOT_URL . _('services'), "label" => _('Services')],
    ["href" => SITE_ROOT_URL . _('contact'), "label" => _('Contact')],
    ["href" => SITE_ROOT_URL . _('login'), "label" => _('Client Login'), "class" => 'login']
];
$this->menuPrimary = new NavMenu($menuPrimary);
?>