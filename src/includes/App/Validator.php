<?php
/**
 *  includes/Validator.php
 */
namespace App;

Class Validator {

	public $rules;
	private $rulesDefault;

	function __construct($rules = null) {

		$this->rulesDefault = [
			'ip' => ['filter_var' => FILTER_VALIDATE_IP],
			'ip_http_x_forwarded_for' => [
				'filter_var' => FILTER_VALIDATE_IP,
				'required' => false
			],
			'name-first' => [
				'maxLength' => 19,
				'preg_match' => '/^[\p{L}\p{M}][\p{L}\p{M}\p{P}\p{N}\p{Zs}]*$/'
			],
			'name-last' => [
				'maxLength' => 19,
				'preg_match' => '/^[\p{L}\p{M}][\p{L}\p{M}\p{P}\p{N}\p{Zs}]*$/'
			],
			'street-address' => [
				'maxLength' => 126,
				'preg_match' => '/^[\p{L}\p{P}\p{N}\p{M}][\p{L}\p{P}\p{N}\p{Z}\n^\r\n$\p{M}]{2,40}([\n|\n\r][\p{L}\p{P}\p{N}\p{M}][\p{L}\p{P}\p{N}\p{Z}\n^\r\n$\p{M}]{2,40}){0,2}$/'
			],
			'city' => [
				'maxLength' => 40,
				'preg_match' => '/^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{P}\p{N}\p{Zs}]{2,}$/'
			],
			'prov' => [
				'in_array' => array_merge(
					/* Canada */ ['AB','BC','MB','NB','NL','NS','NU','NW','ON','PE','QC','SK','YK'],
					/* U.S. */ ['AA', 'AE', 'AK', 'AL', 'AP', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY']
					)
			],
			'pcode' => [
				'maxLength' => 10,
				'preg_match' => '/^[\p{L}\p{M}\p{N}]{2}[\p{L}\p{M}\p{Pd}\p{N}\p{Zs}]*$/'
			],
			'email' => ['filter_var' => FILTER_VALIDATE_EMAIL],
			'tel' => [
				'maxLength' => 20,
				'preg_match' => '/^[\+\p{Ps}]?\p{Nd}{1}[\p{Nd}\p{Pd}\p{Ps}\p{Pe}\p{Zs}]{2,}$/'
			],
			'tel-ext' => [
				'maxLength' => 5,
				'preg_match' => '/^\p{Nd}+$/'
			],
			'updateOptIn' => [
				'in_array' => [true, false, 'on', 'off', 1, 0]
			],
			'subject' => [
				'maxLength' => 50,
				'preg_match' => '/^[\p{L}\p{M}\p{Zs}\p{N}\p{P}]+$/'
			],
			'message' => ['maxLength' => 1500]
		];

		if($rules) $this->rules = array_merge($this->rulesDefault, $rules);
		else $this->rules = $this->rulesDefault;

	}

	public function rulesSet($rules) {
		$this->rules = array_merge($this->rules, $rules);
	}

	public function validate($values) {

		$validationResults = [];
		foreach ($values as $field => $value) {
			$validationResults[$field] = [
				'value' => $value,
				'valid' => true,
				'rules' => []
			];
			if(array_key_exists($field, $this->rules)) {
				foreach($this->rules[$field] as $ruleName => $ruleValue) {
					switch($ruleName) {
						case 'required':
							if(is_int($ruleValue)) {
								$length = $ruleValue;
							} elseif($ruleValue) {
								$length = 1;
							} else {
								$length = 0;
							}
							$passed = strlen($value) >= $length;
							break;
						case 'filter_var':
							$passed = (
								array_key_exists('required', $this->rules[$field])
								&& $this->rules[$field]['required'] == false
								&& strlen($value) == 0
								) ? true : filter_var($value, $ruleValue);
							break;
						case 'maxLength':
							$passed = strlen($value) <= $ruleValue;
							break;
						case 'preg_match':
							// There must be a value for preg_match to work
							$passed = $value ? preg_match($ruleValue, $value) : true;
							break;
						case 'in_array':
							$passed = in_array($value, $ruleValue);
							break;
						case 'is_bool':
							$passed = is_bool((bool) $value);
							break;
					}
					if($passed) {
						$validationResults[$field]['rules'][$ruleName] = [
							'value' => $ruleValue,
							'passed' => true
						];
					} else {
						$validationResults[$field]['valid'] = false;
						$validationResults[$field]['rules'][$ruleName] = [
							'value' => $ruleValue,
							'passed' => false
						];
					}
				}
			}
		}

		$allValid = true;
		foreach ($validationResults as $validationResult) {
			if(!$validationResult['valid'])
				$allValid = false;
		}

		return [
			'valid' => $allValid,
			'details' => $validationResults
		];
	}
}
?>