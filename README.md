# NIMBUS PHP Fake Documentation

* Remember - all classes start with _
* Models are subclasses of _Model
* Presenters are subclasses of _Presenter
* Views are static HTML

## Directory Structure 

`/-` -> fake API requrests
     * `/-/vacations.php` -> `http://site.com/-/vacations`

`/_` -> “app” directory

`/_/_.php` - bootstrap file
	* everything happens here

`/_/lib` - library files
`/_/lib/inc` - includes
`/_/lib/array.php` - array files

## Array Operations

### Array Collapsing
```
$ary = array();
$ary[‘user’][‘name’][‘first’] = ‘john’;
$ary[‘user’][‘name’][‘last’] = ‘chen’;

$ary = array_collapse($ary[‘user’]);
// $ary[‘user’][‘name-first’] = ‘john’;
// $ary[‘user’]['name-last’] = ‘chen’;
```

### Array Expansion
```
$user = array();
$user[‘name-first’] = ‘john’;
$user['name-last’] = ‘chen’;

$user = array_expand($user);
// $user[‘name’][‘first’] = ‘john’;
// $user[‘name’][‘last’] = ‘chen’;

$user = new _User($user);
$user->save();

$user->name[‘first’] = ‘john’;
$user->save();
```

### Pick an element from multi-dimensional array
```
$array = array(
	‘animals’	=> array(
		‘cats’	=> array(),
		‘dogs’	=> array()
	)
);

$element = array_pick($array, array(‘animals’,’cats’));
// basically equivalent to $element[‘animals’][‘cats’]
```

## The System

### Core

`/_/inc/sys.php` - system stuff, low-level

### Plain Objects

`/_/lib/o` - objects

  * `/_/lib/o/o.php` - master class (class `_`) - everything is a subclass of this
  * `/_/lib/o/router.o.php` - router
  * `/_/lib/o/api.o.php` - basic api class (new api for each project)
  * `/_/lib/o/sfm.api.o.php` - SFM project-specific functions

### Models

`/_/lib/m` - models  

  * `/_/lib/m/m.php` - basic model (also subclass of `_`)


#### Load model data from database

```
$model = new _Model(array(
	FETCH_FROM_DB	=> true,
	‘id’			=> 11
));

// will return new _Model with id 11 from table “models”
```

`/_/lib/m/page.m.php` - page model

`/_/lib/m/user.m.php` - user model

You *should* be able to specify any db field to query against (in this case, `email`), but you’ll only get the first result if there’s more than one. Try to stick to `id` or `uuid`



`/_/lib/m/vacations.m.php` - vacations model
  * URL: `//site.com/vactions`
  * Load `_Vacation` from database

```
$vacation = new _Vacation(array(
	FETCH_FROM_DB	=> true,
	‘uuid’		=>‘mXFKtXqDNc8hwDsR7JeyG8JfkaR7’
)); 

// will return new _Vacation with data from given ‘uuid’ field in table ‘vacations’
```

  * You can specify `id`, `uuid`, or `slug` to get records from DB - note `slug` may not be unique, so don’t rely on that; uuid is preferred

### Admin Area

`/_/lib/m/admin.m.php` - admin widget model
  * `$this->obj` -> current object
  * Functions correspond to `$url->pieces[2]` (‘add’,’edit’,’submit’)
  * URL: `//sfm.dev/admin/{model}/{action}/{args}`
  * URL: `//sfm.dev/admin/{model}/{action}?id={id}&stuff={stuff}`

sometimes “add” method is not specified, because it does “edit” with no args
	/_/lib/m/vacations.admin.m.php - vacations admin widget model
	
/_/lib/p - presenters
/_/lib/v - views

Global $_ array

NOTE - every function must start with global $_; in order to reference our global var

Some references - most are defined in _/_.php :

$_[‘.’] = full path of `_` directory (*not* doc root)
$_[‘/’] = array of directories
$_[‘db’] = DB object / controller
	$_[‘db’]->get(‘users’); 	// select * from users
	// more stuff  in _/o/db.o.php
$_[‘user’] = $_[‘usr’] = current user
$_[‘page’] = current page

