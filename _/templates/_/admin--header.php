<div id="_-admin--header--wrapper">
	<div id="_-admin--header--<?php
		$slug = slug(plural($_['admin']->str['model']));
		
		echo slug(plural($_['admin']->str[$slug == 'admin' ? 'slug' : 'model'])); ?>" class="_-admin--header">
		<span class="icon"></span>
		<h2><span><?php echo plural($_['admin']->str['model']); ?> &raquo; <?php echo $_['admin']->str['cmd']; ?></span></h2><?php
			$p = strtolower(plural($_['admin']->str['model'])); ?>
			
		<div class="buttons"><?php
	
			if(!$_['admin']->_cmd['view']){ ?>
			
				<a class="_-button--admin _-button--view" href="/admin/<?php echo $p; ?>/add"><span>&#9668;</span> Back</a><?php
				
			}
				
			if(!$_['admin']->_cmd['add']){ ?>
			
				<a class="_-button--admin _-button--add" href="/admin/<?php echo $p; ?>/add"><span>+</span> Add</a><?php
				
			}
			
			if(!$_['admin']->_cmd['view']){ ?>
		
				<a class="_-button--admin _-button--save" href="#-save">Save <span>&#9658;</span></a><?php
			
			} ?>
			
			<a class="_-button--admin _-button--close" href="#-close"><span>+</span></a>
		</div>
	</div><?php
	
	if(!empty($this->msg)){ ?>
	
		<div class="_-admin--msg"><?php
		
			echo $this->msg; ?>
			
		</div><?php
		
	} ?>

</div>