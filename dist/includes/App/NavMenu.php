<?php
/**
 *  includes/content/NavMenu.php
 */
namespace App;

class NavMenu {
	
	public $items;
	public $settings;

	function __construct(array $items, array $settings = NULL) {
		$this->items = (array) $items;
		$this->settings = (array) $settings;
	}

	function generate($settings = NULL) {
		if($settings) {
			$this->settings = $this->settings + $settings;
		}
		echo '<div class="menu" role="menu" tabindex="-1">' . PHP_EOL;
		$items = $this->items;
		for ($i = 0; $i < count($items); $i++) {
			$attributesString = '';
			$attributes = ['id', 'class', 'href', 'target'];
			if (!array_key_exists('class', $items[$i])) $items[$i]['class'] = '';
			if (array_key_exists('icon', $items[$i])) {
				$items[$i]['class'] .= ' icon ' . $items[$i]['icon'];
				if(array_key_exists('svg', $settings) && $settings['svg'])
					$items[$i]['class'] .= ' svg';
			}
			foreach ($attributes as $attribute) {
				if (array_key_exists($attribute, $items[$i])) {
					$attributesString .= " " . $attribute . "= \"" . $items[$i][$attribute] . "\""; 
				}
			}

			if(array_key_exists('set', $settings)) {
				$tabindex = $settings['set'];
			} else {
				$tabindex = $i+1;
				if(array_key_exists('multiply', $settings)) {
					$tabindex *= $settings['multiply'];
				}
				if(array_key_exists('offset', $settings)) {
					$tabindex += $settings['offset'];
				}
			}
			$attributesString .= " tabindex=\"" . $tabindex . "\"";
	    	echo '<a ' . $attributesString . ' role="menuitem">';
	    	if (array_key_exists('icon', $items[$i])) {
	    		echo '<div class="image">';
				if(array_key_exists('alt', $items[$i])) echo '<span class="alt">' . $items[$i]['alt'] . '</span>';
				echo '</div>';
	    	} elseif (array_key_exists('label', $items[$i])) {
	    		echo $items[$i]['label'];
	    	}
	    	echo '</a>' . PHP_EOL;
	    }
	    echo '</div>' . PHP_EOL;
	}
}
?>