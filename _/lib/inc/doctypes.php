<?php
	/* juniper/lib/doctypes - hard-coded document-type definitions (DTDs)
		juniper + numbus © 2010+ numonium //c - all rights reserved */

	global $_;

	$_['doctypes']=array(
		'html5' => '<!DOCTYPE html>',
		'html4' => array(
			'frameset'		=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'
		),
		'xhtml' => array(
			'strict'			=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
			'transitional'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
			'frameset'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
			'11'				=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
		),
		'meta'	=> array(
			'utf-8'		=> '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
		)
	);
	
	_define($_['doctypes']);
?>