(function(_, $){

	var __class = {
		_ : 'LinkedListNode',
		parents : ['_']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){	
		
			_._.parentConstruct(this,arguments,__class);
		
			var _t = this;
			this._id = __class._;
			this._cmd = 'linked-list-node';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			this.uuid = '';
			
			this._obj = true; // property set to distinguish quick objects { data : 5 } from full Node objects
			
			this.cfg = {
				classes : {
					_ : '_-' + this._cmd,
					bg : '_-' + this._cmd + '--bg',
					wrapper : '_-' + this._cmd + '--wrapper',
					content : '_-' + this._cmd + '--content',
				},
				tags : {
					_ : 'div'
				},
				z : 1000 // default z-index
			};
			
			this.data = (args && args.data ? args.data : false);
			this.ele = (args && args.ele ? args.ele : false);
	
	//		~EN: firt/last available through list reference and make insertion simpler
	//		this.first = null;
	//		this.last = null;
	
			this.prev = null;
			this.next = null;
			
			this.list = null; // reference to liked list
			
//			this.sticky = false; // can be either "first" or "last", so when new nodes are added or removed, they don't affect the position of this node

			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);
		},
		proto : {
			init : function(args){
				
			}
		}		
	});
	
})(_, jQuery);