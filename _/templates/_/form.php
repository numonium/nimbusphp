<?php
	/* /juniper/lib/templates/_/form - template for html forms
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
		
		- all templates should be inside a Page obj
		- $this->form should be a Form obj
	 */
	
	echo $this->form->open();
	
	$fields_after = array();
	
	if($this->form->fieldset){ ?>

		<fieldset>
			<legend align="center"><?php echo $this->form->title; ?></legend><?php

	}
	
	if(!empty($this->form->uuid)){
		
		echo new _HTML(array('tag' => 'input', 'type' => 'hidden', 'name' => 'uuid', 'value' => $this->form->uuid));
		
	}
	
#	if(!empty($_['url']->referrer) && is_object($_['url']->referrer) && !empty($_['url']->referrer->uri)){
	if(!empty($_SESSION['redirect-from'])){
		echo new _HTML(array('tag' => 'input', 'type' => 'hidden', 'name' => 'referrer', 'value' => $_SESSION['redirect-from']));
	} ?>
	
			<table cellpadding="0" cellspacing="0"><?php
			
				foreach($this->form->fields as $fkey=>$field){
					
					if($field->type=='hidden'){
						$fields_after[] = (string) $field;
					}else{ ?>
						
						<tr><?php
						
							if(!empty($field->row)){ ?>
							
								<td colspan="2"<?php echo (in_array($field->type, array('submit')) ? ' class="buttons"' : ''); ?>>
									<label><?php
									
										if(is_string($fkey) && !in_array($field->type, array('submit'))){ ?>
											
											<span><?php echo $fkey; ?></span><?php
											
										}
										
										echo $field;
									
									?></label>
								</td><?php
								
							}else{ ?>
								
								<th><?php echo ($field->type!='submit' ? $fkey : ''); ?></th>
								<td<?php echo ($field->type=='submit' ? ' class="buttons"' : ''); ?>><?php echo $field; ?></td><?php

							} ?>
					
						</tr><?php
						
					}
					
				} ?>
				
			</table><?php
	
	if($this->form->fieldset){ ?>
		
		</fieldset><?php
		
	}
	
	if(_is_array($fields_after)){
		echo implode('',$fields_after);
	}

	echo $this->form->close();
?>