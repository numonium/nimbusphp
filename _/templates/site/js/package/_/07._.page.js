(function(_, $){

	var __class = {
		_ : 'Page',
		parents : ['LinkedListNode']
	};

	_._.add({
		_class : __class,
		constructor : function(args){
		
			_._.parentConstruct(this,arguments,__class);
		
			var _t = this; //for scope reasons
			this._id = __class._;
			this._cmd = 'page';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add
		
			this.url = '';
				
			this.current = false; // index of current pages (in this.pages)
			this.slug = false;
			this.modal = false; // modal object
			this.timeline = []; // timeline of pages
			this.timeline_ele = false;
			this.timeline_step = 100;
			this.timeline_units = '%';
			
//			this.modals = this.pages = [];
			
			this.html = '';
			
			this.layer = (args && args.layer ? args.layer : null); // windowlayer pointer
			this.pageGroup = (args ? args.pageGroup || args.pagegroup || args.PageGroup || args.pg : false);			

			this.ele = false;
			this.wrapper = false;
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
//			this.init(args);
			_._[__class._].prototype.init.call(this,args);
			
		},
		proto : {
			
			init : function(args){
				this.register();
				
				this.data = this.uuid;
				
				var _t = this;
				
				var slug = (args ? args.slug : false),
					ele = (args && args.ele ? args.ele : false),
					set = (args && args.set);
					
				var ret = wrapper = false;
					
				_.log('@'+this._id + '[init]',args,slug,ele,_._.ready);
				
				if(_._.ready){
					ret = this.ready({
						slug : slug,
						ele : ele,
						set : set
					});
				}else{
					$(document).ready(function(){
						ret = _t.ready({
							slug : slug,
							ele : ele,
							set : set
						});
					});
				}
				
				return ret;
			},
			
			is : function(slug){
				return (this.slug == slug.toLowerCase());			
			},
			
			/* this should really just point the router in the right direction, but not make any real changes until hashchange
			go : function(page){		
				if(_.is._int(page)){
					if(this.pages[page]){
						slug = this.pages[page];
					}else if(this.modals[page]){
						slug = this.modals[page];
					}
				}else{
					if((slug = this.timeline.indexOf(page)) >= 0){
						slug = this.pages[slug];
					}else{
						slug = page;
					}
				}
						
				_.log('page[go]',this._id,slug,page);
				
				return _.router.go({
					cmd : this._cmd,
					type : this._id,
					str : slug,
					obj : this
				});
				
			}, */
			
			/*	checks to see if page is already downloaded
				(no - downloads page via ajax),
				then sets pointers to page */
			load : function(url, callback){ // will ajax load url

				_.log('page[load][?]',url);
				
		/*		if(url){
					if(url!='/' && (url.charAt(url.length-1)=='/')){
						url = url.substring(0,url.length-1);
					}else if(url == '/'){
						url = 'player';
					}
				}*/
				
				var page = $('._-page[data-page="' + url + '"]');
				
				if(page.length){
	
					return this.next_success(url,page,{add : false});
					
	//				$('._-page._-page--current').css('transform','rotateY(' + (_.tmp.deg - 180) + 'deg)').removeClass('_-page--current');
	//				$('._-page._-page--current').css('transform','rotateY(' + (_.tmp.deg) + 'deg)').removeClass('_-page--current');
	
					$('._-page._-page--current').removeClass('_-page--current');
	
	//				$(page).addClass('_-page--loaded _-page--current').css('transform','rotateY(' + _.tmp.deg + 'deg)');
	//				$(page).addClass('_-page--loaded _-page--current').css('transform','rotateY(' + (_.tmp.deg - 180) - 'deg)');
					
	/*				if($(page).hasClass('_-page--front')){
						$('._-wrapper--page').removeClass('flipped');
					}else{
						$('._-wrapper--page').addClass('flipped');					
					}*/
					
					$(page).addClass('_-page--loaded _-page--current');
				
				}else if(callback){
					$.ajax({
						url : url,
						success : callback
					});
				}else{
					$.ajax({
						url : url,
						success: function(data){
							_.log('page[load][succcess]',data);
							_t.next_success(url,data,{add : true});
						},				
	/*					success : function(data,textStatus,jqXHR){
							_.log('page[load][succcess]',data);
							var $data = $('<div class="_-ajax _-ajax--loading"></div>').append(data);
							$data = $($data).find('._-page');
							
							$data.removeClass('_-page--front').addClass('_-page--back');
							
							_.log('page[load][data]',$data);
							
			//				$data.addClass('_-loading');
							$('._-page._-page--current').removeClass('_-page--current');				
							
							$('._-wrapper--page').append($data);
							
	//						$('._-wrapper--page').toggleClass('flipped');
							if(_.tmp.ajax_ele){
								_.tmp.ajax_ele.addClass('_-page--loaded _-page--current');
								_.tmp.ajax_ele = null;
							}
	
							_.page.resize(window);
	
						}*/
					});
				}
				
				return true;
			},
			
	/*		modal : function(args){
				var ele = args.ele || false;
				var _cfg = {
					classes : {
						_ : '_-modal',
						bg : '_-modal--bg',
						wrapper : '_-modal--wrapper',
						content : '_-modal--content'
					},
					tags : {
						_ : 'div'
					}
				};
							
				var html = {};
				
			
				for(var i in _cfg.classes){ // convert html strings into html objects
					if(_cfg.classes.hasOwnProperty(i)){
						html[i] = document.createElement(_cfg.tags._);
						html[i].className = _cfg.classes[i];
					}
				}
				
				_.log(this._id + '[modal]',args,html);
				
			},
			
			*/
			
			// ~EN: i'd like to make this next(), but this.next is a reference to the next page in a linked list
			nextPage : function(){
				return (this.current < this.pages.length-1 ? this.go(this.current + 1) : false);
			},
			
			prevPage : function(){
				return (this.current > 0 ? this.go(this.current - 1) : false);
			},
			
			// what to fire on document.ready
			ready : function(args){
				var ele = args.ele || false,
					slug = args.slug || false,
					set = args.set || false,
					ret = wrapper = false;
					
				var wrapper_class = '_-page--wrapper';
				var wrapper_sel = '.'+wrapper_class;
					
				_.log('@'+this._id + '[ready]',slug,ele);
					
				if(ele){
					if($(ele).hasClass(wrapper_class)){
						wrapper = ele;
					}else if(!(wrapper = $(ele).parents(wrapper_sel).get(0))){
						return false;
					}
				}else{
					if(!(wrapper = $(wrapper_sel).get(0))){
						return false;
					}
	
					_.log('page[?]',slug,$(wrapper).find('._-page'),$(wrapper).find('._-page').filter(slug ? '[data-page="' + slug + '"]' : '*'));
					if(!(ele = $(wrapper).find('._-page').filter(slug ? '[data-page="' + slug + '"]' : '*').get(0))){
						return false;
					}
				}
				
				if(!slug){
					slug = $(ele).attr('data-page');
				}
				
				this.wrapper = wrapper;
				this.ele = ele;
				this.slug = slug;
/*				this.current = this.pages.indexOf(slug);
				this.timeline_ele = $(this.wrapper).parents('._-timeline').get(0);
				this.timeline.push(this.current);*/
	
				_.pages[slug] = this;
				_.log('page[init]',this.slug,this.ele,this);
				
				if(set){
					_.log('@page[set]',this,_.page);
					_.page = this;
				}
				
			},
			
			register : function(args){
				this.uuid = _.str.uniqid(this._cmd + '--');				
				_.log('router[register]['+this._id+']['+this.uuid+']',args,this);
				_.routers[this._cmd] = this;		
			},
			
			/* ~EN:
			
			resize : -> moved to _.Window	*/
						
			route : function(e,args){		
				var sep = _.router.sep || '/';
				var url = args._url || window.location.pathname.substring(1).split(sep),
					hash = args._hash || window.location.hash.substring(2).split(sep); // ~EN: hash[0] = '#'; hash[1] = '/';
					
				var _url = url.join(sep),
					_hash = hash.join(sep),
					cmd = 'load';
					
				if(!_hash || !cmd){
					_.log('page[route][empty]',_hash);
					
					return false;
				}
				
				_.log('page[route]['+cmd+']',_hash);
				
				if(cmd == 'load'){
					return this.load(_hash);
		//			return this.go(_hash);
				}
				
			}
			
		}
	});
	
	/* } page libs */
	
	_.pages = {};
	_.page = new _._.Page();

})(_,jQuery);