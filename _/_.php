<?php
	/* nimbus/_ -> let's get started!!
	   nimbus (c) 2012+ numonium //c
	   
	   + REDUX (c) 2014 numonium //c */

	global $_;

	ini_set('memory_limit','512M');
	
	define('WILDCARD','*');
	
	if(!defined('FETCH_FROM_DB')){
		define('FETCH_FROM_DB','@db');
	}
	
	$_['_']['version'] = 4.0; //nimbus version
	$_['env']['version'] = &$_['_']['version']; //standalone
	
	$_['.'] = dirname(__FILE__);
	$_['@'] = array(); // references to objects
	
	# ~EN (2015): enable code optimizations for prod
	$_['env']['build'] = 0 || (isset($_GET['build']));
	$_['build'] = &$_['env']['build'];
		
	$_['env']['lang']='en-US'; //one day we'll auto-detect locale
	$_['env']['xml-lang']='en'; //one day we'll auto-detect locale
	
	$_['tmp'] = array('i' => 0);
	
	$_['legacy'] = false;

	#~EN: only put minimal system files here necessary for proper bootstrapping -> in priority order
	require_once('lib/inc/const.php');	
	require_once('lib/inc/array.php');
	require_once('lib/inc/charsets.php');
	require_once('lib/inc/cmp.php');
	require_once('lib/inc/dir.php');
	require_once('lib/inc/dirs.php');
	require_once('lib/inc/file.php');
	require_once('lib/inc/sys.php');
	require_once('lib/inc/session.php');
	require_once('lib/inc/str.php');
	require_once("lib/inc/lang.php");
	require_once('lib/inc/xfuncs.php');
	
	if(!empty($_['legacy'])){
		require_once('lib/inc/legacy.php');
	}
	
	add_include_path($_['.'],0);
	
	require_once('lib/o/o.php');
	require_once('lib/inc/doctypes.php');
	require_once('lib/o/mime.o.php');
	
#	set_error_handler(array('_Router','error'));
	
	require_once("lib/inc/cfg.php");
	require_once(_dir($_['/']['m'].'/m.php'));
	require_once(_dir($_['/']['p'].'/p.php'));
	require_once(_dir($_['/']['v'].'/v.php'));
	require_once('lib/inc/simple-html-dom.php');
	require_once('lib/inc/js.php');
	require_once('lib/inc/mime.php');
	require_once(_dir($_['/']['m'].'/image.m.php'));
	require_once(_dir($_['/']['m'].'/template.m.php'));
	
	require_once('lib/inc/time.php');
	
	require_once('lib/o/api.o.php');
	
	require_once('lib/o/geo.o.php');
	require_once('lib/inc/loc.php');
	
#	require_once('lib/o/uglify.o.php');
		
	_session_start();
	unregister_globals();
	remove_magic_quotes();

	$_['env']['doc-root']=$_['server']['document-root'];
	$_['env']['global-doc-root']=&$_['env']['doc-root'];
	$_['doc-root']=&$_['env']['doc-root'];

	$_['protocol']=(strpos(strtolower($_['server']['server-protocol']),'http/')!==false ? 'http' : '');
	$_['url']=new _URL($_['server']['request-uri']);
	$_['http']=new _HTTP();
	_define($_['http']->response,'HTTP');
	
	$_['env']['ajax'] = (!empty($_['server']['http-x-requested-with']) && strtolower($_['server']['http-x-requested-with']) == 'xmlhttprequest');
	$_['ajax'] = &$_['env']['ajax'];
	
	if($_['ajax']){
		$_['http']->header('cache-control','no-cache');
	}
	
	$_['host']=&$_['url']->pieces['host'];
	$_['host-www']=(!in_array('www',$_['host']) ? 'www.' : '').implode('.',$_['host']);
	$_['env']['host']=&$_['host'];
	$_['domain']=&$_['url']->domain;
	$_['env']['domain']=&$_['domain'];

	_define('_DOMAIN',$_['domain']);
	
	$_['env']['contexts']=array(
		'dev'	=> array(
			'keys' => array('dev','localhost','10')
		),
		'beta'	=> array(
			'keys'	=> array('beta','clients','numonium')
		),
		'live'	=> array(
			'keys' => array('www','sunfunmedia',WILDCARD)
		),
		'mobile'=> array(
			'keys' => array('m')
		),
		'admin'	=> array(
			'keys' => array('admin')
		)
	);
	
	$_['env']['embed'] = isset($_['get']['embed']);
	$_['embed'] = &$_['env']['embed'];
	
	$_['env']['reserved'] = array(
		'domains'	=> array(),
		'subdomains'	=> array('www','dev','admin','cart','store','beta','alpha')
	);
	
	/* check if beta site for client (xxx.junipr.co)
	if(_is_array($_['url']->pieces['host']) && endsWith($_['server']['http-host'],'junipr.co')){
	
		if(count($_['url']->pieces['host']) <= 2 || (count($_['url']->pieces['host']) >= 3 && in_array($_['url']->pieces['host'][0], $_['env']['reserved']['subdomains']))){ //main site (www.junipr.co)
			_env('live');
		}else{ //beta client site (holiday-springs.junipr.co)
			_env('beta');
		}
		
	}else{*/
		_setEnv();
