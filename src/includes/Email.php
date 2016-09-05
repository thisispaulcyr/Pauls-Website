<?php
/**
 *  includes/email.php
 */
namespace App;

Class Email {

	public static function sendEmail($data) {

		$toName = Config::$emailToName;
		$toAddress = Config::$emailToAddress;

		$defaults = ['to', 'email'];
		foreach ($defaults as $default) {
			if(isset($data[$default]))
				$$default = $data[$default];
		}
		
		$mime_name_first = mb_encode_mimeheader($data['name_first']);
		$mime_name_last = mb_encode_mimeheader($data['name_last']);
		$mime_email = mb_encode_mimeheader($toAddress);

		$from = 'From: ';
		$from = $mime_name_first || $mime_name_last
			? $mime_name_first . ' ' . $mime_name_last . ' <' . $mime_email . '>'
			: $mime_email;

		$headers = "From: $from\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		if(isset($data['ip']))
			$headers .= 'x-submitter-ip: ' .  mb_encode_mimeheader($data['ip']) . "\r\n";
		if(isset($data['ip_http_x_forwarded_for']))
			$headers .= 'x-submitter-ip_http_x_forwarded_for: ' .  mb_encode_mimeheader($data['ip_http_x_forwarded_for']) . "\r\n";

		$subject = isset($data['subject']) ? $data['subject'] : null;

		$from = "From:\t";
		if(isset($data['name_first']) && isset($data['name_last'])) {
			$from .= $data['name_first'] . ' ' . $data['name_last'] . ' <' . $toAddress . '>';
		} elseif(isset($data['name_first'])) {
			$from .= $data['name_first'] . ' <' . $toAddress . '>';
		} elseif(isset($data['name_last'])) {
			$from .= $data['name_last'] . ' <' . $toAddress . '>';
		} else {
			$from .= $toAddress;
		}
		$message = $from . "\r\n";

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
		return mail($toName, $subject, $message, $headers);
		
	}
}
?>