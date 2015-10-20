(function(_, $){

	var __class = {
		_ : '_',
		parents : []
	};

	_._.add({
		_class : __class,
		constructor : function(args){
		
			var _t = this; // abstract for jquery closure (below)
			this._id = __class._;
			this._cmd = '_';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add			
			this.uuid = ''; // set during registration
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);
			
		},
		proto : {

			ctor : function(){
				
			},

			init : function(args){
				
			},
			
			inherits : function(parent, protoProps, staticProps){
				var child;
				
				// The constructor function for the new subclass is either defined by you
				// (the "constructor" property in your `extend` definition), or defaulted
				// by us to simply call `super()`.
				if (protoProps && protoProps.hasOwnProperty('constructor')) {
					child = protoProps.constructor;
				} else {
					child = function () { return parent.apply(this, arguments); };
				}
			
				// Inherit class (static) properties from parent.
				$.extend(child, parent);
			
				// Set the prototype chain to inherit from `parent`, without calling
				// `parent`'s constructor function.
				ctor.prototype = parent.prototype;
				child.prototype = new ctor();
				
				// Add prototype properties (instance properties) to the subclass,
				// if supplied.
				if (protoProps) $.extend(child.prototype, protoProps);
				
				// Add static properties to the constructor function, if supplied.
				if (staticProps) $.extend(child, staticProps);
				
				// Correctly set child's `prototype.constructor`.
				child.prototype.constructor = child;
				
				// Set a convenience property in case the parent's prototype is needed later.
				child.__super__ = parent.prototype;
				
				return child;
			},
		
			extend : function(protoProps, staticProps) {
				var child = this.inherits(this, protoProps, staticProps);
				child.extend = this.extend;
			
				return child;
			},
			
			/* ~EN: because of JS' odd inheritance model, we've stuffed all the parent constructors to call for each object in this.__parentConstruct
				- otherwise, we won't be able to call parent constructors up the chain with arguments
				-> we'll loop through and execute the constructors as popped off the stack */
			parentConstruct : function(){
				return _._.parentConstruct(this,arguments,__class);
			},
			
			register : function(args){
				this.uuid = _.str.uniqid(this._cmd + '--');
				
				if(_._.LinkedListNode && this instanceof _._.LinkedListNode && !this.data){
					this.data = this.uuid;
				}
				
				_.log('-router[register]['+this._id+']['+this.uuid+']',args,this);
				_.routers[this.uuid] = this;
				
				if(!_.routers[this._cmd]){
					_.routers[this._cmd] = this;
				}
			}

		}
	});
	
//	_.super = new _._._();

})(_,jQuery);