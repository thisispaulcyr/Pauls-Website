<?php
/**
 *  includes/Page.php
 */ 
namespace App;
use App\ContentBlock;

Class Page extends Main {

	public $fileName, $filePath, $page_title, $page_title_override, $className, $canonicalURL;
    private $head, $foot, $openGraph;

    public static $site_title = Config::SITE_NAME;

	function __construct($fileName, $fileRoot = null) {
		$this->fileName = $fileName;
		$this->filePath = $fileRoot ? $fileRoot : ABSPATH;

        $title = mb_convert_case(mb_ereg_replace('[-_]', ' ', $this->fileName), MB_CASE_TITLE);
        $this->titleSet($title);

        include ABSPATH . 'includes/menus.php';

        $this->head = new ContentBlock();
        $this->foot = new ContentBlock();

        $this->openGraph = [
            'title' => $this->titleValue(),
            'site_name' => Config::SITE_NAME,
            'author' => 'Paul Cyr',
            'url' => $this->canonicalURL,
            'locale' => 'en_UK',
            'locale:alternate' => 'en_US',
            'locale:alternate' => 'en_CA',
        ];
	}

    private function partPath($name) {
        switch ($name) {
            default:
                $path = ABSPATH . 'includes/';
                break;
        }
        ob_start();
            include($path . $name . '.php');
            $contents = ob_get_contents();
        ob_end_clean();
        return $contents;
    }

    function theHeader() {
        return $this->partPath('header');
    }

    function head($val = null) {
        if ($val) $this->head->add($val);
        else echo $this->head->get();
    }
    
    function contents() {
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

    function theFooter() {
        return $this->partPath('footer');
    }

    function foot($val = null) {
        if ($val) $this->foot->add($val);
        else echo $this->foot->get();
    }

    function titleSet($title, $override = false) {
        $this->page_title = $title;
        $this->page_title_override = $override;
    }

    function titleValue() {
        if($this->page_title_override) {
            return $this->page_title;
        } else {
            if($is_home || !isset($this->page_title)) {
                return Config::SITE_NAME;
            } else {
                return Config::SITE_NAME . ' | ' . $this->page_title;
            }
        }
    }

	function titleGet() {
		echo $this->titleValue();
	}

    function className($special = null) {
        switch ($special) {
            case '404': return '_404';
            default:
                $pos = mb_strrpos($this->fileName, '.');
                return $pos ? mb_substr($this->fileName, 0, $pos) : $this->fileName;
        }
	}

    function openGraphSet($array) {
        array_merge($openGraph, $array);
    }

    function openGraphvalues() {
        $result = '';
        foreach ($values as $property => $content) {
            $result .= '<meata property="' . $property . '" content="' . $content . '" />' . PHP_EOL;
        }
        return $result;
    }

    function openGraphGet() {
        echo $this->openGraphvalues();
    }
}

?>