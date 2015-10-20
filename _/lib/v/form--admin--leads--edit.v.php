<?php
	/*	juniper/v/form/stations - template to add/edit stations
		(juniper + nimbus) (c) 2012+ numonium //c	*/
		
	# ~EN: err {
	
	global $_;
	
	if($this->has_error()){
	
		$flat = array_flatten(array_merge($_['const']['array']['flatten']['args'],$this->err['err']));
	
		$i=0;
		
		ob_start(); ?>
		
		<div class="_-form--msg _-form--error"><?php
		
			foreach($flat as $emkey => $em){ ?>
			
				<h4 class="_-tip _-error"<?php #echo ($i == 0 && $i < count($this->err['err'])-1 ? ' style="margin:.5em 0 0;padding:0;border:0;"' : ''); ?>><?php echo $em; ?></h4><?php
				
				$i++;
				
			} ?>
			
		</div><?php #._-form--msg._-form--error
			
		$template['err'] = ob_get_clean();			
	}
	
	# } err :EN ~		
	
	# ~EN: main {
	
	ob_start(); ?>
	
	    <form id="<?php echo $this->uuid; ?>--form--<?php echo $this->type; ?>" class="_-form _-form--<?php echo $this->type; ?> _-col--2--wrapper" action="/admin/leads/submit" method="post"><?php
	    	if(!empty($this->obj)){ ?>
		    
		    	<input type="hidden" name="_[action]" value="edit" />
		    	<input type="hidden" name="_[id]" value="<?php echo $this->obj->id; ?>" />
		    	<input type="hidden" name="_[uuid]" value="<?php echo $this->obj->uuid; ?>" /><?php
						    
		    } ?>
		    <div class="_-col">
			    <h3 class="_-fieldset--title">Contact Information</h3>
				<fieldset class="_-fieldset--mini">
					<div class="_-bg--noise"></div>
			    	<table class="_-table _-table--contacts--sel" cellpadding="0" cellspacing="0">
			    		<tr>
			    			<th colspan="2">
				    			<h4>All fields are required</h4>
			    			</th>
			    		</tr>
			    		<tr>
				    		<td class="_-td--icon"><span class="_-icon _-icon--font--user"></span></td>
				    		<td class="_-td--field _-td--field--name">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','name','first')); ?>" name="lead[name][first]" value="<?php echo $this->field(array('lead','name','first'),'',(!empty($this->obj) ? $this->obj->name['first'] : '')); ?>" placeholder="First Name" required />
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','name','last')); ?>" name="lead[name][last]" value="<?php echo $this->field(array('lead','name','last'),'',(!empty($this->obj) ? $this->obj->name['last'] : '')); ?>" placeholder="Last Name" required />
					    	</td>
			    		</tr><?php /*
			    		<tr>
				    		<td class="_-td--icon"><span class="_-icon _-icon--font--company"></span></td>
				    		<td class="_-td--field">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','company')); ?>" name="lead[company]" value="<?php echo $this->field(array('lead','company')); ?>" placeholder="Company" required />
				    		</td>
			    		</tr> */ ?>
			    		<tr>
				    		<td class="_-td--icon"><span class="_-icon _-icon--font--at"></span></td>
				    		<td class="_-td--field">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','email')); ?>" name="lead[email]" value="<?php echo $this->field(array('lead','email'),'',(!empty($this->obj) ? $this->obj->email : '')); ?>" placeholder="Email Address" required />
				    		</td>
			    		</tr>
			    		<tr>
				    		<td class="_-td--icon"><span class="_-icon _-icon--font--phone"></span></td>
				    		<td class="_-td--field">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','phone')); ?>" name="lead[phone]" value="<?php echo $this->field(array('lead','phone'),'',(!empty($this->obj) ? $this->obj->phone : '')); ?>" placeholder="Phone" required />
				    		</td>
			    		</tr>
			    		<tr>
				    		<td class="_-td--icon"><span class="_-icon _-icon--font--waypoint"></span></td>
				    		<td class="_-td--field">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','address','street')); ?>" name="lead[address][street]" value="<?php echo $this->field(array('lead','address','street'),'',(!empty($this->obj) ? $this->obj->address['street'] : '')); ?>" placeholder="Street Address" required />
				    		</td>
			    		</tr>
			    		<tr>
				    		<td class="_-td--icon"></td>
				    		<td class="_-td--field _-td--field--address--2">
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','address','city')); ?>" name="lead[address][city]" value="<?php echo $this->field(array('lead','address','city'),'',(!empty($this->obj) ? $this->obj->address['city'] : '')); ?>" placeholder="City" required />
					    		<select class="_-input--text _-input--select<?php echo $this->field_has_error_class(array('lead','address','state')); ?>" name="lead[address][state]"><?php
						    		
						    		$f = $this->field(array('lead','address','state'),'',(!empty($this->obj) ? $this->obj->address['state'] : ''));
						    		
						    		foreach($_['loc']['states'] as $skey => $state){ ?>
						    		
						    			<option value="<?php echo $skey; ?>"<?php echo (!empty($f) && ($f == $skey) ? ' selected' : ''); ?>><?php echo $skey; ?></option><?php
							    		
						    		}
						    		
						    		unset($f); ?>						    		
					    		</select>
					    		<input type="text" class="_-input--text<?php echo $this->field_has_error_class(array('lead','address','zip')); ?>" name="lead[address][zip]" value="<?php echo $this->field(array('lead','address','zip'),'',(!empty($this->obj) ? $this->obj->address['zip'] : '')); ?>" placeholder="ZIP" required />
				    		</td>
			    		</tr>
			    		<tr class="_-contact--submit">
				    		<td colspan="3" align="center">
					    		<label><input type="checkbox" class="_-input--checkbox<?php echo $this->field_has_error_class(array('lead','monthly_statement')); ?>" name="lead[monthly_statement]" value="1"<?php echo ($this->field(array('lead','monthly_statement'),'',(!empty($this->obj) ? $this->obj->monthly_statement : '')) ? ' checked' : ''); ?> /> Monthly Statement</label>
				    		</td>
			    		</tr>
			    		<tr class="_-contact--submit">
				    		<td colspan="3" align="center">
					    		<label><input type="checkbox" class="_-input--checkbox<?php echo $this->field_has_error_class(array('lead','hispanic')); ?>" name="lead[hispanic]" value="1"<?php echo ($this->field(array('lead','hispanic'),'',(!empty($this->obj) ? $this->obj->hispanic : '')) ? ' checked' : ''); ?> /> Hispanic</label>
				    		</td>
			    		</tr>
			    	</table>
				</fieldset>
		    </div><?php
			    
			if($_['user']['user']->auth_level <= 1){ ?>
			
			    <div class="_-col"><?php /*
				    <h3 class="_-fieldset--title">User Permissions</h3>
					<fieldset class="_-fieldset--perms--user _-fieldset--mini">
						<table class="_-table _-table--perms _-table--perms--user _-inv" cellpadding="0" cellspacing="0">
							<tr>
								<td class="_-icon--wrapper">
									<span class="_-icon _-icon--font--gear"></span>
								</td>
								<td><?php
									
									if($groups = _Group::all()){ ?>
									
										<select class="_-input--text _-input--select" name="lead[group]">
											<option value="" default>Select a Group...</option><?php
											
											foreach(_Group::all() as $gkey => $group){ ?>
											
												<option value="<?php echo $group->uuid; ?>"<?php echo ($_['user']['lead']->group->uuid == $group->uuid ? ' selected' : ''); ?>><?php echo $group->name; ?></option><?php
												
											} ?>
											
										</select><?php
										
									}else{ ?>
									
										<p>There are no groups in the system.</p><?php
										
									} ?>
									
								</td>
							</tr>
						</table>
					</fieldset> */ ?>
				    <h3 class="_-fieldset--title">Station Information</h3>
					<fieldset class="_-fieldset--user--station--select _-fieldset--mini">
						<table class="_-table _-table--user--station--select _-table--user--station--select _-inv" cellpadding="0" cellspacing="0">
							<tr>
								<td class="_-icon--wrapper">
									<span class="_-icon _-icon--font--station"></span>
								</td>
								<td>
									<select class="_-input--text _-input--select" name="lead[station]" placeholder="Select a Station..."><?php

					    				$f = $this->field(array('lead','station'),'',(!empty($this->obj) ? $this->obj->station : ''));
										$f_selected = false;

										if($stations = _Station::all()){

											# ~EN (2015): in order to determine if the placeholder is selected, we need to see if we've selected anything further down the list first -> output buffer! :)
											ob_start();
								    		foreach($stations as $skey => $station){
								    			if(!empty($f) && ($f->uuid == $station->uuid)){
								    				$f_selected = true;
								    			} ?>

												<option value="<?php echo $station->uuid; ?>"<?php echo (!empty($f) && ($f->uuid == $station->uuid) ? ' selected' : ''); ?>><?php echo $station->call_letters; ?></option><?php

								    		}

								    		$f_ob = ob_get_clean(); ?>

								    		<option disabled<?php echo (!$f_selected ? ' selected' : ''); ?>>Main Station</option>
								    		<option></option><?php

								    		echo $f_ob;
								    		unset($f_ob, $f_selected, $f);

								    	} ?>

									</select>
								</td>
							</tr>
						</table>
					</fieldset><?php
						
					if(!empty($this->obj) && ($subs = $this->obj->form_submissions())){ ?>
						
					    <h3 class="_-fieldset--title">Form Submissions</h3><?php
						    
						foreach($subs as $skey => $sub){ ?>
						
							<fieldset class="_-fieldset--user--lead--select _-fieldset--nano _-ui--accordion" data-_-ui-accordion="<?php echo ($skey+1); ?>" data-_-ui-accordion-toggle="<?php echo ($skey+1); ?>">
								<table class="_-table _-table--user--station--select _-table--user--station--select _-inv" cellpadding="0" cellspacing="0">
									<tr>
										<td class="_-icon--wrapper">
											<a class="_-ui--accordion--toggle" href="javascript:;" data-_-ui-accordion-toggle="<?php echo ($skey+1); ?>"><span class="_-icon _-icon--font--email"></span></a>
										</td>
										<td>
												<h4><a class="_-ui--accordion--toggle" href="javascript:;" data-_-ui-accordion-toggle="<?php echo ($skey+1); ?>"><?php echo $sub['form']->name; ?> &ndash; <?php echo date('M d, Y @ g:i a',strtotime($sub['submitted'])); ?></a></h4>
												<div class="_-ui--accordion--content" data-_-ui-accordion-content="<?php echo ($skey+1); ?>">
													<dl><?php
														
														foreach($sub['data']['lead'] as $dkey => $data){
#															var_dump('@@@$',$data);
#															continue; ?>
														
															<dt><h4><?php echo ucwords(str_replace('-',' ',$dkey)); ?></h4></dt>
															<dd><?php echo (is_array($data) ? implode(', ',$data) : $data); ?></dd><?php
															
														} ?>
														
													</dl>
												</div>
											<?php
#												var_dump('@@$',json_decode($sub['data'])); ?>
										</td>
									</tr>									
								</table>
							</fieldset><?php
								
						}
							
					} ?>
					
				</div><?php
					
			} ?>
			
		    <fieldset class="_-form--buttons">
				<input type="submit" name="_submit" value="<?php echo ucwords(str_replace('_',' ',$_['admin']->route['v'])); ?> &#9658;" class="contact_button _-button _-input--submit" />
		    </fieldset>
    	</form><?php
    	
    $template['_'] = ob_get_clean();
    
    # } main :EN~
    
	# ~EN: success {
	
	ob_start(); ?>
	
	<div class="_-form _-form--success">
		<h3 class="copy">Thank you for your inquiry. We will contact you shortly.</h3>
		<h3 class="copy"><a class="_-btn _-btn--continue" href="/">Click to Continue &#9658;</a></h3>
	</div><?php #._-form._-form--success

	$template['success'] = ob_get_clean();
	
	# } success :EN~
	
?>
