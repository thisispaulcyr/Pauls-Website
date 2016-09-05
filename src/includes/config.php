<?php
/**
 *  includes/config.php
 *
 *  Note that this file handles app-level configuration, whereas the root config.php file configures app initiation.
 */ 
namespace App;

Class Config {

	public static $servername, $username, $password, $dbname, $emailToName, $emailToAddress;
	
	const SITE_NAME = '';

	public static function load() {

		// Set unicode encoding
		mb_internal_encoding('UTF-8');
		mb_http_output('UTF-8');
		mb_http_input('UTF-8');
		mb_language('uni');
		mb_regex_encoding('UTF-8');

		// Constants
		define('HTTP_PROTOCOL', $_SERVER['HTTPS'] ? 'https://' : 'http://');
		define('HTTP_HOST', $_SERVER['HTTP_HOST']);
		define('SITE_ROOT_PATH', dirname($_SERVER['PHP_SELF']) . '/');
		define('SITE_ROOT_URL', HTTP_PROTOCOL . HTTP_HOST . SITE_ROOT_PATH);

		define('CAPTCHA_SITE_KEY', '');

		// Email
		self::$emailToName = 'Jane Jameson';
		self::$emailToAddress = 'email@mysite.local';

		// Database
		self::$servername = 'localhost';
		self::$dbname = '';
		self::$username = '';
		self::$password = '';

	}
}

?>