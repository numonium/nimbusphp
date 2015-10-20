if(_ && _.noConflict){ // previously-defined by underscore
	var __ = _.noConflict();
}else if(_){
	var __ = _;
}else{
	var _ = {};
}

_ = {
	_ : { // system/root-level prototype info 
		add : function(args){
			if(!args || !args._class || !args.constructor || !_._.class_setup(args._class)){
				_.log('_[_][load][block] :(',args._class._);
				return false;
			}
			
			var base = args.base || _._,
				parents = args._class.parents || args.parents || false,
				_class = args._class || false;
				
//			_.log('_[_][load][add]',args._class._);
			
			if(base[_class._]){ // already exists
				_.log('!!! class exists',base[_class._],args);
				return false;
			}
			
			// set constructor
			base[_class._] = args.constructor;	// equivalent to _._.ClassName = function(){...};
			
			
			if(parents && parents.length && base[parents[0]]){ // extend parent prototype to subclass, merge if multiple -> will call parent constructor
				
				/* ~EN: interesting note -
					- if we copy over the prototype before instantiating a new object, the superclass constructor will be called with null arguments (since they're not known at this time)
						* base[_class._].prototype = new base[parents[0]];
					- but if we copy over a function that links the prototype (below), then we'll have to manually call each parent constructor later
					-> because we're declaring class defs at the beginning of each class, we can pass them through and automatically know which parent constructors to call (chained)
					
					...and go! :) */

				base[_class._].prototype = (function(parent, child){
				
					parentConstruct = {};
				
				    function protoCreator(){
				        this.constructor = child.prototype.constructor; // set current constructor -> we can never trust js to do this properly
				        this.__super = parent.prototype; // make reference to super-class in case we overload/overwrite methods
				        this.__class = _class; // regular reference to class
				    };
				    
				    protoCreator.prototype = parent.prototype;
				    
				    return new protoCreator();
				    
				})(base[parents[0]], base[_class._]);
				
			}
			
			if(args.proto){ // copy over passed prototype
				for(var i in args.proto){
					if(args.proto.hasOwnProperty(i)){
						base[_class._].prototype[i] = args.proto[i];
					}
				}
			}
			
			if(!base[_class._].__class){ // copy over class definition
				base[_class._].__class = _class;
			}
			
		},
		class_setup : function(_class,base){
			if(!_class){
				return false;
			}
			
			base = base || _._;
			
			var parents = _class.parents || _class;
			
			if(!parents || !parents.length){ //no parents -> valid
				return true;
			}
			
			for(var i in parents){
				if(parents.hasOwnProperty(i)){				
					if(!base[parents[i]]){
						return false;
					}
				}
			}
			
			return true;
		},
		ele : function(ele){ // resolve element from string or jQuery
			if(!ele){
				return false;
			}
			
			var ret = false;
			
			(function($){
			
				if(_.is.string(ele) || _.is.jquery(ele)){
					if(_.is.jquery(ele) || ele.charAt(0) == '.' || ele.charAt(0) == '#'){
						return (ret = $(ele).get(0));
					}else{
						return false;
					}
				}else{
					return (ret = ele);
				}
				
			})(jQuery);
			
			return ret;
			
		},
		err : function(){
			if(window.console){
				window.console.error( Array.prototype.slice.call(arguments) );
			}
		},
/*		extend : function(parent, child){ // class child extends parent
			if(!child || !parent){
				return false;
			}
			child.prototype = Object.create(parent.prototype);
			child.prototype.constructor = child;
			child.prototype.parent = parent.prototype;
			
			return child;
		},*
		extend : function(parent, child){
			var sub = function(){};	
//			sub.prototype = parent.prototype;			
			sub.prototype.__parent__ = parent.prototype;
			
			
			var proto = new sub();
			proto.constructor = child;
			
			child.prototype = proto;
			
			return child;
		}, */
		extend : function(parent,child){
			return (new _._._()).extend(parent,child);	
		},
		file : {
			upload : {
				text : false
			}
		},
		ready : false, // reset by jQuery(document).ready()
		parentConstruct : function(obj,args,_class,base){
			args = args || {};
			
			base = base || _._;

//			_.log('_[parent-construct][init]',arguments,obj,'@@@',args,obj.__parentConstruct,(obj.__parentConstruct ? obj.__parentConstruct.length : -1),(!obj || !obj.__parentConstruct || (obj.__parentConstruct.length == 0)));
//			_.log('_[parent-construct][init]',obj,args,_class);
			
			if(!obj || !args || !_class){
				return false;
			}
			
			if(_class && _class.parents){
				for(var i in _class.parents){
					if(_class.parents.hasOwnProperty(i) && base[_class.parents[i]]){
						base[_class.parents[i]].apply(obj,args);
					}
				}
				
				return true;
			}
			
			return true;
/*			
			if(!obj || !obj.__parentConstruct || (obj.__parentConstruct.length == 0)){
				return false;
			}
			
			// to prevent these classes from infinitely constructing, we need to introduce a global var (_._.__noInit)			
			if(_._.__noInit === true){ // fine, don't do anything!
				return true;
			}
			
			_._.__noInit = true;
			
			for(var i in obj.__parentConstruct){
				if(obj.__parentConstruct.hasOwnProperty(i) && (typeof obj.__parentConstruct[i] == 'function')){
					_.log('_[parent-construct][loop]',i,obj,args);
					obj.__parentConstruct[i].apply(obj,args);
				}
			}
			
			_._.__noInit = false;
			
			return true;*/
		}
	},
	admin : {
		_ : false
	},
	debounce : function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	find : function(args){
		var ret = false;
		(function($){
			if(typeof args === 'object'){
				var str  = '';
				if(!args.tag){
					args.tag='*';
				}
				str += args.tag;
				
				if(args.attrs){
					for(var i in args.attrs){
						str += '[';
						if((typeof args.attrs[i] === 'object') && args.attrs[i].nodeName){
							str += args.attrs[i].nodeName + '="' + args.attrs[i].nodeValue;
						}else{
							str += i + '="' + args.attrs[i];
						}
						str += '"]';
					}
				}
				
				_.log('*[find][str]',str,args);
				ret = $(str); 
			}
			
		})(jQuery);
		
		return ret || false;
	},
	format : {
		time : function(s,format){
//		  var hr  = Math.floor(s / 3600);
//		  var min = Math.floor((s - (hr * 3600))/60);
//		  var sec = Math.floor(s - (hr * 3600) -  (min * 60));
			var hr = 0;
			var min = Math.floor(Math.round(s)/60);
			var sec = Math.round(s) % 60;
		
		  if (min < 10){ 
		    min = "0" + min; 
		  }
		  if (sec < 10){ 
		    sec  = "0" + sec;
		  }
		
		  return { h : hr, m : min, s : sec };
		}	
	},
	has : {
		localStorage : function(){
			try{
				return 'localStorage' in window && window['localStorage'] !== null;
			}catch (e){
				return false;
			}
			
			return false;
		}	
	},
	is : {
		array : function(n){
			return (Object.prototype.toString.call(n) === '[object Array]');
		},
		decimal : function(n){
			return (!isNaN(n) && n.toString().indexOf('.') != -1);
		},
		defined : function(n){
			return (typeof n !== 'undefined');
		},
		_float : function(n){
			return _.is.decimal(n);
		},
		integer : function(n){
			return (typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n));
		},
		_int : function(n){
			return _.is.integer(n);
		},
		jQuery : function(n){
			return (jQuery && (n instanceof jQuery));
		},
		jquery : function(n){
			return _.is.jQuery(n);
		},
		layer : function(n){
			return _.is.Layer(n);
		},
		Layer : function(n){
			if(!n){
				return false;
			}
			
			var ele = _._.ele(n);
			if(!ele){
				return false;
			}
			
			return (ele.hasAttribute('data-layer'));
		},
		modal : function(n){
			return _.is.Modal(n);
		},
		Modal : function(n){ // remember - you can pass either a Modal object or Page object, with Page.layer set to a Modal
			if(!n){
				return false;
			}
			
			return (
				(n instanceof _._.Modal) ||
				(_.is.Page(n) && n.layer && n.layer instanceof _._.Modal)
			);

		},
		object : function(n){
			return (typeof n === 'object' && !_.is.array(n));
		},
		page : function(p){
			return _.is.Page(p);
		},
		Page : function(p){
			return (p && p instanceof _._.Page);
		},
		ready : function(doc){ // is document ready?
			doc = doc || document;
			
			return (doc && doc.readyState && (doc.readyState == 'complete'));		
		},
		string : function(n){
			return (typeof n === 'string');
		},
		str : function(n){
			return _.is.string(n);
		},
		windowLayer : function(n){
			return _.is.WindowLayer(n);
		},
		WindowLayer : function(n){
			if(!n){
				return false;
			}
			
			var ele = _._.ele(n);
			if(!ele){
				return false;
			}
			
			return (ele.hasAttribute('data-window-layer'));
/*			
			for(var i in _.layers){
				if(_.layers.hasOwnProperty(i)){
					
				}
			}*/
		}
	},
	log : function(){
		if(window.console){
			window.console.log( Array.prototype.slice.call(arguments) );
		}
	},
	mod : {
		
	},
	preload : function(ary){
		(function($){
		    $(ary).each(function(){
		        $('<img/>')[0].src = this;
		        // Alternatively you could use:
		        // (new Image()).src = this;
		    });
		})(jQuery);
	},
	routers : {},
	title : function(title){
		if(!_.tmp.title){
			_.tmp.title = {
				_ : document.title
			};
		}
		
		if(!title){
			document.title = _.tmp.title._;
		}else{					
			document.title = title;
		}
		
		return true;
	},
	tmp : {
		
	}
};

if(jQuery){
	
	(function($){
		
		// set up internal ready marker -> TODO abstract beyond jquery
		$(document).ready(function(){
			_._.ready = true;
			
			$('html').removeClass('_-no--js').attr('data-_-js',1);
		});
		
	})(jQuery);
	
	(function (original) {
	  jQuery.fn.clone = function () {
	    var result           = original.apply(this, arguments),
	        my_textareas     = this.find('textarea').add(this.filter('textarea')),
	        result_textareas = result.find('textarea').add(result.filter('textarea')),
	        my_selects       = this.find('select').add(this.filter('select')),
	        result_selects   = result.find('select').add(result.filter('select'));
	
	    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
	    for (var i = 0, l = my_selects.length;   i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;
	
	    return result;
	  };
	}) (jQuery.fn.clone);
	
}

Object.count = Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};