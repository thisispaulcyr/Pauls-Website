<?php
/**
 *  includes/email.php
 */
namespace App;

Class Email {

	public static function sendEmail($data) {
		if (!empty($data['to']) && filter_var($data['to']['address'], FILTER_VALIDATE_EMAIL)) {
			$toAddress = $data['to']['address'];
			$toName = empty($data['to']['name']) ? null : $data['to']['name'];
		} else {
			$toAddress = Config::$email['to']['address'];
			$toName = empty(Config::$email['to']['name']) ? null : Config::$email['to']['name'];
		}

		// Escaping
		$toName = '"' . addslashes($toName) . '"';
		$toAddress = filter_var($toAddress, FILTER_SANITIZE_EMAIL);

		$to = $toName ? "$toName <$toAddress>" : $toAddress;

		if (!empty($data['from']) && filter_var($data['from']['address'], FILTER_VALIDATE_EMAIL)) {
			$fromAddress = $data['from']['address'];
			$fromName = empty($data['from']['name']) ? null : $data['from']['name'];
		} else {
			$fromAddress = Config::$email['from']['address'];
			$fromName = empty(Config::$email['from']['name']) ? null : Config::$email['from']['name'];
		}

		// Escaping
		$fromName = '"' . addslashes($fromName) . '"';
		$fromAddress = filter_var($fromAddress, FILTER_SANITIZE_EMAIL);

		$fromName = mb_encode_mimeheader($fromName);
		$fromAddress = mb_encode_mimeheader($fromAddress);
		$from = $fromName ? "$fromName <$fromAddress>" : $fromAddress;

		$headers = "From: $from\r\n";
		$headers .= "MIME-Version: 1.0\r\n";

		if(isset($data['ip']) && $data['ip'] !== '127.0.0.1' && $data['ip'] !== '::1')
			$headers .= 'x-submitter-ip: ' .  mb_encode_mimeheader($data['ip']) . "\r\n";
		if(isset($data['ip_http_x_forwarded_for']))
			$headers .= 'x-submitter-ip_http_x_forwarded_for: ' .  mb_encode_mimeheader($data['ip_http_x_forwarded_for']) . "\r\n";

		$subject = isset($data['subject']) ? $data['subject'] : null;
		$from = $fromName ? "$fromName <$fromAddress>" : $fromAddress;
		$message = "From:\t" . $from . "\r\n";

		if(isset($data['street_address']) || isset($data['city']) || isset($data['prov']) || isset($data['pcode'])) {
			$address = "\r\nAddress:\r\n";
			if(isset($data['street_address'])) $address .= $data['street_address'] . "\r\n";
			if(isset($data['city']) && isset($data['prov'])) {
				$address .= $data['city'] . ' ' . $data['prov'] . "\r\n";
			} elseif(isset($data['city'])) {
				$address .= $data['city'] . "\r\n";
			} elseif(isset($data['prov'])) {
				$address .= $data['prov'] . "\r\n";
			}
			if(isset($data['pcode']))
				$address .= $data['pcode'] . "\r\n";
			$message .= $address;
		}

		if(isset($data['tel'])) {
			$message .= "\r\nTel:\t" . $data['tel'];
			if(isset($data['tel_ext']))
				$message .= ' ext. ' . $data['tel_ext'];
			$message .= "\r\n";
		}

		if(array_key_exists('update_opt_in', $data))
			$optIn =  (bool) $data['update_opt_in'] ? 'TRUE' : 'false';
			$message .= "\r\nUpdate opt-in:\t$optIn\r\n";

		
		if(isset($data['message']))
			$message .= "\r\n" . $data['message'] . "\r\n";

		//send email
		return mail($to, $subject, $message, $headers);
		
	}
}
?>