(function(_, $){

	var __class = {
		_ : 'LinkedList',
		parents : ['_']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){	
		
			_._.parentConstruct(this,arguments,__class);
			var _t = this;
			this._id = __class._;
			this._cmd = 'linked-list';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			this.uuid = '';
			
			this.ele = (args && args.ele ? args.ele : false);
			
			this.cfg = {
				classes : {
					_ : '_-' + this.cmd,
					bg : '_-' + this.cmd + '--bg',
					wrapper : '_-' + this.cmd + '--wrapper',
					content : '_-' + this.cmd + '--content',
				},
				tags : {
					_ : 'div'
				},
				z : 1000 // default z-index
			};
		
			this.first = null;
			this.last = null;
			
			// if we navigate through the list via this.next() and this.prev(), they will change this.current
			this.current = null;	
			this.length = 0;
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);
		},
		proto : {
			init : function(args){
				this.register();	
			},
			
			// ~EN: remember - adding DATA not whole NODE; will convert to node
			add : function(node,prepend){
				if(!node){
					return false;
				}
				
				_.log('**'+this._id+'[add]',node,prepend,this.first,this);
				
				node = this.makeNode(node);
				
				node.list = this;
			
				if(this.first == null){
	//				node.prev = node;
	//				node.next = node;
	
					this.first = node;
					this.last = node;
				}else if(prepend){
					node.prev = null;
					node.next = this.first;
					node.last = this.last;
					
					this.first = node.first = node;
				}else{
					node.prev = this.last;
					node.first = this.first;
					node.last = node;
					
					var current = this.first;
					
					/* ~EN: do we need this { *
					while(current.next){
						current.last = node;
						current = current.next;
					* } */
										
					this.last.next = node;
					this.last = node.last = node;
					
					/* ~EN: for circular linked lists { *
					node.next = this.first;
				
					this.first.prev = node;
					this.last.next = node;
					
					* } */
					
				}
				
				if(!this.current && this.first){
					this.current = this.first;
				}
				
				this.length++;
			
			},
			
			addAfter : function(node, after){
				if(!node){
					return false;
				}
				
				if(!this.first){ // probably because this.first = null
					this.first = this.last = node;
					
					this.length++;
					
					return true;
				}
				
				after = this.makeNode(after || this.first);
				node.prev = after;
				
				if(after.next){
					node.next = after.next;
					after.next.prev = node;
				}
				
				after.next = node;
				
				if(
					(after == this.last) ||
					(after.data == this.last.data)
				){
					this.last = node;
				}
							
				this.length++;
				
				return true;
			},
			
			get : function(index){ // returns node for index
				if(index == 0){
					return this.first;
				}else if(index > 0 && index < this.length){
					var current = this.first,
						i = 0;
						
					while(i++ < index){
						current = current.next;
					}
					
					return current;
				}else{
					return null;
				}
			},
			
			index : function(node,retNode){ // returns index from node, retNode returns the node or just the index itself
				// retNode = true is useful for returning whole node objects from quick node parameters (like searching by data, { data : 5})
				
				if(!node || !this.first){
					return false;
				}
				
				if(_.is.integer(node)){
					return node;
				};
				
				var ret = -1,
					current = this.first,
					i = 0;
					
				if((node == current) || (node.data == current.data)){
					return (retNode ? current : i);
				}
					
				while((i++ < this.length) && (current = current.next)){
					if((node == current) || (node.data == current.data)){
						return (retNode ? current : i);
					}
				}
				
				return ret;
			
			},
			
			insertAfter : function(node, newNode){
				newNode.prev = node;
				newNode.next = node.next;
				node.next.prev = newNode;
				node.next = newNode;
				
				if(newNode.prev == this.last){
					this.last = newNode;
				}
				
				this.length++;
			},
			
			is : {
	//			self : function(data){
	//				return ()
	//			}	
			},
			
			makeFirst : function(node,callback){
				
			},
			
			makeLast : function(node,callback){
				
			},
			
			makeNode : function(data){
				if(data instanceof _._.LinkedListNode){
					return data;
				}else if(_.is.integer(data) && (node = this.get(data))){
					return node;
				}else if(_.is.object(data) && !data._obj){ //passed a quick object .. {data : 5}
					return this.index(data,true);
				}
				
				return new _._.LinkedListNode({data : data});
			},
			
/*			this.register = function(args){
				if(!this.uuid){
					this.uuid = _.str.uniqid(this._cmd + '--');			
				}			
				
				_.log('router[register]['+this._id+']['+this.uuid+']',args,this);
				_.routers[this.uuid] = this;
			};*/
			
			next : function(){
				
				if(this.current && this.current.next){
					this.current = this.current.next;

					return this.current;
				}
				
				return false;
			},

			prev : function(){
				
				if(this.current && this.current.prev){
					this.current = this.current.prev;

					return this.current;
				}
				
				return false;
			},
			
			remove : function(node){
				if(!node){
					return false;
				}
				
				var index = (_.is.integer(node) ? node : null);
				node = this.makeNode(node);
				
				index = index || this.index(node);
				
				_.log('**' + this._id + '[remove]',node,index);
				
				var current = this.first,
					ret = null,
					i = 0;
				
				if((node == this.first) || (this.first.data == node.data)){ //first element
					this.first = node.next;
					
					if(!this.first){
						this.last = null;
					}else{
						this.first.prev = null;
					}
					
					ret = node;
				}else if(
					(index === this.length -1) ||
					(node == this.last) ||
					(this.last && (node.data == this.last.data))
				){ // last element
					ret = this.last;
					
					if(this.last = ret.prev){
						this.last.next = null;			
					}
				}else if(index > -1 && index < this.length){
					while(i++ < index){ // will navigate to current element
						current = current.next;
					}
					
					current.prev.next = current.next;
					ret = current;
				}
	
				this.length--;
				return ret;
				
			}
		}
	});	
	
})(_, jQuery);