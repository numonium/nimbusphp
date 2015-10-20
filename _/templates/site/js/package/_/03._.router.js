(function(_, $){

	var __class = {
		_ : 'Router',
		parents : ['_']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){	

			_._.parentConstruct(this,arguments,__class);
			
			var _t = this;
			this._id = __class._;
			this._cmd = 'router';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			this.uuid = '';
			
			this.url = '';
			this.sep = '/';
			
			this.current = {
				cmd : '',
				args : {}
			};
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,null);
			
		},
		proto : {
			
		/*	if(!_.routers || !_.routers.length){
				_.log('router[init] - no routers :(');
				return false;
			} */
			
			go : function(args){ // this function will build a hash query and change window.location.hash, triggering this.route()
				_.log(this._id+'[go]',args);
				
				var url = ['#'], cmd = cmd_args = str = '';
				
				if(args.cmd){
					cmd = args.cmd;
					url.push(args.cmd);
				}
				
				if(args.str){
					cmd_args = args.str;
					url.push(_.is.array(args.str) ? args.str.join(this.sep) : args.str);
				}
				
				if(!args.force && (this.current.cmd == cmd && this.current.args == cmd_args)){ // only accept commands differently than what was last run
					_.log('block - '+this._id+'[go][same-cmd]',cmd,cmd_args,url,str);
					return false;
				}
				
				this.current.cmd = cmd;
				this.current.args = cmd_args;
				
				if(url.length){
					str += url.join(this.sep);
				}
				
				_.log(this._id+'[go][->]',url,str);
				
				if(str != ''){
					window.location.hash = str;
				}
			},
			
			init : function(){
				if(!jQuery){
					_.log('router[init] - no jquery :(');
					return false;
				}
				
				$(window).on({
					hashchange : this.route,
					load : this.route
				});
		
				_.log('router[init]',_.routers);
				
			},
			
			// static method fired from hashchange event, so this won't work
			route : function(e){		
				var url = window.location.pathname.substring(1).split('/'),
					hash = window.location.hash.substring(2).split('/'); // ~EN: hash[0] = '#'; hash[1] = '/';
					
				if(!hash[0]){
					_.log('err[router][route][no-hash]',url,hash);
					return false;
				}
								
				var sub = hash.shift();
				
				if(_.routers[sub] && _.routers[sub].route){
					_.log('>> router[route]['+sub+']['+hash[0]+']',_.routers[sub]);
					return _.routers[sub].route(e,{ hash : hash.join('/'), _hash : hash });
				}
		
				_.log('router[route][default]',e.currentTarget,url,sub,hash);
			}
		}
	});
	
	_.router = new _._.Router();
	_.routers = _.routers || {};
	
})(_,jQuery);