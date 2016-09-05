<?php 
/**
 *  config.php
 *
 *  Note that this file configures app initiation, whereas includes/config.php handles app-level configuration.
 */

if(__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
    http_response_code(403);
	exit('This file can not be accessed directly.');
}

ini_set( 'display_errors', 1 );

define('APPNAME', 'App');

spl_autoload_register(function($class) {
	$path = ABSPATH . 'includes/' . $class . '.php';
    include preg_replace('/\\\/', DIRECTORY_SEPARATOR, $path);
});

?>