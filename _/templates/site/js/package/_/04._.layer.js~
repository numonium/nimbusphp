(function(_){

	var __class = {
		_ : 'Layer',
		parents : ['LinkedListNode']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){
			
			_._.parentConstruct(this,arguments,__class);
			
			var _t = this;
			this._id = 'Layer';
			this._cmd = 'layer';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			
			// references to other layers (abstracting linked-list behavior) - the top-most layer is the last element, bottom layer is first (a la photoshop)
			
			this.id = this.z = 0; // this.z corresponds to the element's z-index

			this.name = '';
			this.slug = '';
			this.shown = false;
			this.type = 'window'; // can also be modal
			this.html = this.content = this.ele = false;
			
			// doesn't assign to above/below, add to list, or open
			this.quiet = (args && args.quiet ? args.quiet : false);
			
			if(this.quiet){
				this.above = this.below = null;	
			}else{			
				this.above = (args && args.above && args.above instanceof _._[this._id] ? args.above : this.next);
				this.below = (args && args.below && args.below instanceof _._[this._id] ? args.below : this.prev);

				this.layer = {
	///				above : (args && args.above ? args.above : this.getNext()), // climb up to last node
					above : (args && args.above ? args.above : this.next), // climb up to last node
	//				below : (args && args.below ? args.below : this.getPrev()), // climb down to first node
					below : (args && args.below ? args.below : this.prev), // climb down to first node
	//				prev : this.getPrev(),
					prev : this.prev,
	//				next : this.getNext()
					next : this.next
				};

			}
			
			this.ele = this.ele || (args && args.ele ? args.ele : false) || document.createElement('div');			
			this.html = this.html || {};
			this.page = this.page || (args && args.page ? args.page : false); // attachment to page object
			this.z = 0; // z-index
			
			if(this.page){
				this.page.layer = this;
			}
			
			this.pagegroup = (args && args.pagegroup ? args.pagegroup : {});
			this.timeline = (args && args.timeline ? args.timeline : {});
			this.window = (args && (args.w || args.window) ? args.w || args.window : window);						
//			this.wl = (args && args.wl ? args.wl : false); // reference to WindowLayer object
			
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
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);
			
		},
		proto : {
					
			add : function(args){
				/* ~EN: add element to end of list. like photoshop, the first element is the bottom, last is top */
				_.layers.add(this,args && args.prepend ? args.prepend : false);	
				this.layer.above = this.layer.next = this.next;
				this.layer.below = this.layer.prev = this.prev;							
			},
			
			close : function(){ // what happens when someone closes a modal window
				if(this.layer.below){
					this.show_below();
					this.hide();
				}
			},
			
			ele_setup : function(ele){
				if(!ele){
					if(this.ele){
						ele = this.ele;
					}else{
						return false;
					}
				}				

				ele.setAttribute(this._attr, this.uuid);
				
				if(!$(ele).hasClass(this._class)){
					$(ele).addClass(this._class);
				}
				
				this.ele = ele;
				
				return this.ele;
				
			},
			
			del : function(args){
				var timeline = (args ? args.timeline : false) || this.timeline || false;
				
				if(!timeline){
					return false;
				}
			},
			
			getAbove : function(){
				return (this.above || this.getNext());
			},
			
			getBelow : function(){
				return (this.below || this.getPrev());					
			},
			
			getPrev : function(){
				return this.prev;
			},
			
			getNext : function(){
				return this.next;
			},
			
			// pretty self-explanatory - options is equivalent to $.hide(options)
			hide : function(ele,options){
				if(!ele){
					if(this.ele){
						ele = this.ele;
					}else{
						return false;
					}
				}
				
				options = options || _.args.animate;
				
				$(ele).hide(options);
			},
			
			// may be confusing - hide_above goes through all the layers this is above and hides them
			hide_above : function(wl){
				wl = wl || this;
				
				while(wl && wl.above && wl.above.hide){
					wl.above.hide();
					wl = wl.above;
				}
			},
			
			// may be confusing - hide_below goes through all the layers this is below and hides them
			hide_below : function(wl){
				wl = wl || this;
				
				while(wl && wl.layer.below && wl.layer.below.hide){
					_.log(this._id + '[hide][below][*]',wl,wl.layer.below);
					wl.layer.below.hide();
					wl = wl.layer.below;
				}
			},
			
			hide_others : function(wl){
				return this.hide_below(wl) && this.hide_above(wl) && this.show();
			},
			
			init : function(args){
				this.register();
				
				this.data = this.uuid;
				
//				_.log('*'+this._id+'[init]',args,this.above);
				
				
				if(args && args.above && args.above instanceof _._[this._id]){
					this.prev = this.layer.prev = args.above;
					this.layer.prev.layer.next = this;
				}
				
				if(args && args.below && args.below instanceof _._[this._id]){
					this.next = this.layer.next = args.below;
					this.layer.next.layer.prev = this;
				}
				
				var slug = (args ? args.slug : false),
					ele = (args && args.ele ? args.ele : false),
					set = (args && args.set);
					
				var ret = wrapper = false;
				
				if(this.ele){
					this.ele_setup();
				}
				
				if(!this.layer.first){
					this.layer.first = this;
				}
				
				if(!this.layer.last){
					this.layer.last = this;
				}
				
				/* ~EN: add element to end of list. like photoshop, the first element is the bottom, last is top */
				if(!this.quiet){
					this.add({ prepend : args && args.prepend ? args.prepend : false});
					this.open();
				}
			},
			
			insert : function(args){ // insert data to a layer
				if(!args){
					return false;
				}
				
				var page = (_.is.Page(args) ? args : false) || args.page || false;
				
				_.log(this._id + '[insert]',this.ele,page.ele);
				
				if(this.ele && page){
					if(page.wrapper){
						if(page.wrapper.parentnode != this.ele){
							this.ele.appendChild(page.wrapper);
						}
					}else if(page.ele && this.ele && (page.ele.parentNode != this.ele)){
						this.ele.appendChild(page.ele);
					}
				}
			},
			
			// checks if ele or css class or id is window layer
			is : function(ele){
				if(!ele){
					return false;
				}
				
				var ret = false;
				
				if(_.is.string(ele) || _.is.jquery(ele)){
					if(_.is.jquery(ele) || ele.charAt(0) == '.' || ele.charAt(0) == '#'){
						return (ret = this.is($(ele).get(0)));
					}else{
						return false;
					}
				}else{
					return (ret = ele.hasAttribute(this._attr));
				}
				
				return ret;
			},
			
			make_above : function(wl){ // will make this window layer above another window layer
				if(!wl && this.layer.prev){
					wl = this.layer.prev;
				}
				
				if(!(this.ele && wl && wl.ele)){
					return false;
				}

				
				var z = parseInt($(wl.ele).css('z-index'));
				this.z = z+10;
			
				$(this.ele).css({
					'z-index'	: this.z
				});
					
				wl.below = this;
				this.layer.prev = wl;
				
				return true;
			},
			
			make_first : function(){
				// basic linked list, goto this.layer.first and navigate through list resetting pointers
				var first = this.layer.first;
				var node = first;
				
				//old above is the current below's above
				if(this.layer.next && this.layer.prev){
					this.layer.next = this.layer.prev;
				}
				
				//old first is below this layer
				this.make_above(first);
				
				while(node && node.above && node.above.layer){
					node.layer.first = this;
					node = node.above;
				}
				
				this.layer.first = this;
			},
			
			make_last : function(){
				// basic linked list, goto this.layer.first and navigate through list resetting pointers
				var last = this.layer.last;
				var node = last;
				
				//old above is the current below's above
				if(this.layer.prev && this.layer.next){
					this.layer.prev = this.layer.next;
				}
				
				//old first is below this layer
				this.make_below(last);
				
				while(node && node.below && node.below.layer){
					node.layer.last = this;
					node = node.below;
				}
				
				this.layer.last = this;
			},
			
			make_below : function(wl){ // will make this window layer below another window layer
				if(!wl && this.layer.next){
					wl = this.layer.next;
				}

				if(!(this.ele && wl && wl.ele)){
					return false;
				}
				
			
				var z = parseInt($(wl.ele).css('z-index'));
			
				if( z - 10 < 0){
					z = 0;
				}else{
					z -= 10;
				}
				
				this.z = z;
			
				$(this.ele).css({
					'z-index'	: this.z
				});
				
				wl.above = this;
				this.layer.next = wl;
				
				return true;

			},
			
			open : function(){ // opens a modal window
				if(this.layer.below){
					this.hide_below();
					this.show();
				}				
			},
						
			show : function(ele,options){
				if(!ele){
					if(this.ele){
						ele = this.ele;
					}else{
						return false;
					}
				}
				
				options = options || _.args.animate;
								
				$(ele).show(options);
			},
			
			// may be confusing - show_above goes through all the layers this is above and shows them
			show_above : function(wl){
				wl = wl || this;
				
				while(wl && wl.above && wl.above.show){
					wl.above.show();
					wl = wl.above;
				}
			},
			
			// may be confusing - show_below goes through all the layers this is below and shows them
			show_below : function(wl){
				wl = wl || this;
				
				while(wl && wl.layer.below && wl.layer.below.show){
					wl.layer.below.show();
					wl = wl.layer.below;
				}
			},
			
			show_others : function(wl){
				return this.show_below(wl) && this.show_above(wl);
			}
		}
	});

	_.layers = new _._.LinkedList();
	
})(_);
