<?php
/**
 *  includes/App/Main.php
 */
namespace App;

Class Main {

    public static function load() {

		require ABSPATH . 'includes/config.php';
		Config::load();

		require 'includes/functions.php';

    	switch($_SERVER['REQUEST_METHOD']) {
			case 'GET':
			case 'HEAD':
				try { Get::exec(); }
				catch (Exception $e) { defaultError(); }
				break;
			case 'OPTIONS':
				header('Allow: GET, HEAD, OPTIONS, POST', TRUE, 204);
				break;
			case 'POST':
				$post = new Post();
				$post->exec();
				break;
			default: 
				// Disallowed: CONNECT, DELETE, PATCH, PUT, TRACE
				header('Allow: GET, HEAD, OPTIONS, POST', TRUE);
				header('Location: ' . SITE_ROOT_URL, TRUE, 405);
		}
	}
}
?>