<?php
	global $_;
	
	$_['cfg']=array(
		'admin'	=> array(
			'forms'	=> array(
				// moved to $_['const']['forms']['admin']
			)
		),
		'api'	=> array(
			'capsule'	=> array(
				'key'	=> '',
				'auth'	=> '',
				'url'	=> ''
			),
			'google'	=> array(
				'_'		=> array(
					'key'	=> '',
					'url'	=> 'https://maps.googleapis.com/maps/api/js?libraries=places&key=__API_KEY__'
				),
				'analytics'	=> array(
					'key'	=> (
						/*$_['env']['contexts']['dev'] ? */'UA-00000000-1' /*: 'UA-00000000-1'*/
					)
				),
				'geocode'	=> array(
					'key'	=> '',
					'url'	=> 'http://maps.googleapis.com/maps/api/geocode/xml?address=__Q__&sensor=false'
				),
				'maps'	=> array(
					'key'	=> ''
					'url'	=> array(
						'js'	=> 'http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=__API_KEY__',
						'geocode-reverse'	=> 'http://maps.google.com/maps/geo?q=__LAT__,__LNG__&output=json&sensor=true&key=__API_KEY__',
						'api'	=> 'https://maps.googleapis.com/maps/api/js?libraries=places&key=__API_KEY__'
					)
				)
			),
			'ipinfodb'	=> array(
				'key'	=> '',
				'url'	=> 'http://api.ipinfodb.com/v3/ip-city/?key=__API_KEY__&ip=__IP__'
			),
			'ms'	=> array(
				'geocode'	=> array(
					'key'	=> '',
					'url'	=> 'http://dev.virtualearth.net/REST/v1/Locations/__Q_COUNTRY__/__Q_STATE__/__Q_ZIP__/__Q_CITY__/__Q_ADDR__?o=xml&key=__API_KEY__'
				),
				'geocode-reverse'	=> array(
					'key'	=> '',
					'url'	=> 'http://dev.virtualearth.net/REST/v1/Locations/__GPS_LAT__,__GPS_LNG__?o=xml&includeNeighborhood=1&key=__API_KEY__'
				)
			),
			'yahoo' => array(
				'geocode' => array(
					'key'	=> '',
					'url'	=> 'http://where.yahooapis.com/geocode?appid=__API_KEY__&q=__Q__'
//					'url'	=> 'http://local.yahooapis.com/MapsService/V1/geocode?appid=__API_KEY__'
				)
			),
			'fb'	=> array(
				'app_id'	=> '',
				'key'		=> '',
				'secret'	=> 	'',
			),
			'tw'	=> array(
				'key'	=> '',
				'secret'	=> '',
				'request_token_url'	=> 'http://twitter.com/oauth/request_token',
				'access_access_url'	=> 'http://twitter.com/oauth/access_token',
				'authorize_url'	=> 'http://twitter.com/oauth/authorize',
				'tweet_url'	=> 'https://twitter.com/statuses/update.xml',
				'username'	=> '',
				'password'	=> '',
			)
		),
		'db'	=> array(
			'live'	=> array(
				'host'		=> 'localhost',
				'user'		=> 'live',
				'pass'		=> '',
				'db'		=> 'live',
				'collapse'	=> false,
				'expand'	=> true
			),
			'beta'	=> array(
				'host'		=> 'localhost',
				'user'		=> 'beta',
				'pass'		=> '',
				'db'		=> '',
				'collapse'	=> false,
				'expand'	=> true
			),
			'dev'	=> array(
				'host'		=> 'localhost',
				'user'		=> 'dev',
				'pass'		=> '',
				'db'		=> '',
				'collapse'	=> false,
				'expand'	=> true
			)
		),
		'domains'	=> array(
			'dev'	=> 'site.dev',
			'beta'	=> 'beta.site.com',
			'live'	=> 'www.site.com'
		),
		'form'	=> array(
			'msg'	=> array(
				'success'	=> 'Thanks for contacting us!'
			),
			'err'	=> array(
				'capsule'	=> 'We could not integrate this data into Capsule. Please try again later.',
				'email'		=> 'Apologies, your message could not be sent at this time. Please try again later.',
				'ip'		=> 'We only allow submissions from the United States &amp; Canada at this time',
				'required'	=> 'Please correct the highlighted fields',
				'pictcha'	=> ''
			)
		),
		'sidebar'	=> array(
			'position'	=> array(
				'_'	=> 'right'
			)
		),
		'str'	=> array(
			'salt'	=> array(
				'password' => ''
			),
			'token'	=> array(
				'wrap' => '__'
			)
		)
	);
	
	$_['cfg']['api']['google']['_']['_url'] = $_['cfg']['api']['google']['_']['url'];
	$_['cfg']['api']['google']['_']['url'] = str_replace('__API_KEY__',$_['cfg']['api']['google']['_']['key'],$_['cfg']['api']['google']['_']['url']);
?>
