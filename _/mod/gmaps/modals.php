<?php
	/* juniper/mod/wysiwyg/modals - modal window declarations
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	*/
		
	$modals = array(
		'clips'	=> array()
	);
	
	if(isset($_['get']['clips']) || isset($_['get']['all'])){ ?>
		
		<div id="clipsmodal">
			<div class="redactor_modal_box">
				<ul class="redactor_clips_box">
					<li>
						<a href="#" class="redactor_clip_link">Lorem ipsum...</a>
						
						<div class="redactor_clip" style="">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</div> 
					</li>
					<li>
						<a href="#" class="redactor_clip_link">Red label</a>
						
						<div class="redactor_clip" style="">
							<span class="label-red">Label</span>
						</div>
					</li>
				</ul>
			</div>
			<div id="redactor_modal_footer">
				<span class="redactor_btns_box">
					<a href="javascript:void(null);" class="redactor_btn_modal_close">Close</a>
				</span>
			</div>
		</div><?php
	
	} ?>