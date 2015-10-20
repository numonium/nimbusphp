<?php
	/* juniper/lib/dirs - hard-coded directory definitions
		(juniper + numbus) (c) 2012+ numonium //c - all rights reserved */
		
	global $_;
	
	$_['/']=array(
/*		'log'	=> _dir($_['.'].'/log'),
		'models'=> _dir($_['.'].'/m'),
		'presenters' => _dir($_['.'].'/p'),
		'sites'	=> _dir($_['.'].'/sites'),
		'views' => _dir($_['.'].'/v')*/
		'assets'=> array('css','fonts','img','js','pdf'),
		'img'	=> _dir('/img'),
		'log'	=> _dir('/log'),
		'm'=> _dir('lib/m'),
		'models'=> _dir('lib/m'),
		'mod' => _dir('/mod'),
		'modules' => _dir('/mod'),
		'p' => _dir('lib/p'),
		'presenters' => _dir('lib/p'),
		'sites'	=> _dir('/sites'),
		'templates' => _dir('/templates'),
		'themes'	=> _dir('/themes'),
		'uploads'	=> _dir('/+'),
		'v' => _dir('lib/v'),
		'views' => _dir('lib/v'),
		'widgets'	=> _dir('/widgets')
	);
	
	$_['/']['galleries'] = $_['/']['img'].'/galleries';
	
?>