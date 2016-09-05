<?php
/**
 *  includes/File.php
 */ 
namespace App;

Class File {

	public $fileName, $filePath;
    private $openGraph;

	function __construct($fileName, $fileRoot = null) {
		$this->fileName = $fileName;
		$this->filePath = $fileRoot ? $fileRoot : ABSPATH;
	}
    
    public function contents() {
        ob_start();
            if(substr($this->fileName, -4) == '.php') {
                include($this->filePath);
            } else {
                readfile($this->filePath); 
            }
            $contents = ob_get_contents();
        ob_end_clean();
        return $contents;
    }
}

?>