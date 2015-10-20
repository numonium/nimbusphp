<?php
	$this->body_classes[] = '_-404';
	
	$_['env']['404'] = true;
	$_['404'] = &$_['env']['404'];
	
#	$this->title = 'oobs :( - Page Not Found';

	echo $this->header(); ?>

	<div class="_-wrapper _-page _-page--sub _-page--<?php echo $this->slug; ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-gallery--wrapper _-gallery--sub--wrapper">
				<ul class="_-gallery _-gallery--<?php echo $this->slug; ?> _-gallery--slider slides-container" data-_-gallery-init="false">
					<li class="_-gallery--slide _-gallery--item _-gallery--item--bill-pay-is-back" data-slug="<?php echo $this->slug; ?>">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title"><?php echo $this->name; ?></h2>
							<h3 class="_-gallery--slide--subtitle">The page you've requested could not be found.</h3>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper
			
	echo $this->footer();
?>