<?php
	/* juniper/lib/model/html/form - decription for forms stored in database
		(juniper + nimbus) (c) 2010+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Form extends _HTML {
		var $id;
		var $uuid;

		var $action;
		var $cfg;
		var $email; // settings for email
		var $enctype;
		var $err; // errors
		var $events;
		var $fields;
		var $fieldset; // is this form in a fieldset
		var $html;
		var $html_id;
		var $html_name;
		var $method;
		var $name;
		var $results; // validation results
		var $template; // path to template file, then array of templates
		var $_template; // path to tempalte file
		var $title;
		var $type = 'contact'; // type - contact, information, financing
		var $validator;
		var $validation_map = array();
		var $options = array(); // options to be set from page -> view
		var $obj; // attached object
		
		function __construct($data='',$force_init=true){
			global $_;
			
			$this->tag='form';
			
			if(!empty($data)){
				if(!empty($data['_blank'])){
					return true;
				}else if(isset($data[FETCH_FROM_DB])){
					
					$min = array(
						FETCH_FROM_DB => true
					);
					
					foreach(array('uuid','id','slug') as $val){
						if(!empty($data[$val])){
							$min[$val] = $data[$val];
						}
					}
					
					if(!empty($min)){				
						parent::__construct($min,$force_init);
					}
					
					unset($data[FETCH_FROM_DB]);
					
					#return parent::__construct($data,$force_init,true);
				}
			}
			
			if(!empty($data['html-id'])){
				$this->html['id'] = $data['html-id'];
				unset($data['html-id']);
			}
			
			if(!empty($data['html-name'])){
				$this->html['name'] = $data['html-name'];
				unset($data['html-name']);
			}
		
			parent::__construct($data,$force_init,true);
			
			if(empty($this->html['name'])){
				$this->html['name']=&$this->uuid;
			}
			
			if(!empty($this->fields) && is_string($this->fields)){
				$this->fields=unserialize($this->fields);
			}else if(!empty($this->fields) && _is_array($this->fields)){
				foreach($this->fields as $label=>&$field){
					$f = array();
				
					if(!empty($field['type'])){
						switch($field['type']){
							case 'reset':
							case 'submit':
								$f['name'] = '_'.$field['type'];
								$f['value'] = $label;
							case 'text':
							case 'password':
							case 'checkbox':
							case 'tick':
							case 'radio':
								$f['tag'] = 'input';
								$f['type'] = $field['type'];
								break;
							case 'select':
							case 'option':
								$f['tag'] = $field['type'];
								break;
						}
						
						$f['class'] = 'input--'.$field['type'];
					}
					
					foreach(array('name','required','hidden','disabled') as $attr){
						if(!empty($field[$attr])){
							$f[$attr]=$field[$attr];
						}
					}
					
					if(!empty($field['row'])){
						$row=true;
					}else{
						$row=false;
					}
																
					$field = new _HTML($f);
					
					if($row){
						$field->row=$row;
					}
					
					if(!empty($field->name)){
						$field->attrs['name']=&$field->name;
					}
					
					unset($f);
				}
			}
			
			foreach(array_merge(array('enctype','method','action','name'),array_keys($this->html)) as $attr){
				$this->attrs[$attr=='html_id' ? 'id' : $attr] = $this->$attr;				
			}
			
			if(empty($this->action)){
				$this->attrs['_required'][]='action';
			}
			
			if(!empty($this->enctype)){
				$this->attrs['enctype']=&$this->enctype;
			}
			
			if(empty($this->template)){
				if(!empty($_['leg'])){ # legacy
					$this->template = _dir($_SERVER['DOCUMENT_ROOT'].'/_shared/obj/v/');
				}else{
					$this->template = _dir(dirname(dirname(__FILE__)).'/v/');
				}
				
				$this->template .= 'form--'.(!empty($this->type) ? $this->type : 'contact').'.v.php';
			}
			
			if(!empty($this->template)){
				$this->_template = $this->template;
				$this->template = $this->template_init();
			}
			
			if(empty($this->cfg['msg']['success']) && !empty($this->template['success'])){
				$this->cfg['msg']['success'] = $this->template['success'];
			}
		}
		
		function __get($var){
			return _::__get($var);
		}
		
		function __set($var,$val){
			return _::__set($var,$val);
		}
		
		function __isset($var){
			return _::__isset($var);
		}
		
		function __toString(){
			global $_;
			
			if(!empty($this->template['_'])){
				return $this->template['_'];
			}/*else if($view = $_['site']->template->has_view('form')){
				$page = new _Page(array('file' => $view, 'form' => &$this));
		
				ob_start();
				
#				echo $this->open();
				
				echo $page;
				
#				echo $this->close();
				
				return ob_get_clean();
			}*/
			
			return parent::__toString();
		}
		
		public static function all($args=array()){
			global $_;
			
			if(!empty($this)){
				$class = get_class($this);
			}else if(function_exists('get_called_class')){
				$class = get_called_class();
			}else{
				$class = '_Form';
			}
			
			$tbl = $_['db']->getTableName($class);
			
			if(!($ret = $_['db']->getAll($tbl,$args))){
				return false;
			}
			
			foreach($ret as $rkey => &$r){
				$r = new $class(array(FETCH_FROM_DB => true, '_global' => true, 'uuid' => $r['uuid']));
			}
			
			return $ret;

		}
		
		function data_transform($data=''){
			global $_;
			
			if(empty($data)){
				if(!empty($this->data)){
					$data = $this->data;
				}else{
					return false;
				}
			}
			
			# ~EN (2014): client data transforms {
			
			# } client data transforms
			
			return $data;
		}
		
		function fail(){
			global $_;
			
			# ~EN (2014): add template switch
			if(!empty($this->template['fail'])){
				return $this->template['fail'];
			}else if(!empty($this->cfg['msg']['fail'])){
				return $this->cfg['msg']['fail'];
			}else if(!empty($_['cfg']['form']['msg']['fail'])){
				return $_['cfg']['form']['msg']['fail'];
			}else{
				return "Oobs, it didn't :(";
			}
		}
		
		// fallback options if !$this->validate()
		function fallback($cfg='',&$results=array(),&$err=array()){
			global $_;
		
			if(empty($cfg)){
				if(!empty($this->cfg['fallback'])){
					$cfg = $this->cfg['fallback'];
				}else if(!empty($this->cfg['process'])){
					$cfg = array('process'	=> $this->cfg['process']);
					foreach(_array($cfg['process']) as $ckey => $method){
						if(!empty($this->cfg[$method])){
							$cfg[$method] = $this->cfg[$method];
						}
					}
				}else{
					return false;
				}
			}
			
			if(empty($cfg['process'])){
				return false;
			}
			
			$ret = true;
			
			foreach(_array($cfg['process']) as $ckey => $method){
				// not the ideal syntax, but it works (the ideal doesn't work)
				$func = 'process_'.$method;
				
				if(method_exists($this,$func)){
					$cfg[$method]['fallback'] = true; // so process methods can know we're in fallback mode
					
					$results2=array();
					$ret2 = $this->$func((!empty($cfg[$method]) ? $cfg[$method] : ''),$results2,$err);

					$ret = $ret && $ret2;
					$results = _array_merge($results,$results2);

					unset($ret2,$results2);
				}
			}

			return $ret;
		}
		
		// navigate through multi-d $this->data
		function field($coords,$data='',$fallback=''){
			global $_;
			
			if(empty($data) && !empty($this->data) && _is_array($this->data)){
				$data = $this->data;
			}else if(
				(empty($data) && !empty($_['post']) && count($_['post']) > 0) &&
				(
					(!empty($_['post']['_type']) && !empty($this->type) && ($_['post']['_type'] == $this->type)) ||
					(empty($_['post']['_type']))
				)
			){
				$data = $this->data = $_['post'];
			}
			
			if(empty($coords) || (empty($data))){
				return (!empty($fallback) ? $fallback : ''); // return '' rather than false so we can print it out
			}
			
			if(
				(!empty($data) &&
					($field = array_pick($data,$coords))
				) ||
				(!empty($quote) &&
					($field = array_pick($quote['_'],$coords))
				)
			){
				return (is_string($field) ? stripcslashes($field) : $field);
			}
			
			return (!empty($fallback) ? $fallback : '');
		}
		
		function field_has_error($coords,$err=''){
			if(!_is_array($coords) || !_is_array($err)){
				return false;
			}
			
			if(empty($err) && !empty($this->err)){
				$err = $this->err;
			}
			
			$field = implode('--',$coords);
			
			if(isset($err['validate'][$field]) && count($err['validate'][$field])){
				return $err['validate'][$field];
			}else if(isset($err['process'][$field]) && count($err['process'][$field])){
				return $err['process'][$field];
			}
			
			return false;
		}
		
		function field_has_error_class($coords,$err='',$space=true){
			global $_;
			
			if(empty($err) && !empty($this->err)){
				$err = $this->err;
			}
			
			if(!_is_array($coords) || !_is_array($err) || !($err = $this->field_has_error($coords,$err))){
				return '';
			}
			
			$base = '_-error';
			$ret = array($base);
			
			foreach($err['err'] as $e){
				$ret[] = $base.'--'.$e;
			}
			
			return ($space ? ' ' : '').implode(' ',$ret);
		}
		
		public static function global_submit($forms,$data=''){
			global $_;
			
			if(empty($forms)){
				return false;
			}
			
			if(is_object($forms)){
				$forms = array($forms);
			}
			
			if(empty($data)){
				if(!empty($_POST)){
					$data = $_POST;
				}else{
					return false;
				}
			}
			
			$form = false;
			
			/* ~EN (2014): #TODO - eventually allow for multiple form submissions from the same page,
				currently allows for only one	*/
			
			# ~EN (2014): set $_POST['_type'] = key in $forms
			if(!empty($data['_type']) && !empty($forms[$data['_type']])){
				$form = $forms[$data['_type']];
			}else{
				$form = array_shift($forms);
			}
			
			if(empty($form) || !is_object($form)){
				return false;
			}
			
			if($form->submit($data)){
				ob_start();
				echo $form->success();
				
				return ob_get_clean();
			}
			
			return false;
		}
		
		function has_error(){

			return (
//				(!empty($this->err['err']) && _is_array($this->err['err'])) ||
				(!empty($this->err['count']) && !empty($this->err['count']['_']))
			);

		}
		
		function normalise($data=''){
			global $_;
			
			if(empty($data)){
				if(!empty($this->data)){
					$data = &$this->data;
				}else{
					return false;
				}
			}
			
			if(empty($data['lead']['name'])){
				$data['lead']['name'] = '';
				
				if(!empty($data['lead']['title'])){
					$data['lead']['name'] .= $data['lead']['title'];
				}
				if(!empty($data['first_name'])){
					$data['lead']['name'] = $data['first_name'];
				}
				if(!empty($data['middle_name'])){
					$data['lead']['name'] .= $data['middle_name'];
				}
			}
			
			// recursively trim data
			$data = _array_map('trim',$data);
		}
		
		function normalize($data=''){
			return $this->normalise($data);
		}

		
		function open(){
			foreach(array('id','name') as $attr){
				if(@isset($this->$attr)){
					$this->{'_'.$attr}=$this->$attr;
					$this->attrs[$attr] = $this->$attr = ($attr=='name' && empty($this->html[$attr]) ? $this->uuid : $this->html[$attr]);
				}
			}
			
			$ret = parent::open();

			foreach(array('id','name') as $attr){
				$this->$attr=$this->{'_'.$attr};
			}
			
			return $ret;
			
		}
		
		function pdf__fill($data='',$method='download'){
			global $_;
			
			if(empty($data)){
				if(!empty($this->data)){
					$data = (object) $this->data;
				}else{
					return false;
				}
			}else if(is_object($data)){
				if(get_class($data) == '_Lead'){
				
				}else{

				}
				
			}else if(is_array($data)){
#				$data = (object) $data;
			}
			
			return $_['api']['pdf']->fill($this,$data,'',$method);
			
		}
		
		function pdf__get_fields(){
			global $_;
			
			return $_['api']['pdf']->get_fields($this);
		}
		
		/*  will run validation and process transport functions
			goes through $this->cfg['process'] or $cfg for functions to process the form (email, db, crm) */
		function process($map='',&$results=array(),&$err=array(),$cfg=''){
			global $_;
			
			$ret = true;
			
			if(empty($map)){
				if(!empty($this->map) && _is_array($this->map)){
					$map = $this->map;
				}else{
					return false;
				}
			}else if(!is_array($map)){
				return false;
			}
			
			if(empty($cfg)){
				if(!empty($this->cfg['process'])){
					$cfg = $this->cfg['process'];	
				}else{
					return $ret; // nothing to do!
				}
			}
			
			if($results=='' || !is_array($results) || $err=='' || !is_array($err)){
				return false; // not enough data
			}
			
			// move 'email' to end of to-do array so we can include diagnostic info
			if($email = array_search('email',$cfg)){
				$email = $cfg[$email];
				unset($cfg[$email]);
				$cfg[] = $email;
			}
			
			if(empty($results['validate'])){
				$results['validate'] = array();
			}
			
			if(empty($results['process'])){
				$results['process'] = array();
			}
			
			if(empty($err['validate'])){
				$err['validate'] = array();
			}
			
			if(empty($err['process'])){
				$err['process'] = array();
			}
			
			if(!$this->validate($map,$results['validate'],$err['validate'])){			
				if(!empty($this->cfg['fallback'])){
					$this->fallback($this->cfg['fallback'],$results,$err);
					$this->err = array_merge($err,$this->process_err('',$err));
					return false; // we should still return false, since we failed validation - just notify the sysadmins for some reason
				}else{ # no reason to continue
					$this->err = array_merge($err,$this->process_err('',$err));
					return false;
				}
			}
			
			foreach(_array($cfg) as $ckey => $method){
				// not the ideal syntax, but it works (the ideal doesn't work)
				
				$callable = (is_array($method) && is_callable($method,true));
				$func = 'process_' . ($callable ? 'callback' : $method);
				
				if(method_exists($this,$func)){
					$results2=array();
					$ret2 = $this->$func($callable ? $method : '',$results2,$err,$this);
					
					$ret = $ret && $ret2;
					$results = _array_merge($results,$results2);

					unset($ret2,$results2);
				}
			}
			
			$this->err = array_merge($err,$this->process_err('',$err));
			
			return $ret;
			
		}
		
		function process_callback($cfg='',&$results=array(),&$err=array(),&$form=''){
			global $_;
			
			if(!empty($cfg) && is_array($cfg) && is_object($cfg[0]) && !empty($cfg[1]) && method_exists($cfg[0],$cfg[1])){
				$ret = call_user_func_array($cfg, array(array('form' => &$this),$results,$err,'',$this));
				
				return $ret;
			}
			
			return false;

		}
		
		function process_capsule($cfg='',&$results=array(),&$err=array()){
			global $_;
			
			if(empty($this->data) || !_is_array($this->data)){
				return false;
			}
			
			$data = $this->data;
			
			$data = $this->process_capsule_data($data);
			
			$post = http_build_query($data);
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $_['cfg']['api']['capsule']['url']);
			curl_setopt($ch, CURLOPT_PORT, (strpos($_['cfg']['api']['capsule']['url'], 'https://') !== false ? 443 : 80));
			curl_setopt($ch, CURLOPT_VERBOSE, true);
			curl_setopt($ch, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
	        curl_setopt($ch, CURLOPT_POST, true);
	        curl_setopt($ch, CURLOPT_POSTFIELDS, $post );
	                
	        $exec = curl_exec($ch);
	        $ret = !curl_errno($ch);
	        
	        $results['process']['capsule'] = $exec;
	        $err['process']['capsule'] = curl_error($ch);
	        
	        curl_close($ch);
			
			return $ret;
		}
		
		function process_capsule_data($data=''){
			global $_;
			
			if(empty($data)){
				if(!empty($this->data)){
					$data = $this->data;
				}else{
					return false;
				}
			}
			
			if(empty($data['FORM_ID']) && !empty($_['cfg']['api']['capsule']['key'])){
				$data['FORM_ID'] = $_['cfg']['api']['capsule']['key'];
			}
			
			if(empty($data['COMPLETE_URL'])){
				$data['COMPLETE_URL'] = (string) $_['url'];
			}
			
			if(!empty($data['lead']['name']) && is_array($data['lead']['name'])){
				$data['PERSON_NAME'] = implode(' ',$data['lead']['name']);
				unset($data['lead']['name']);
			}else if(!empty($data['lead']['name'])){
				$data['PERSON_NAME'] = $data['lead']['name'];
				unset($data['lead']['name']);
			}
			
			if(!empty($data['lead']['title'])){
				$data['PERSON_NAME'] = $data['lead']['title'].(!empty($data['PERSON_NAME']) ? ' '.$data['PERSON_NAME'] : '');
				unset($data['lead']['title']);
			}
			
			if(!empty($data['lead']['company'])){
				$data['ORGANISATION_NAME'] = $data['lead']['company'];
				unset($data['lead']['company']);
			}
			
			if(!empty($data['lead']['job-title'])){
				$data['JOB_TITLE'] = $data['lead']['job-title'];
				unset($data['lead']['job-title']);
			}
			
			if(!empty($data['lead']['email'])){
				$data['EMAIL'] = $data['lead']['email'];
				unset($data['lead']['email']);
			}
			
			if(!empty($data['lead']['phone'])){
				$data['PHONE'] = $data['lead']['phone'];
				unset($data['lead']['phone']);
			}
			
			if(!empty($data['lead']['phone'])){
				$data['PHONE'] = $data['lead']['phone'];
				unset($data['lead']['phone']);
			}
			
			if(!empty($data['lead']['address']['street'])){
				$data['STREET'] = $data['lead']['address']['street'];
				unset($data['lead']['address']['street']);
			}
			
			if(!empty($data['lead']['address']['city'])){
				$data['CITY'] = $data['lead']['address']['city'];
				unset($data['lead']['address']['city']);
			}
			
			if(!empty($data['lead']['address']['state'])){
				$data['STATE'] = $data['lead']['address']['state'];
				unset($data['lead']['address']['state']);
			}
			
			if(!empty($data['lead']['address']['zip'])){
				$data['ZIP'] = $data['lead']['address']['zip'];
				unset($data['lead']['address']['zip']);
			}
			
			if(!empty($data['lead']['address']['postal'])){
				$data['ZIP'] = $data['lead']['address']['postal'];
				unset($data['lead']['address']['postal']);
			}
			
			if(!empty($data['lead']['address']['country'])){
				$data['COUNTRY'] = $data['lead']['address']['country'];
				unset($data['lead']['address']['country']);
			}
			
			if(!empty($data['lead']['monthly-sales'])){
				$data['CUSTOMFIELD']['Monthly Sales'] = $data['lead']['monthly-sales'];
				unset($data['lead']['monthly-sales']);
			}
			
			if(!empty($data['referrer'])){
				$data['CUSTOMFIELD']['Referrer'] = $data['referrer'];
				unset($data['referrer']);
			}
			
			foreach(array('comments','note','msg','message') as $field){
				if(!empty($data['lead'][$field])){
					$data['NOTE'] = $data['lead'][$field];
					unset($data['lead'][$field]);
				}
			}
				
#			if($_['env']['contexts']['dev'] || $_['env']['contexts']['beta']){
#				$data['DEVELOPER'] = 'TRUE';
#			}
			
			return $data;
		}
		
		function process_db($cfg=''){
			// TO DO - add records to db
			die('todo[form][process][db]');
		}
		
		function process_email($cfg='',&$results=array(),&$err=array()){
			global $_;
			
			$_key = 'email';
			
			if(empty($cfg) && !empty($this->cfg[$_key])){
				$cfg = $this->cfg[$_key];
			}else if(empty($cfg)){
				return false;
			}
			
			if(empty($cfg['to']) && !empty($this->cfg[$_key]['to'])){
				$cfg['to'] = $this->cfg[$_key]['to'];
			}
			
			if(empty($cfg['from']) && !empty($this->cfg[$_key]['from'])){
				$cfg['from'] = $this->cfg[$_key]['from'];
			}
			
			if(!empty($cfg['auto_reply']) && ($cfg['auto_reply'] === true) && !empty($this->data['lead']['email'])){
				$cfg['auto_reply'] = $this->data['lead']['email'];
			}
			
			$content = array();
			
			if(!empty($cfg['fallback'])){
				$content['fallback'][] = "== Failed Validation ==\r\n";
				
				foreach($err['validate'] as $ekey => $e){
					$content['fallback'][$ekey] = ucwords(str_replace(array('--','_'),array(' - ',' '),$ekey)).': '.implode(', ',$e['err']);
				}
				
				$content['fallback'][] = "== End Validation Info ==\r\n";
			}

			$name = '[No Name]';
			
			if(!empty($this->data['lead']['name'])){
				$name = $this->data['lead']['name'];
			}else if(!empty($this->data['lead']['name'])){
				$name = $this->data['lead']['name'];
			}else if(!empty($this->data['user']['name'])){
				$name = $this->data['user']['name'];
			}
			
			if(is_array($name)){
				if(!empty($name['middle']) && is_array($name['middle']) && !empty($name['middle']['_'])){
					$name['middle'] = $name['middle']['_'];
				}
			
				if(!empty($name['first'])){
					$name = $name['first'].(!empty($name['middle']) ? ' '.$name['middle'] : '').' '.$name['last'];
				}else{
					$name = implode(' ', $name);
				}
			}
			
			$content['intro'] = $name." has submitted a ".($this->type == 'register' ? 'registration' : $this->type)." form at ".$_['server']['http-host']." with the following information:\r\n";
			
			if(!empty($this->data['pictcha'])){
				$pictcha = array('pictcha' => $this->data['pictcha']);
				unset($this->data['pictcha']);
			}
			
			$flat = array_flatten(array_merge($_['const']['array']['flatten']['args'],$this->data_transform($this->data)));
			
			foreach($flat as $fkey => $field){
				if(isset($field) && $field!=''){
					$content[] = ucwords(str_replace(array('--','_'),' ',$fkey)).': '.$field;
				}
			}
			
			$content[] = "\n== Administrative Information ==";
			$content[] = 'Submitted On: '.$_['server']['http-host'].$_['server']['request-uri'];
			$content[] = 'By: '.(!empty($_['geo']->ip_private) ? $_['geo']->ip_private. ' / ' : '').$_['geo']->ip.' ('.(!empty($_['geo']->host) ? $_['geo']->host : $_['geo']->ip).')';
			
			if(!empty($_['geo']->ip_info)){
				$content[] = 'Country: '.$_['geo']->ip_info['country-code'].' - '.ucwords($_['geo']->ip_info['country']);
			}
			
			$content[] = 'Browser: '.$_SERVER['HTTP_USER_AGENT'];
			
			if(!empty($pictcha)){
				$pictcha = array_flatten(array_merge($_['const']['array']['flatten']['args'],$pictcha));
				
				foreach($pictcha as $fkey => $field){
					if(isset($field) && $field!=''){
						$content[] = ucwords(str_replace('--',' ',$fkey)).': '.$field;
					}
				}
			}
			
			$mail = new _Mail(array_merge($cfg, array('msg' => implode("\r\n",array_flatten($content)))));
						
			if($mail->send()){
				$results['process']['email'] = true;
				return true;
			}

			$results['process']['email'] = false;
			$err['process']['email'] = $mail->err;

			return false;
		}
		
		function process_err($data='',&$err=''){
			global $_;
			
			if(empty($data)){
				if(!empty($this->data)){
					$data = $this->data;
				}else{
					return false;
				}
			}
			
			if(empty($err) && !empty($this->err)){
				$err = $this->err;
			}
			
			$ret = array(
				'count'	=> array(
					'validate'	=> count($err['validate']),
					'process'	=> count($err['process'])
				),
				'msg'	=> array(
/*					'validate'	=> array(
						'required' => $_['cfg']['form']['err']['required'],
						'user'	 => $_['cfg']['form']['err']['user'],
						'blacklist'	=> $_['cfg']['form']['err']['blacklist'],
						'forgot'	=> $_['cfg']['form']['err']['forgot'],
						'login'	=> $_['cfg']['form']['err']['login']
					),*/
					'validate'	=> $_['cfg']['form']['err'],
					'process'	=> array()
				),
				'err'	=> array(
					'validate'	=> array(
						'required' => $_['cfg']['form']['err']['required']
					),
					'process'	=> array()
				)
			);
			
			if(!empty($err['validate'])){
				if(!empty($err['validate']['person--ip'])){
					$ret['err']['validate']['lead']['ip'] = $_['cfg']['form']['err']['ip'];
					$ret['count']['validate']++;
				}
				
				if(!empty($err['validate']['pictcha'])){
					$ret['err']['validate']['pictcha'] = $_['cfg']['form']['err']['pictcha'];
					$ret['count']['validate']++;
				}

/*				if(!empty($err['validate']['person--email'])){
					$ret['err']['validate']['lead']['ip'] = $_['cfg']['form']['err']['p-email'];
					$ret['count']['validate']++;
				}*/

			}
			
			if(!empty($err['process'])){
				if(!empty($err['process']['capsule'])){
					$ret['err']['process']['capsule'] = $_['cfg']['form']['err']['capsule'];
					$ret['count']['process']++;					
				}
				
				if(!empty($err['process']['email'])){
					$ret['err']['process']['email'] = $_['cfg']['form']['err']['email'];
					$ret['count']['process']++;
				}
				
				if(!empty($err['process']['user'])){
					$ret['err']['process']['user'] = $_['cfg']['form']['err']['user'];
					$ret['count']['process']++;
				}
			}
			
			# generate total error count
			$total = 0;
			foreach($ret['count'] as $ckey => $count){
				$total += $count;
			}
			
			$ret['count']['_'] = $total;
			
			return $ret;
		}
		
		function reset(){
			global $_;
			
			$this->data = array();
			
			return true;
		}
		
		// allows you to supply a custom validation map, but since you shouldn't need to use it, we make it optional at the end ;)
		// $reset will reset all form data if return true
		function submit($data='',&$results=array(),&$err=array(),$map='',$reset=true){
			
			if(empty($data)){
				if(!empty($this->data) && _is_array($this->data)){
					$data = &$this->data;
				}
			}else{
				$this->data = $data;
			}
			
			if(empty($map)){
				if(!empty($this->validation_map) && _is_array($this->validation_map)){
					$map = $this->validation_map;
				}else{
					return false;
				}
			}
			
			if(isset($data['_submit'])){
				unset($data['_submit']);
			}
			
			if(isset($data['lead']['_submit'])){
				unset($data['lead']['_submit']);
			}
			
			if(isset($data['user']['_submit'])){
				unset($data['user']['_submit']);
			}

			
			$ret = $this->process($map,$results,$err);
						
			# ~EN: require view again to show errors
			$this->template_refresh();
			
			if(!empty($reset) && !empty($ret)){
				$this->reset();
			}
			
			return $ret;

		}
		
		function success(){
			global $_;
			
			# ~EN (2014): add template switch
			if(!empty($this->template['success'])){
				return $this->template['success'];
			}else if(!empty($this->cfg['msg']['success'])){
				return $this->cfg['msg']['success'];
			}else if(!empty($_['cfg']['form']['msg']['success'])){
				return $_['cfg']['form']['msg']['success'];
			}else{
				return "Yay, it's worked! :)";
			}
		}
		
		function template_init($file=''){
			global $_;
			
			if(empty($file)){
				if(!empty($this->template) && is_string($this->template)){
					$file = $this->template;
				}else if(!empty($this->_template) && is_string($this->_template)){
					$file = $this->_template;
				}else{
					return false;
				}
			}
			
			if(file_exists($file)){
				require($file);
				
				return $template;
			}else if($f = _file_exists($file)){
				require($f);
				
				return $template;
			}
			
			return false;
		}
		
		function template_refresh(){
			$this->template = $this->template_init();
		}
		
		function validate($map='',&$results=array(),&$err=array()){
			if(empty($map)){
				if(!empty($this->map) && _is_array($this->map)){
					$map = $this->map;
				}else{
					return false;
				}
			}else if(!is_array($map)){
				return false;
			}
			
			$this->normalise();
			
			if(empty($this->validator)){
				$this->validator = new _Validator();
			}
			
			if(is_array($this->validator)){
				$ret = true;
				
				foreach($this->validator as $vkey => $v){ // return map of validator class => validation results
				
					$v_res = array(); // validation results for individual vlaidator
					
					if(is_array($v) && !empty($v[0]) && is_object($v[0]) && !empty($v[1])){ # ~EN (2014): allow for callbacks array($obj,'func_name')
						$valid = call_user_func_array($v, array($map,&$this,&$v_res));
						$rkey = _get_class($v[0]);
						
					}else{
						$valid = $v->validate($map,$this,$v_res);
						$rkey = (is_string($vkey) ? $vkey : _get_class($v));
					}
					

#					$result = array($rkey => &$v_res);
					$results[$rkey] = &$v_res;
					
					// transfer errors to separate array
					if(!empty($results[$rkey]['_err']) && _is_array($results[$rkey]['_err'])){
						$err  = _array_merge($err,$results[$rkey]['_err']);
					 }
					 
#					$results += $result;

					$ret = $ret && $valid;
					
					unset($valid,$v_res);
					
				}
				
				$this->err = $err;
				$this->results = $results;
				
				return $ret;
			}
			
			$ret = $this->validator->validate($map,$results);
			$this->results = $results;
			
			return $ret;

		}
	
	}
?>