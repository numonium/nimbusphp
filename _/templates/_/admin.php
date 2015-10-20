<?php
	$_forms=array(
		'admin'	=> array(
			'login' => new _Form($_['const']['forms']['admin']['login'])
		)
	);
	
	if(isset($_['get']['log-out']) || isset($_['url']->vars['log-out'])){
		_User::logout();
	}
	
	/*
	var_dump('###',$_POST['_submit'],'$$$',isset($_['post']['_submit']) && count($_['post'])>1,$_['post']);
	die('555'); */

	
	if(isset($_['post']['_submit']) && count($_['post'])>1){
		$form = new _Form(array('uuid' => $_['post']['uuid'], FETCH_FROM_DB => true));
		
		switch($form->uuid){
			case $_forms['admin']['login']->uuid:
				
				if($user = _User::login($_['post']['user'])){
					$frontend_only = array('/admin');
					
					if(!empty($_['post']['referrer'])){
						$href = $_['post']['referrer'];
					}else if(!empty($_['url']->referrer) && is_object($_['url']->referrer) && !empty($_['url']->referrer->uri) && !in_array($_['url']->referrer->uri, $frontend_only)){
						$href = $_['url']->referrer->uri;
					}else{
						$href = '/';
					}
										
					if(isset($_['get']['embed']) && (strpos($href, '?embed')===false) && (strpos($href, '&embed')===false)){
						if(strpos($href,'?')!==false){ //already has params, use &
							$href.='&embed';
						}else{ //doesn't have params, use ?
							$href.='?embed';
						}
					}

					$_['url']->redirect($href);
				}
				
				var_dump('!!! [ user login fail ]',$_['post']);
				
				break;
		}		
	}
	
	$this->css[] = '/css/admin.css';
	
	if(!_User::logged_in())
		$this->body_classes[] = '_-admin';

	if(count($_['url']->pieces['url'])==1){ //accessed base admin url
		$this->slug = 'admin--login';
		$this->title = 'Manage Your Website';
	}
		
	echo $this->header();
	unset($header); ?>
	
	<h1><?php echo $this->title; ?></h1>
	<form id="_-form--admin"></form>
	<div id="content--main">
		__CONTENT__ <?php
		
		if($this->slug=='admin--login'){
#			$form = new _Form(array('slug' => $this->slug, FETCH_FROM_DB => true));
			
/*			$form = new _Form(array(
				'title'	=> 'Log In',
				'fieldset' => true,
				'action' => '',
				'method' => 'post',
				'fields'	=> array(
					'Email'	=> array(
						'type'	=> 'text',	// text, submit, password => input | select,option => tag
						'name'	=> 'user[email]',
						'required' => true
					),
					'Password'	=> array(
						'type'	=> 'password',
						'name'	=> 'user[password]',
						'required'	=> true
					),
					'Log In' => array(
						'type'	=> 'submit',
						'row'	=> true
					)
				)
			)); */
			
#			var_dump('@@@',serialize($form->fields));
			
			echo $_forms['admin']['login'];
			/*
		?>
			<fieldset>
				<legend align="center">Log In</legend>
				<form method="post" action="">
				<table cellpadding="0" cellspacing="0">
					<tr>
						<th>Email</th>
						<td><input type="text" class="input--text" name="user[email]" value="" required /></td>
					</tr>
					<tr>
						<th>Password</th>
						<td><input type="password" class="input--text" name="user[password]" value="" required /></td>
					</tr>
					<tr>
						<td colspan="2" class="buttons">
							<input type="submit" class="input--submit" name="_submit" value="Log In" />
						</td>
					</tr>
				</table>
				</form>
			</fieldset>
			
			<?php */
		}
	?>
	</div><?php #content--main ?>
	
<?php echo $this->footer(); ?>