#	}
	
	set_error_reporting();
		
	//~EN: can add rest of lib includes after min-sys init
		
	foreach(array('fonts','colors') as $tkey=>$type){
		if($tfile=_file_exists(_dir($_['/']['templates'].'/_/'.$type.'.php'))){
			require_once($tfile);
		}
	}
	
	//db connect
	$_['db'] = new _DB($_['cfg']['db'][$_['env']['context']]);
	$_['ua'] = new _UserAgent();
	
	# geo init (where am i?)
	# ~EN: we need to cache the geo info to avoid multiple external requests
	if(!empty($_SESSION['_']['geo'])){
		if(is_string($_SESSION['_']['geo'])){
			$_SESSION['_']['geo'] = unserialize($_SESSION['_']['geo']);
		}
		$_['geo'] = &$_SESSION['_']['geo'];
	}else{
		$_['geo'] = new _Geo();
		$_SESSION['_']['geo'] = &$_['geo'];
	}
	
	$_['crypt'] = new Bcrypt();
	
	//mods init
	$_['mods'] = _ModulesPresenter::all();
	
	//sites init
	$_['site'] = new _Site(array(
		'domains-'.$_['env']['context'] => (startsWith($_['server']['http-host'],'www.') ? implode('.',array_slice($_['url']->pieces['host'],1)) : $_['server']['http-host']) ,
		FETCH_FROM_DB => true
	));
	
	if(empty($_['site'])){
		var_dump($_['site']);
		die('ERR[_][site][init]');
	}else if(empty($_['site']->dir['/'])){
		var_dump($_['site']);
		die('ERR[_][site][no-root] please create site doc root');
	}
		
#	$_['sites']=_Site::all(false); // expensive
	
	// let's hope this doesn't cause any problems O:-)
	$_['doc-root'] = $_['site']->dir['/'];
	
	require_once('lib/o/sfm.api.o.php');
	
	if(empty($_['api']['sfm'])){
		$_['api']['sfm'] = new _API_SFM();
	}
	
	if(_User::logged_in() && !empty($_['session']['_']['login'])){
		
		$_['user'] = $_['session']['_']['login'];
		
		if(!empty($_['user']['uuid'])){
			$_['user']['user'] = new _User(array(
				FETCH_FROM_DB => true,
				'uuid'	=> $_['user']['uuid']
			));
			
			$_['user']['usr'] = &$_['user']['user'];
		}
	}else{
		$_['user'] = false;
	}

	$_['usr'] = &$_['user'];
	
	$_['router'] = new _Router('',$_['site']);
	
	if(!defined('__NU_NO_ROUTE') || !__NU_NO_ROUTE){
		$_['router']->route();
	}

		

?>
