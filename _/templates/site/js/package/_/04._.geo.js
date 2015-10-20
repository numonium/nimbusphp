(function(_){

	var __class = {
		_ : 'Geo',
		parents : ['_']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){
			
			_._.parentConstruct(this,arguments,__class);
			
			var _t = this;
			this._id = 'Geo';
			this._cmd = 'geo';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			
			// references to other layers (abstracting linked-list behavior) - the top-most layer is the last element, bottom layer is first (a la photoshop)
			
			this.id = this.z = 0; // this.z corresponds to the element's z-index

			this.name = '';
			this.slug = '';
			this.shown = false;
			this.type = 'window'; // can also be modal
			this.html = this.content = this.ele = false;
			
			this.key = 'AIzaSyCl3BwYhdAEtuCp8JVInl-hUf2SVTwq3u0';
			
//			this.ele = this.ele || (args && args.ele ? args.ele : false) || document.createElement('div');			
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
			
			init : function(args){
				this.register();
			},
			
			lookup : function(args,callback){
				var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + this.key;
				
				for(var i in args){
					if(args.hasOwnProperty(i)){
						url += '&' + i + '=' + encodeURIComponent(args[i])
					}
				}
				
				return $.getJSON(url,callback);
			},
			
			nearby : function(args,callback){
				if(!args){
					return false;
				}
				
				var type = args.type,
					loc = args.loc;
					
				var params = {};
				
				if(loc){
					args.location = loc.lat + ',' + loc.lng;
				}
				delete args.loc;
									
				if(_.is.array(type)){
					args.types = type = type.join('|');
				}else{
					args.types = type;
				}
				
				delete args.type;
					
				var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?1';
				
				args.key = this.key;
				
				for(var i in args){
					if(args.hasOwnProperty(i)){
						url += '&' + i + '=' + encodeURIComponent(args[i])
					}
				}
				
				return $.ajax({
					dataType : 'json',
					url : url,
					data : args,
					type : 'GET',
					crossDomain : true,
					success : function(data){
						_.log('@@@',data)
						callback(data);
					}
				});
				
//				return $.getJSON(url,callback);
			}
			
		}
	});

	_.geo = new _._.Geo();
	
})(_);
