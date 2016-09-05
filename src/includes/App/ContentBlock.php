<?php
/**
 *  includes/content/ContentBlock.php
 */ 
namespace App;

Class ContentBlock {
	private $block = [];

	public function add($content) {
		$this->block[] = $content;
	}

	public function get() {
		$content = '';
		foreach ($this->block as $blockItem) {
			$content .= $blockItem . PHP_EOL;
		}
		return $content;
	}
}
?>