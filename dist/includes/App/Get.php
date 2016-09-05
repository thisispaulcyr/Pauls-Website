<?php 
/**
 *  includes/Get.php
 *
 *  Handler for HTTP GET and HEAD methods
 */ 
namespace App;
use App\Page, App\File;

Class Get {

	public static  $fileRoot, $fileName, $requestType, $className, $fileExists, $canonicalURL;
	private static $filePath, $isFileRequest;

	public static function exec() {

		$fileURI = preg_replace('/\?.*/', '', substr($_SERVER['REQUEST_URI'], strlen(SITE_ROOT_PATH)));
		self::$isFileRequest = substr($fileURI, -1) !== '/';
		self::$fileName = self::$isFileRequest 
			? (strrpos($fileURI, '/') === false
				? $fileURI
				: substr($fileURI, strrpos($fileURI, '/')+1))
			: null;

		// Request Type
		if(substr(self::$fileName, -4) == '.php') {
			self::$requestType = 'illegal';
		} else {
			$rootPath = strrpos($fileURI, '/') === false ? $fileURI : substr($fileURI, 0, strpos($fileURI, '/', 1)+1);
			switch ($rootPath) {
				case '':
					self::$requestType = self::$fileName ? 'root-file' : 'front-page';
					break;
				case 'assets/':
					self::$requestType = self::$isFileRequest ? 'asset-file' : 'illegal';
					break;
				default:
					self::$requestType = 'page';
			}
		}

		// Internal Requested Path
		switch (self::$requestType) {
			case 'root-file':
				self::$fileRoot = ABSPATH;
				self::$fileName = $fileURI;
				break;
			case 'front-page':
				self::$fileRoot = ABSPATH . 'pages/';
				self::$fileName = 'front-page.php';
				break;
			case 'asset-file':
				self::$fileRoot = ABSPATH;
				self::$fileName = $fileURI;
				if(file_exists(self::$fileRoot . self::$fileName . '.php'))
					self::$fileName .= '.php';
				break;
			case 'illegal':
				self::$fileRoot = null;
				self::$fileName = null;
				break;
			default:
				self::$fileRoot = ABSPATH . 'pages/';
				self::$fileName = $fileURI . '.php';
		}

		self::$fileExists = file_exists(self::$fileRoot . self::$fileName);

		if (!self::$fileExists) {
			http_response_code(404);
			self::$fileName = '404.php';
			self::$fileRoot= file_exists(ABSPATH . 'pages/' . self::$fileName) ? ABSPATH . 'pages/' : ABSPATH . 'includes/';
		}

		self::$filePath = self::$fileRoot . self::$fileName;
		self::output();
	}

	public static function output() {
		// Root and asset files, or all other requests
		if (self::$fileExists
			&& (self::$requestType == 'root-file' || self::$requestType == 'asset-file')
		) {
			$extension = substr(self::$filePath, -4) == '.php'
				? substr(self::$filePath, 0, strlen(self::$filePath)-4)
				: self::$filePath;
			if(strrpos($extension, '.') === false) {
				$mime = 'application/octet-stream';
			} else {
				$extension = substr($extension, strrpos($extension, '.')+1);
				include_once(ABSPATH . 'includes/ext-mimes.php');
				$mimes = unserialize(EXT_MIMES);
				$mime = array_key_exists($extension, $mimes) ? $mimes[$extension] : 'application/octet-stream';
			}
			header("content-type: $mime; charset=UTF-8");
		}

		$page = new Page(self::$fileName, self::$filePath);
		$contents = $page->contents();

		if($_SERVER['REQUEST_METHOD'] == 'GET') {
			if (self::$fileExists && self::$requestType == 'asset-file') echo $contents;
			elseif (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && strtolower($_SERVER['HTTP_X_REQUEST_TYPE']) == 'ajax') {
				header('Content-Type: application/json');
				$response = [
					'contents' => $contents,
					'pageClass' => self::$fileExists ? $page->className() : $page->className('404'),
					'title' => $page->titleValue()
				];
				echo json_encode($response);
			}
			else {
				echo $page->theHeader();
				echo $contents;
				echo $page->theFooter();
			}
		}
		elseif ($_SERVER['REQUEST_METHOD'] == 'HEAD') {
			if (http_response_code() != 404)
				http_response_code(200);
		}
		else {
			if (http_response_code() != 404)
				http_response_code(400);
		}
	}
}
?>