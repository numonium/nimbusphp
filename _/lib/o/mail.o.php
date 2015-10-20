<?php
	/* juniper/lib/o/mail - email transport
		(juniper + nimbus) (c) 2010+ numonium //c - all rights reserved	
	*/

	class _Mail extends _{
		var $attachments = array();
		var $cfg = array();
		var $cc = array(); // $cc['_'] => address, $cc['name'] => name
		var $bcc = array(); // $bcc['_'] => address, $bcc['name'] => name
		var $to = array(); // $to['_'] => address, $to['name'] => name
		var $from = array(); // $from['_'] => address, $to['name'] => name
		var $from_name = array(); // arrays of from_name
		var $headers = array();
		var $html = true; // default to plain text
		var $msg = array();	// will have $msg['html'] and $msg['plain']
		var $params;
		var $plain = false; // default to plain text
		var $subj;
		var $auto_reply = 'address';
		var $protocol; // smtp, pop3, imap
		var $err; // mailer errors (probably from phpmailer)
		
		function __construct($data,$force_init=true){
			global $_;
			
			parent::__construct($data,$force_init);	
			
			if(empty($this->cfg)){
				$this->cfg = $_['cfg']['mail'];
			}
			
		}
		
		function send(){
			global $_;
					
			require_once("phpmailer/phpmailer.o.php");
			require_once("phpmailer/smtp.phpmailer.o.php"); // note, this is optional - gets called from main class if not already loaded
			
			$mail             = new PHPMailer();
			
			#$body             = $mail->getFile('contents.html');
			#$body             = eregi_replace("[\]",'',$body);
			
			$mail->IsMail(); // TODO - find a reason to use mail/qmail/etc
			$mail->IsHTML($this->html); // send as HTML
			
			if(!empty($this->cfg['smtp']['_'])){
				$mail->IsSMTP();
			}
			
			$mail->SMTPAuth   = $this->cfg['smtp']['auth'];                  // enable SMTP authentication
			if(!empty($this->cfg['smtp']['ssl'])){
				$mail->SMTPSecure = $this->cfg['smtp']['ssl'];                 // sets the prefix to the servier
			}
			
			$mail->Host       = $this->cfg['smtp']['host'];
			$mail->Port       = $this->cfg['smtp']['port'];
			
			$mail->Username   = $this->cfg['smtp']['username'];
			$mail->Password   = $this->cfg['smtp']['password'];
			
			if(!empty($this->from) && is_string($this->from)){
				$this->from = array('_' => $this->from);
			}
			$mail->From       = $this->from['_'];
			
			if(!empty($this->from['name'])){
				$mail->FromName   = $this->from['name'];
			}
			
			if(is_string($this->to)){
				$this->to = array_map('trim',explode(',',$this->to));
			}
			
			if(is_array($this->to)){
				foreach($this->to as $tkey => $to){
					if(is_array($to)){
						$mail->AddAddress($to['_'],(!empty($to['name']) ? $to['name'] : false));
					}else if(!empty($to)){
						$mail->AddAddress($to);
					}
				}
			}else{
				$mail->AddAddress($to);
			}
			
			if(!empty($this->headers)){
				$mail->CustomHeader = _array($this->headers);
			}
				
			$mail->Subject = $this->subj;
			
			if(!is_array($this->msg) && is_string($this->msg)){
				$this->msg = array('plain' => $this->msg);
			}
			
			if(!empty($this->msg['plain'])){
				$mail->AltBody = $this->msg['plain'];
			}
	
			if(!empty($this->cfg['msg']['word-wrap'])){
				$mail->WordWrap = $this->cfg['msg']['word-wrap'];
			}
			
			if($this->html && !empty($this->msg['html'])){
				$mail->MsgHTML($this->msg['html']);
			}else if($this->html && empty($this->msg['html'])){
				$mail->MsgHTML(nl2br($this->msg['plain']));
			}else{
				$mail->Body = $this->msg['plain'];
			}
			
			if(!empty($this->auto_reply) && _is_array($this->auto_reply)){
				foreach($this->auto_reply as $arkey => $ar){
					if(is_array($ar)){
						$mail->AddReplyTo($ar['_'],(!empty($ar['name']) ? $ar['name'] : false));
					}else if(!empty($ar)){
						$mail->AddReplyTo($ar);
					}
				}
			}else if(!empty($this->auto_reply)){
				$mail->AddReplyTo($this->auto_reply);
			}
			
			if(!empty($this->attachments) && _is_array($this->attachments)){
				foreach($this->attachments as $akey => $attchment){
					if(is_array($attachment)){
						$mail->AddAttachment($attachment['_'],(!empty($attachment['name']) ? $attachment['name'] : false));
					}else if(!empty($attachment)){
						$mail->AddAttachment($attachment);
					}
				}
			}			
			
			if(!($ret = $mail->Send())){ //SMTP fallback
				$mail->IsSMTP();
				$ret = $mail->Send();
			}
			
			$this->err = (!empty($mail->ErrorInfo) ? $mail->ErrorInfo : false);
			
			return $ret;
		}
	}
	
	if(!empty($_['env']['contexts']['dev'])){
		_cfg('mail',array(
			'smtp'	=> array(
				'_'			=> true,
				'ssl'		=> false,
				'auth'		=> false,
				'host'		=> '127.0.0.1',
				'port'		=> 2500,
				'username'	=> '',
				'password'	=> '',
			),
			'msg'	=> array(
				'word-wrap'	=> false
			)
	
		));
	}else{
	
		_cfg('mail',array(
			'smtp'	=> array(
				'ssl'		=> false,
				'auth'		=> false,
				'host'		=> 'localhost',
				'port'		=> 25,
				'username'	=> 'webmaster@'.$_['site']->domain,
				'password'	=> '',
			),
			'msg'	=> array(
				'word-wrap'	=> false
			)
	
		));
		
	}