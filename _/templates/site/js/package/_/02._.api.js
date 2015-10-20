(function(_, $){

	var __class = {
		_ : 'API',
		parents : ['_']
	};

	_._.add({
		_class : __class,
		constructor : function(args){
		
			_._.parentConstruct(this,arguments,__class);
		
			var _t = this; //for scope reasons
			this._id = __class._;
			this._cmd = 'api';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add
			this.uuid = '';
			
			this.key = ''; // api key

			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);
						
		},
		proto : {
			init : function(args){
//				this.register();
			}
		}
	});

	_._.api = {
		// place api CLASSES here	
	};
	
	_.api = {
		// place api OBJECTS here	
	};
	
})(_, jQuery);