<?php
/**
 *  includes/Post.php
 */
namespace App;

use App\Validator;

class Post {

	public function exec() {

		if (!array_key_exists('form', $_POST)) {
			$this->response('Form type not provided.', ['http_response_code' => 400, 'code' => 'error.form.type.NOTPROVIDED']);
			return;
		}

		$acceptedForms = ['contact', 'login'];
		$captchaForms = ['contact'];

		if (in_array($_POST['form'], $acceptedForms)) {
			$submission = $_POST;
			$submission['ip'] = $_SERVER['REMOTE_ADDR'];
			$submission['ip_http_x_forwarded_for'] = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : null;
		}
		else {
			$this->response('Form type not recognized.', ['http_response_code' => 400, 'code' => 'error.form.type.NOTRECOGNIZED']);
			return;
		}

		if (in_array($_POST['form'], $captchaForms) && $this->captchaValidation() === false) {
			$this->response('Captcha invalid.', ['http_response_code' => 403, 'code' => 'error.form.CAPTCHAINVALID']);
			return;
		}

		switch($_POST['form']) {
			case 'contact':
				$rules = [
					'name-first' => ['required' => 1],
					'name-last' => ['required' => 2],
					'email',
					'subject' => ['required' => 2],
					'message' => ['required' => 10],
				];
				$fields = ['name-first', 'name-last', 'street-address', 'city', 'prov', 'pcode', 'email', 'tel', 'tel-ext', 'subject', 'message', 'update-opt-in'];
				break;
			case 'login':
				$fields = ['email', 'password'];
				break;
			default:
				$this->response();
				return;		
		}

		$validator = new Validator($rules);
		$validationResult = $validator->validate($submission);

		if($validationResult['valid']) {
			switch($_POST['form']) {
				case 'contact':
					$this->send($fields, $submission);
					break;
				case 'login':
					$this->response('Invalid credentials.', [
						'http_response_code' => 401,
						'code' => 'error.authentication.GENERAL'
					]);
					break;
				default: $this->response();
			}
			return;
		} else {
			$details = arrayRemoveKeys('rules', $validationResult['details']);
			foreach ($details as $field => $fieldDetails) {
				if($fieldDetails['valid'] === true)
					unset($details[$field]);
			}
			$this->response('Validation error.', [
				'http_response_code' => 400,
				'code' => 'error.validation.GENERAL',
				'details' => $details
			]);
		}
	}

	private function captchaValidation($submission = null) {
		if(!$submission)
			$submission = [
				'response' => $_POST['g-recaptcha-response'],
				'remote_addr' => empty($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['REMOTE_ADDR'] : $_SERVER['HTTP_X_FORWARDED_FOR']
			];
		$validatorUrl = 'https://www.google.com/recaptcha/api/siteverify';
		$submission = [
			'secret' => '6LelYxUTAAAAAD-FL1xRLD_vgl0ahuowFeK8_SVA',
			'response' => $submission['response'],
			'remoteip' => $submission['remote_addr']
		];
		// use key 'http' even if you send the request to https://...
		$options = [
			'http' => [
				'header'  => 'Content-type: application/x-www-form-urlencoded\r\n',
				'method'  => 'POST',
				'content' => http_build_query($submission),
			]
		];
		$context  = stream_context_create($options);
		$response = json_decode(file_get_contents($validatorUrl, false, $context), true);
		return $response['success'] === true;	
	}

	private function prepare($fields) {
		foreach ($fields as $field => $value) {
			switch($field) {
				case 'pcode':
					$value = strtoupper(preg_replace('/\p{Zs}/', '', $value));
					$fields[$field] = $value;
					break;
				case 'tel':
					$subject = substr($value,0,1) == '+' ? substr($value,1) : $value;
					$value = preg_replace('/^[^\+?\p{Nd}+]/', '', $subject);
					$fields[$field] = $value;
					break;
				case 'tel-ext':
					$fields[$field] = (int) $value;
					break;
				case 'update-opt-in':
					$fields[$field] = in_array($value, [true, 'true', 1, '1', 'on', 0b1], true) ? true : false;
					break;
			}
		}
		return $fields;
	}

	private function response($message = null, $details = null) {
		$details = isset($details) ? $details : [];
		if ($message == 200
			|| $details == 200
			|| (isset($details['http_response_code']) && $details['http_response_code'] == 200)
		){
			if($message == 200 || $details == 200) $details['http_response_code'] = 200;
		}
		else {
			if(!isset($details['http_response_code'])) {
				$details['http_response_code'] = 500;
			}
			elseif (!is_int($details['http_response_code'])) {
				$details['details'] = $details['http_response_code'];
				$details['http_response_code'] = 500;
			}
		}
		http_response_code($details['http_response_code']);
		header('Content-Type: application/json');
		$response = [];
		if(isset($message))
			$response['message'] = $message;
		if(isset($details))
			$response['details'] = $details;
		echo json_encode($response);
	}

	private function send(array $fields, array $data) {
		$preparedResult = $this->prepare($data);
		$defaultData = ['ip' => $preparedResult['ip'], 'ip_http_x_forwarded_for' => $preparedResult['ip_http_x_forwarded_for']];
		$data_us = [];

		foreach($fields as $field) {
			$key = strtolower(preg_replace('/\-/','_', $field));
			$data_us[$key] = $preparedResult[$field];
		}
		$preparedData = array_merge($defaultData, $data_us);

		$sql = new SQL;
		if(is_object($sql)) {
			$insert = $sql->insert('submissions', $preparedData);
			if($insert['succeeded'] === true) {
				require_once(ABSPATH . 'includes/Email.php');
				$email = Email::sendEmail($preparedData);
				if($email) {
					$this->response(200);
				} else {
					$this->response('Email error.', ['code' => 'error.form.EMAIL']);
				}
			} else {
				$this->response('DB insert error.', ['code' => 'error.form.db.INSERT', 'details' => $insert['details']]);
			}
		} else {
			$this->response('DB connection error.', ['code' => 'error.form.db.CONNECTION']);
		}
	}

}
?>