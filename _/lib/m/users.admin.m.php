<?php
	/* nimbus/lib/m/admin/vacations - admin subclass -> vacations module
		nimbus (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Admin_Users extends _Admin {
		var $slug = 'users';
		
		function view(){
			global $_;
			
			if(($users = _User::all()) && ($this->obj_len = count($users))){ ?>
			
				<dl class="_-listing--main _-listing--section">
					<dt class="_-listing--main--header _-listing--section--header">
						<div class="_-widget _-widget--filter _-listing--filter">
							<form class="_-form _-form--filter">
								<input type="text" class="_-input--text" value="" placeholder="Search" />
							</form>
						</div>
						<h3><strong class="_-num"><?php echo $this->obj_len; ?></strong> User<?php echo ($this->obj_len === 1 ? '' : 's'); ?></h3>
					</dt>
					<dd class="_-listing--main--item _-listing--section--item">
			
						<table class="_-admin--view--listing _-table--listing _-admin--listing" cellpadding="0" cellspacing="0">
							<thead>
								<tr>
									<th>Name</th>
									<th>Username</th>
									<th>Email</th>
									<th>Group</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody><?php
								
		#						var_dump('@@@!',$users);
					
								foreach($users as $vkey => &$user){ ?>
								
									<tr class="_-listing--item">
										<th class="_-listing--item--name"><a href="/admin/users/edit?id=<?php echo $user->id; ?>"><?php echo (is_array($user->name) ? implode(' ',$user->name) : $user->name); ?></a></th>
										<td class="_-listing--item--username"><?php echo $user->username; ?></td>
										<td class="_-listing--item--email"><?php echo $user->email; ?></td>
										<td class="_-listing--item--type"><?php echo $user->group->name; ?></td>
										<td class="_-listing--item--link"><a href="/admin/users/edit?id=<?php echo $user->id; ?>">&#9658;</a></td><?php
											
										if($_['user']['user']->auth_level <= 1){ ?>
										
											<td class="_-listing--item--delete"><a href="/admin/users/delete?id=<?php echo $user->id; ?>"><span class="_-icon--wrapper"><span class="_-icon _-icon--font--delete"></span></span></a></td><?php
												
										} ?>

									</tr><?php
									
								} ?>
								
							</tbody>					
						</table>
					</dd>
				</dl><?php
			
			}else{
			
				var_dump('$@@22 admin view content',$users);
				
			}
			
			$ret = array(
				'users'	=> _User::all(),
				'companies'	=> _Company::all()
			);
			
#			print_r($ret);

		}
		
		function delete($id=''){
			global $_;
			
			if(empty($id)){

				if(!empty($_['get']['id'])){
					$id = intval($_['get']['id']);
					
					if(!empty($id) && ($_['get']['id'] == $_['user']['user']->id)){ ?>
							
						<h3>You cannot delete yourself.</h3><?php
						
						return false;
												
					}
					
					if(!isset($_['get']['confirm'])){
						$obj = new _User(array(
							FETCH_FROM_DB	=> true,
							'id'	=> $id
						)); ?>
						
						<div class="_-form">
							<h3>Are you sure you want to delete <strong><?php echo $obj->name; ?> (# <?php echo $obj->id; ?>)</strong>?</h3>
						    <div class="_-form--buttons">
								<a class="_-input--submit" href="?id=<?php echo $id; ?>&confirm">Confirm <?php echo ucwords(str_replace('_',' ',$_['admin']->route['v'])); ?> &#9658;</a>
						    </div>
						    <br />
						</div><?php
						
						return false;
					}
					
				}else{ ?>
				
					<h3>This object could not be deleted.</h3><?php
					
					return false;

				}
			}
			
			$ret = $obj = null;
			if(!empty($id)){
				$obj = new _User(array(
					FETCH_FROM_DB	=> true,
					'id'	=> $id
				));
				
				$ret = $obj->delete();

			}
			
			
			if($ret){ ?>
			
				<h3>This object has been successfully deleted.</h3><?php
				
			}else{ ?>
			
				<h3>This object could not be deleted.</h3><?php
				
			}
			
			return $ret;
		}
		
		function edit($id=''){
			global $_;
			
			if(empty($id) && $_['admin']->_cmd['edit']){
				if(!empty($_['get']['id'])){
					$id = intval($_['get']['id']);
				}else{
					return $this->view();
				}	
			}
			
			$form_slug = 'admin--'.$this->slug.'--edit'.(!empty($_GET['type']) ? '--'.$_GET['type'] : '');
			
			$obj = null;
			if(!empty($id)){
				$obj = new _User(array(
					FETCH_FROM_DB	=> true,
					'id'	=> $id
				));
			}
			
			$form = new _Form(array(
				'type'	=> $form_slug,
				'obj'	=> $obj,
				'cfg'	=> array(
					'email'	=> array(
						'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
		#				'from'	=> 'info@numonium.com',
						'to'	=> array('numonium+test--sfm@gmail.com','rob@sunfunmedia.com'),
						'auto_reply'	=> true,
						'subj'	=> '['.$_['site']->domain.'] Contact Form Submission',
						'params'	=> '-f'.'info@'.$_['site']->domain
					),/*
					'fallback'	=> array(
						'process'	=> array('email'),
						'email'	=> array(
							'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
		#					'from'	=> 'info@numonium.com',
							'to'	=> array('numonium+test--sfm--fallback@gmail.com','info@sunfunmedia.com'),
							'auto_reply'	=> true,
							'subj'	=> '['.$_['site']->domain.'] Contact Form Submission - FALLBACK',
							'params'	=> '-f'.'info@'.$_['site']->domain
						)
					),*/
					'process'	=> array('email')
				),
				'validator'	=> array(
					'_'	=> new _Validator(),
#					'pictcha'	=> $pictcha
				),
				'validation_map'	=> array(
/*					'lead--name'	=> array(
						'coords' => array('lead','name'),
						'v' => 'required'
					),
					'lead--company'	=> array(
						'coords' => array('lead','company'),
						'v' => 'required'
					),
					'lead--call-letters'	=> array(
						'coords' => array('lead','call-letters'),
						'v' => 'required'
					),
					'lead--phone'	=> array(
						'coords' => array('lead','phone'),
						'v' => 'required'
					),
					'lead--email'	=> array(
						'coords' => array('lead','email'),
						'v' => array('required','email')
					),
					'lead--ip'	=> array(
						'coords'	=> array('lead','ip'),
						'v'	=> array('domestic')
					)*/
				)
			));
			
			if(!empty($_['post']['_submit']) && $form->submit($_['post'])){
				echo $form->success();
			}else{				
				echo $form;
			}
		}
		
		function nav(){
			global $_;
			
			if($_['user']['user']->group->auth_level >= 2){
				return false;
			} ?>
		
			<nav class="_-admin--section--nav--wrapper">
				<ul class="_-admin--section--nav _-nav">
					<li class="_-admin--nav--item _-nav--item _-nav--item--users--add">
						<a href="<?php echo $_['admin']->page->href; ?>/add">
							<span class="_-icon--wrapper">
								<span class="_-icon _-icon--font--users-add"></span>
							</span>
							<span class="_-text">Add a User</span>
						</a>
					</li><?php
						
					if(!empty($_['admin']->model->model)){ ?>
					
						<li class="_-admin--nav--item _-nav--item _-nav--item--user--update">
							<a href="<?php echo $_['admin']->page->href; ?>/edit?id=<?php echo $_['admin']->model->model->id; ?>">
								<span class="_-icon--wrapper">
									<span class="_-icon _-icon--font--user"></span>
								</span>
								<span class="_-text">Edit this User</span>
							</a>
						</li><?php
						
					}
						
						
						 /*
					<li class="_-admin--nav--item _-nav--item _-nav--item--company--add">
						<a href="<?php echo $_['admin']->page->href; ?>/add?type=company">
							<span class="_-icon--wrapper">
								<span class="_-icon _-icon--font--company-add"></span>
							</span>
							<span class="_-text">Add a Company</span>
						</a>
					</li>
					<li class="_-admin--nav--item _-nav--item _-nav--item--users--edit">
						<a href="<?php echo $_['admin']->page->href; ?>/edit">
							<span class="_-icon--wrapper">
								<span class="_-icon _-icon--font--pencil"></span>
							</span>
							<span class="_-text">Edit a User</span>
						</a>
					</li><?php /*
					<li class="_-admin--nav--item _-nav--item _-nav--item--company--edit">
						<a href="<?php echo $_['admin']->page->href; ?>/edit?type=company">
							<span class="_-icon--wrapper">
								<span class="_-icon _-icon--font--pencil"></span>
							</span>
							<span class="_-text">Edit a Company</span>
						</a>
					</li>*/ ?>
				</ul>
			</nav><?php
			
		}
		
		function submit(){
			global $_;
			
			if(empty($_['request'])){
				return false;
			}
			
			$err = array();
			$data = $_['request'];
			
			if(!empty($data['_']['uuid'])){
				$obj = new _User(array(
					FETCH_FROM_DB => true,
					'uuid'	=> $data['_']['uuid']
				));
			}else{
				
				// if(!empty($data['user']['group'])){
				// 	$data['user']['group-uuid'] = $data['user']['group'];
				// 	unset($data['user']['group']);
				// }
				
				$obj = new _User($data['user']);

			}
			
			if(empty($obj)){
				return false;
			}

			if(empty($obj->site)){
				$obj->site = &$_['site'];
			}

			if(!empty($data['user']['station'])){
				$obj->station = new _Station(array(
					FETCH_FROM_DB	=> true,
					'uuid'		=> $data['user']['station']
				));
				unset($data['user']['station']);
			}

			if(!empty($data['user']['group'])){
				$obj->group = new _Group(array(
					FETCH_FROM_DB => true,
					'uuid'	=> $data['user']['group']
				));

				$obj->auth_level = $obj->group->auth_level;
				
				unset($data['user']['group']);
			}
			
			if(!empty($data['user'])){
				foreach($data['user'] as $ukey => $u){
					$obj->{$ukey} = $u;
				}
			}

			if($_['user']['user']->auth_level <= 1){
				if(!empty($data['pw']) && !empty($data['pw']['new']) && !empty($data['pw']['confirm']) && ($data['pw']['new'] == $data['pw']['confirm'])){
					$obj->pw_change($data['pw']['new']);
					$err['pw'] = "The user's password was successfully reset";
				}else{
					$err['pw'] = "The user's password could not be reset";
				}
			}
			
			if($obj->save()){
				$_['admin']->model->id = $obj->id;
				$_['admin']->model->model = &$obj; ?>
			
				<h3>Your user has been successfully saved.</h3><br /><?php
					
				if(!empty($err['pw'])){ ?>
					
					<h3 class="_-align--center"><?php echo $err['pw']; ?></h3><br /><?php					
					
				} ?>
				
				<h3 class="_-align--center">User ID # <strong><?php echo $obj->id; ?></strong></h3><?php
					
			}else{ ?>
			
				<h3>Apologies, there was an error saving the user. Please try again.</h3><?php
					
			}
			
		}
	}
	
?>
