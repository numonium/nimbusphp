<?php
	$_['admin']->page = &$this;
	
	if(!empty($_['admin']->route['v']) && method_exists($_['admin']->model, $_['admin']->route['v'])){
		ob_start();
		
		$ret = $_['admin']->model->{$_['admin']->route['v']}();
		
		$content = ob_get_clean();
	}
	
	echo $this->header(); ?>
	
	<div class="_-wrapper _-page _-page--sub _-page--<?php echo $this->slug.(!empty($this->matches) && !empty($this->matches[1]) ? ' _-page--'.$this->matches[1].' _-page--'.$this->slug.'--'.$this->matches[1] : ''); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-page--content--inner">
				<h2 class="_-gallery--slide--title"><?php echo $this->name.(!empty($_['admin']->route['v']) ? ' &raquo; '.ucwords(str_replace('_',' ',$_['admin']->route['v'])) : '').(!empty($_GET['type']) ? ' '.ucwords(str_replace('-',' ',$_GET['type'])) : ''); ?></h2><?php
					
				if(!empty($content)){
					echo $content;
				}else{ ?>
				
					<h3>Please select an action below:</h3><?php
						
				} ?>
				
				<section class="_-admin--nav--wrapper"><?php echo $_['admin']->model->nav(); ?></section>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>