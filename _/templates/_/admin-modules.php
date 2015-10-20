<?php
	/* juniper/templates/admin/modules - modules for admin section
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	
	
	*  !! will be inside _Router::prepare() */
	
	if(!_User::logged_in()){
		$_['url']->redirect('/admin'.(isset($_['get']['embed'])  ? '?embed' : ''));
	}
	
	$model = (!empty($_['url']->pieces['url']['model']) ? keytoclass($_['url']->pieces['url']['model']) : false);
	$view = (!empty($_['url']->pieces['url']['action']) ? $_['url']->pieces['url']['action'] : false);
	$_['url']->require = false;
	
	$model_class = (class_exists($model) ? $model : singular($model));
	if(!empty($model) && class_exists($model_class)){
		$model = new $model_class();
	}
	unset($model_class);

	$presenter = ($model ? $_['router']::get_presenter($model) : '_Presenter');
	
	if(!class_exists($presenter)){
		$presenter = '_Presenter'; // default presenter
	}
	
	if(empty($_['admin'])){	
		$_['admin'] = array();
	}
	
	$_['admin'] = new _Admin(array(
			'cmd'	=> $view,
			'slug'	=> slug($view),
			'str'	=> array(
				'model'	=> _get_class($model),
				'slug'	=> slug($view),
			),
			'model'	=> &$model,
			'view'	=> $view
	));
			
	if(!empty($view) && method_exists((new $presenter()),'admin_'.$view)){
		$view = 'admin_'.$view;
	}
	
	$_['admin']->func = $view;
		
	if(class_exists($presenter)){
		$presenter = new $presenter(array(
			'model' => $model,
			'view' => $view
		));
		
		$_['admin']->presenter = &$presenter;
		$_['admin']->str['presenter'] = _get_class($presenter);
		
		if(method_exists($presenter,$view)){	
			$presenter->$view();
		}
		
	}
	
	exit; //without this, would return to router
?>