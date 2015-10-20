<?php
	/* juniper/lib/const - constant definitions
		(juniper + numbus) (c) 2012+ numonium //c - all rights reserved */
		
	$_['const']=array(
		'date'	=> array(
			'format' => array(
				'admin'	=> array(
					'list'	=> 'l, d F Y @ g:i a'
				)
			)		
		),
		'domains'	=> array(
			'dev'	=> 'mvc.juniper.dev',
			'beta'	=> 'junipr.co',
			'live'	=> 'junipr.co'
		),
		'ext'	=> array(
			'img'	=> array(
				'png'	=> 'Portable Network Graphics Image',
				'gif'	=> 'Graphics Interchange Format Image',
				'jpeg'	=> 'Joint Photographic Experts Graphic',
				'bmp'	=> 'Bitmapped Image',
				'tiff'	=> 'Drunk Image'
			)
		),
		'file'	=> array(
			'post'	=> array(
				'err'	=> array(
					'uploaded'	=> 0,
					'not-uploaded'	=> 4
				)
			)
		),
		'forms'	=> array(
			'admin'	=> array(
				'login' => array(
					FETCH_FROM_DB => true,
					'slug' => 'admin--login'
				),
				'edit'	=> array(
					FETCH_FROM_DB => true,
					'slug' => 'admin--edit'
				),
				'seo'	=> array(
					FETCH_FROM_DB => true,
					'uuid'	=> ''
				),
			),
			'contact'	=> array(
				'to'	=> array('nimbustest@gmail.com')
			)
		),
		'regex'	=> array(
			'letter-caps' => array('[A-Z]+'),
			'letter-caps-first' => array('[A-Z]'),
			'letter-lower' => array('[a-z]+'),
			'letter-lower-first' => array('[a-z]'),
		    'url' => array(
		        '/(https?|ftp):\/\/[^\/]\/?/i',
				'/(?<!\/\/)www\.\S+[^\/]+\/(.*)\/?/i'
			),
			'url-whole' => array(
				'`((?:https?|ftp)://\S+[[:alnum:]]\/?)`si',
		        '`((?<!//)(www\.\S+[[:alnum:]]\/?))`si'
		    ),
		),
		'salt'	=> array(
			'md5'	=> ''
		),
		'url'	=> array(
			'dir'	=> array(
				'whitelist'	=> array('+')
			)
		)
	);
	
	$_['const']['array']['expand']['args'] = $_['const']['array']['flatten']['args'] = array(
		'__args' => array(
			'sep' => '--'
		)
	);
	
	$_['regex'] = &$_['const']['regex'];
?>