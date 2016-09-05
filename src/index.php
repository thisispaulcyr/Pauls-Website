<?php
/**
 *  index.php
 */

// Handle errors from non-OO extensions & internal functions.
function exception_error_handler($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        // This error code is not included in error_reporting
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler('exception_error_handler', E_ERROR);

function defaultError() {

	$defaultMessage = 'An unknown error occured.';
	http_response_code(500);
	$errorFilePath = APPNAME . '/error.php';

	if (file_exists($errorFilePath)) {
		try { require $errorFilePath; }
		catch (Exception $e1) { echo $defaultMessage; }
	}
	else { echo $defaultMessage; }
	
}

try {
	define('ABSPATH', dirname(__FILE__) . '/');
	require ABSPATH . 'config.php';
	require ABSPATH . 'includes/' . APPNAME . '/Main.php';
	App\Main::load();
}
catch (Exception $e) { defaultError(); }

?>