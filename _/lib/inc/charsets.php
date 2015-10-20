<?php
	/* juniper/lib/charsets - lists of character encodings
		(juniper + numbus) (c) 2012+ numonium //c - all rights reserved */
		
	global $_;
	
	$_['charsets'] = array(
		'bom'	=> array(
			'utf8'					=> chr(0xEF) . chr(0xBB) . chr(0xBF),
			'utf16-little-endian'	=> chr(0xFF) . chr(0xFE),
			'utf16-big-endian'		=> chr(0xFE) . chr(0xFF),
			'utf32-little-endian'	=> chr(0xFF) . chr(0xFE) . chr(0x00) . chr(0x00),
			'utf32-big-endian'		=> chr(0x00) . chr(0x00) . chr(0xFE) . chr(0xFF)
		),
		'utf8'	=> 'utf-8',
		'utf-8'	=> 'utf-8',
		'utf16-little-endian'	=> 'utf-16le',
		'utf16-big-endian'		=> 'utf-16be',
		'utf32-little-endian'	=> 'utf-32le',
		'utf32-big-endian'		=> 'utf-32be',
		'iso-latin-1'	=> 'iso-8859-1'		
	);
?>