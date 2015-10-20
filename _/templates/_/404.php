<?php
	$this->body_classes[] = '_-404';
	
	$this->title = 'oobs :( - Page Not Found';

	echo $this->header(); ?>
	
	<div id="content--main">
		<h1><?php echo $this->title; ?></h1>
		<p>Oops :( - 404 - The page you've requested cannot be found</p>
	</div><?php #content--main
	
	echo $this->footer();
?>