// # (0 / 25) 0._.js {

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
			return _.super.extend(parent,child);	
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
	
}

Object.count = Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};				
				// } 0._.js # (0 / 25) 

			
				// # (1 / 25) 00.fn.js {

/* nimbus/lib/js - core javascript functions/libraries required for framework
	nimbus (c) 2009+ numonium //c - all rights reserved */

function hide(id){
	var ele;
	if(typeof id === 'string'){
		if(document.getElementById(id))
			ele=document.getElementById(id);
//	alert("id: "+ele.id);
	}else if(id){ //passed an element
		ele=id;
	}
	if(ele)
		ele.style.display="none";
}

function show(id){
	var ele;
	if(typeof id === 'string'){
		if(document.getElementById(id))
			ele=document.getElementById(id);
	}else if(id){ //passed an element
		ele=id;
	}
	
	if(ele)
		ele.style.display="block";
}

function invisible(id){
	if(document.getElementById(id))
		document.getElementById(id).style.visibility="hidden";
}

function visible(id){
	if(document.getElementById(id))
		document.getElementById(id).style.visibility="visible";
}

function link(loc){
	window.location.href=loc;
}

function clearField(ele){
	if(ele.value)
		ele.value='';
}

function getSelectIndex(ele,val){
	//gets index from HTML select by its value. returns first finding
	for(var i=0; i<ele.length; i++){
		if(ele.options[i].value==val)
			return i;
	}
	return -1; //not found
}

function newOption(text,val){
	var newOpt=document.createElement("option");
	newOpt.text=text;
	newOpt.value=val;
	return newOpt;
}

function appendOption(select,newOpt){
	try{
		select.add(newOpt,null); //standards compliant; no IE :(
	}catch(ex){
		select.add(newOpt); //screw you, IE!
	}
}

function containsOption(options,obj,attr){
	if(!attr)
		attr="text";
	var i=options.length;
	while(i--){
		if(attr=="text" && options[i].text===obj){
			return true;
		}else if(attr=="value" && options[i].value===obj){
			return true;
		}
	}
	return false;
}

function getClickedLink(e){
	if(!e)
		var e=window.event;
//	alert(window.event);
	var targ=e.target || e.srcElement;
	if(targ.nodeType==3)
		targ=targ.parentNode;
	return targ;
}

function addBefore(new_node,sibling){
	sibling.parentNode.insertBefore(new_node,sibling);
}

function addAfter(new_node,sibling){
	sibling.parentNode.insertBefore(new_node,sibling.nextSibling);
}

function encodeLocation(loc){
	loc=loc.split(',');
	var rtn="";
	for(var i=loc.length-1; i>=0; i--){
//			alert(rtn+"\n"+loc[i]);
		if(loc[i]!=""){
			rtn+=urlencode(trim(loc[i]).toLowerCase())+(i>0 ? "|" : '');
		}
	}
	return rtn;
}

function changeTitle(newTitle){
	var title=document.title.toString().split(TITLE_SEP);
	
	if(newTitle)
		newTitle=[newTitle,title[title.length-2],title[title.length-1]];
	else
		newTitle=[title[title.length-2],title[title.length-1]];
	setTitle(newTitle.join(TITLE_SEP));
}

function setTitle(title,doc){
	if(!doc)
		doc=document;
	doc.title=title;
}

function getTitle(doc){
	if(!doc)
		doc=document;
	return doc.title;
}

function removeChildren(ele){
	while (ele.hasChildNodes()){
		ele.removeChild(ele.lastChild);
	}
}

function close(ele,time,callback){
	if(!callback){
		callback=function(){
			ele.close();
		}
	}
	
	//$time is given in seconds, will be *=1000 to get msec
	setTimeout(callback,time*1000);
}

//removes all null/empty elements from array
function trim_ary(ary,rekey){
	if(!rekey){
		var ret=ary;
		for(var i in ret){
			if(ret[i]=='' || !ret[i])
				ret.splice(i,1);
		}
	}else{ //rekeys the elements to be stored sequentially
		var ret=[];
		for(var i in ary){
			if(ary[i]!='' && ary[i]!==null && ary[i])
				ret.push(ary[i])
		}
	}
	
	return ret;
}

function dump(){
	var separator="\n";
	var str=implode(separator,toArray(arguments));
	alert(str);
}

function dumpAry(){
	var str="";
	for(arg in arguments){
		str+=arg+"\n";
		for(a in arg){
			str+="\t"+a+"\n";
		}
	}
	alert(str);
}

function var_dump() {
    // Dumps a string representation of variable to output  
    // 
    // version: 906.801
    // discuss at: http://phpjs.org/functions/var_dump
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: echo
    // *     example 1: var_dump(1);
    // *     returns 1: 'int(1)'

    var output = "", pad_char = " ", pad_val = 4, lgth = 0, i = 0, d = this.window.document;
    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if(!name) {
            return '(Anonymous)';
        }
        return name[1];
    }

    var repeat_char = function (len, pad_char) {
        var str = "";
        for(var i=0; i < len; i++) {
            str += pad_char;
        }
        return str;
    }
    var getScalarVal = function (val) {
        var ret = '';
        if (val === null) {
            ret = 'NULL';
        }
        else if (typeof val === 'boolean') {
            ret = 'bool('+val+')';
        }
        else if (typeof val === 'string') {
            ret = 'string('+val.length+') "'+val+'"';
        }
        else if (typeof val === 'number') {
            if (parseFloat(val) == parseInt(val, 10)) {
                ret = 'int('+val+')';
            }
            else {
                ret = 'float('+val+')';
            }
        }
        else if (val === undefined) {
            ret = 'UNDEFINED'; // Not PHP behavior, but neither is undefined as value
        }
        else if (typeof val === 'function') {
//            ret = 'FUNCTION'; // Not PHP behavior, but neither is function as value
			ret = val.toString();
        }
        return ret;
    }

    var formatArray = function (obj, cur_depth, pad_val, pad_char) {
        var someProp = '';
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = repeat_char(pad_val*(cur_depth-1), pad_char);
        var thick_pad = repeat_char(pad_val*(cur_depth+1), pad_char);
        var str = "";
        var val='';

        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && getFuncName(obj.constructor) === 'PHPJS_Resource') {
                return obj.var_dump();
            }
            lgth = 0;
            for (someProp in obj) {
                lgth++;
            }
            str += "array("+lgth+") {\n";
            for (var key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    str += thick_pad + "["+key+"] =>\n"+thick_pad+formatArray(obj[key], cur_depth+1, pad_val, pad_char);
                } else {
                    val = getScalarVal(obj[key]);
                    str += thick_pad + "["+key+"] =>\n"+thick_pad + val + "\n";
                }
            }
            str += base_pad + "}\n";
        } else {
            str = getScalarVal(obj);
        }
        return str;
    }

    output = formatArray(arguments[0], 0, pad_val, pad_char);
    for (i=1; i < arguments.length; i++) {
        output += '\n'+formatArray(arguments[i], 0, pad_val, pad_char);
    }
    
    /*~EN: Revised to return string rather than printing */
    return output;

/*    if (d.body) {
        this.echo(output);
    }
    else {
        try {
            d = XULDocument; // We're in XUL, so appending as plain text won't work
            this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">'+output+'</pre>');
        }
        catch(e) {
            this.echo(output); // Outputting as plain text may work in some plain XML
        }
    }*/
}

function implode(glue, pieces){
	return ((pieces instanceof Array) ? pieces.join(glue) : pieces);
}

function add_json(varName,data){
	return eval('('+data+')');
}

function toArray(args){
	return Array.prototype.slice.call(args);
}

function is_array(ary){
	return (typeof(ary)==='object' && ary!== null);
}

function is_object(o){
	return (typeof(o)==='object' && o!== null);
}

function is_int(num){
	return (typeof(num)=='number' && parseInt(num)==num);
}

function includeCSS(src){
	var d=document.createElement("link");
	d.setAttribute("rel","stylesheet");
	d.setAttribute("type","text/css");
	d.setAttribute("href",src);

	var e=document.getElementsByTagName("head")[0];
	if(!e)
		return;
	e.appendChild(d);
}

function isShowing(ele){
	return (ele && ((ele.style.display.toString()!="" && ele.style.display.toString()!="none") || (ele.style.visibility.toString()!="" && ele.style.visibility.toString()!="hidden")));
}

function includeJS(src){
	var d=document.createElement("script");
	d.setAttribute("type","text/javascript");
	d.setAttribute("src",src);

	var e=document.getElementsByTagName("head")[0];
	if(!e)
		return;
	e.appendChild(d);
	
/*	window.setTimeout(function(){
			e.setTimeout(d);
	},0);*/
}

function trim(s){
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}

function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
                             
    var histogram = {}, tmp_arr = [];
    var ret = (str+'').toString();
    
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };
    
    // The histogram is identical to the one in urldecode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
    
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);
    
    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret) // Custom replace. No regexing
    }
    
    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
    
    return ret;
}


function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
                             
    var histogram = {}, tmp_arr = [];
    var ret = (str+'').toString();
    
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    }
    
    // The histogram is identical to the one in urldecode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
    
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);
    
    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret) // Custom replace. No regexing
    }
    
    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
    
    return ret;
}

function getElementsByClassName(classname,node){
	if(!node)
		node=document.getElementsByTagName('body')[0];
	var a=[];
	var re=new RegExp('\\b'+classname+'\\b');
	var els=node.getElementsByTagName('*');
	var num=0;
	var classes="";
	for(var i=0,j=els.length; i<j; i++){
		if(els[i].className!='')
			classes+=els[i].className+"\n";
		if(re.test(els[i].className)){
			num++;
			a.push(els[i]);
		}
	}
	return a;
}

function addEvent(obj,event,handler){
	if(event=='ready'){
		addReadyEvent(obj,event,handler);
	}else{
		if(obj.addEventListener){
			obj.addEventListener(event,handler,false);
		}else if(obj.attachEvent){
			obj.attachEvent('on'+event,handler);
		}
	}
}

function urlL(){
	setInterval(function(){
		if(_url && (_url!=window.location.hash)){
			_e.fireEvent(null,this,'url_change',window.location.hash);
		}
	},100);
}
//urlL();

function _regE(){
	if(!_e){
		return false;
	}
	_e.addListener(this,'url_change',function(){
		var args=trim_ary(arguments,true);
		var l=(args.length>0 ? args[0] : window.location.hash);
		$_url=url(l);
		_url=l;
	});
}
//_regE();

function isSSL(l){
	if(!l)
		l=parent.location.protocol;
	return (l.indexOf("https://")!= -1);
}

function url(l){
	if(!l)
		l=window.location.hash;
	return trim_ary(l.toString().substr(1).split("/"),true);
}

//makes a URL
function makeURL(url){
	if(!url)
		url=$_url;
		
	return "#/"+url.join("/");
}

function sameURL(url,w){
	if(!w)
		w=window;
	if(url instanceof Array){
		url=makeURL(url);
	}
	return (w.location.hash==url);
}

//commits a URL to window.location
function toURL(url,w){
	if(!sameURL(url,w))
		toLoc(makeURL(url),w);
}

function toLoc(loc,w){
	if(!w)
		w=window;
	w.location=loc;
}

function hash(h){
	if(!h)
		return window.location.hash;
		
	window.location.hash=h;
}

function echo ( ) {
    // !No description available for echo. @php.js developers: Please update the function summary text file.
    // 
    // version: 906.401
    // discuss at: http://phpjs.org/functions/echo
    // +   original by: Philip Peterson
    // +   improved by: echo is bad
    // +   improved by: Nate
    // +    revised by: Der Simon (http://innerdom.sourceforge.net/)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Eugene Bulkin (http://doubleaw.com/)
    // +   input by: JB
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
    // %        note 1: we wouldn't need any such long code (even most of the code below). See
    // %        note 1: link below for a cross-browser implementation in JavaScript. HTML5 might
    // %        note 1: possibly support DOMParser, but that is not presently a standard.
    // %        note 2: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
    // %        note 2: use with a temporary holder before appending to the DOM (as is our last resort below),
    // %        note 2: since it may not work in an XML context
    // %        note 3: Using innerHTML to directly add to the BODY is very dangerous because it will
    // %        note 3: break all pre-existing references to HTMLElements.
    // *     example 1: echo('<div><p>abc</p><p>abc</p></div>');
    // *     returns 1: undefined
    var arg = '', argc = arguments.length, argv = arguments, i = 0;
    var win = this.window;
    var d = win.document;
    var ns_xhtml = 'http://www.w3.org/1999/xhtml';
    var ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'; // If we're in a XUL context

    var holder;

    var stringToDOM = function (str, parent, ns, container) {
        var extraNSs = '';
        if (ns === ns_xul) {
            extraNSs = ' xmlns:html="'+ns_xhtml+'"';
        }
        var stringContainer = '<'+container+' xmlns="'+ns+'"'+extraNSs+'>'+str+'</'+container+'>';
        if (win.DOMImplementationLS &&
            win.DOMImplementationLS.createLSInput &&
            win.DOMImplementationLS.createLSParser) { // Follows the DOM 3 Load and Save standard, but not
            // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
            // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
            // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
            var lsInput = DOMImplementationLS.createLSInput();
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            lsInput.stringData = stringContainer;
            var lsParser = DOMImplementationLS.createLSParser(1, null); // synchronous, no schema type
            return lsParser.parse(lsInput).firstChild;
        }
        else if (win.DOMParser) {
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            return new DOMParser().parseFromString(stringContainer, 'text/xml').documentElement.firstChild;
        }
        else if (win.ActiveXObject) { // We don't bother with a holder in Explorer as it doesn't support namespaces
            var d = new ActiveXObject('MSXML2.DOMDocument');
            d.loadXML(str);
            return d.documentElement;
        }
        /*else if (win.XMLHttpRequest) { // Supposed to work in older Safari
            var req = new win.XMLHttpRequest;
            req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
            if (req.overrideMimeType) {
                req.overrideMimeType('application/xml');
            }
            req.send(null);
            return req.responseXML;
        }*/
        else { // Document fragment did not work with innerHTML, so we create a temporary element holder
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
            if (d.createElementNS &&  // Browser supports the method
                d.documentElement.namespaceURI && (d.documentElement.namespaceURI !== null || // We can use if the document is using a namespace
                d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
                (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
            )) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
                holder = d.createElementNS(ns, container);
            }
            else {
                holder = d.createElement(container); // Document fragment did not work with innerHTML
            }
            holder.innerHTML = str;
            while (holder.firstChild) {
                parent.appendChild(holder.firstChild);
            }
            return false;
        }
        // throw 'Your browser does not support DOM parsing as required by echo()';
    }


    var ieFix = function (node) {
        if (node.nodeType === 1) {
            var newNode = d.createElement(node.nodeName);
            var i, len;
            if (node.attributes && node.attributes.length > 0) {
                for (i = 0, len = node.attributes.length; i < len; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    newNode.appendChild(ieFix(node.childNodes[i]));
                }
            }
            return newNode;
        }
        else {
            return d.createTextNode(node.nodeValue);
        }
    }

    for (i = 0; i < argc; i++ ) {
        arg = argv[i];
        if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.echo_embedded_vars']) {
            arg = arg.replace(/(.?)\{\$(.*?)\}/g, function (s, m1, m2) { 
                // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
                // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
                if (m1 !== '\\') {
                    return m1+eval(m2);
                }
                else {
                    return s;
                }
            });
        }
        if (d.appendChild) {
            if (d.body) {
                if (win.navigator.appName == 'Microsoft Internet Explorer') { // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
                    d.body.appendChild(ieFix(stringToDOM(arg)));
                }
                else {
                    var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div').cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
                    if (unappendedLeft) {
                        d.body.appendChild(unappendedLeft);
                    }
                }
            } else {
                d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description')); // We will not actually append the description tag (just using for providing XUL namespace by default)
            }
        } else if (d.write) {
            d.write(arg);
        }/* else { // This could recurse if we ever add print!
            print(arg);
        }*/
    }
}

/*function $(id){
	return document.getElementById(id);
}*/

function getIndex(needle,haystack){
	for(var i=0; i<haystack.length; i++){
		if(haystack[i]==needle)
			return i;
	}
	return -1;
}

function array_map(callback) {
    var argc = arguments.length, argv = arguments;
    var j = argv[1].length, i = 0, k = 1, m = 0;
    var tmp = [], tmp_ar = [];

    while (i < j) {
        while (k < argc){
            tmp[m++] = argv[k++][i];
        }

        m = 0;
        k = 1;

        if (callback){
            if (typeof callback === 'string') {
                callback = this.window[callback];
            }
            tmp_ar[i++] = callback.apply(null, tmp);
        } else {
            tmp_ar[i++] = tmp;
        }

        tmp = [];
    }

    return tmp_ar;
}

function in_array(needle, haystack, argStrict){
	//argStrict ~ strict comparison between elements
 
    var key = '', strict = !!argStrict;
 
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
 
    return false;
}

function defined(obj){
	return (typeof(obj)!="undefined" && obj!="undefined");
}

/*
//Array.contains() ? true : false
Array.prototype.contains=function(obj){
	var i=this.length;
	while(i--){
		if(this[i]===obj)
			return true;
	}
	return false;
} */				
				// } 00.fn.js # (1 / 25) 

			
				// # (2 / 25) 01._._.js {

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
				
				if(this instanceof _._.LinkedListNode && !this.data){
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
	
	_.super = new _._._();

})(_,jQuery);				
				// } 01._._.js # (2 / 25) 

			
				// # (3 / 25) 01.array.js {

(function(_){
	_.array = {
		count : function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		 
		    return size;
		},
		del : function(ary,val,key){
			if(!ary){
				return false;
			}
			
			for(var i in ary){
				if(ary.hasOwnProperty(i)){
					if(
						(key && (i == val)) ||
						(!key && (ary[i] == val))
					){
						ary.splice(i,1);
					}
				}
			}
			
			return ary;
		}
	};
})(_);				
				// } 01.array.js # (3 / 25) 

			
				// # (4 / 25) 01.base64.js {

/*
 * $Id: base64.js,v 2.12 2013/05/06 07:54:20 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *    http://opensource.org/licenses/mit-license
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

(function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.1.4";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        buffer = require('buffer').Buffer;
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer
        ? function (u) { return (new buffer(u)).toString('base64') } 
    : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe 
            ? _encode(u)
            : _encode(u).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer
        ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
})(this);				
				// } 01.base64.js # (4 / 25) 

			
				// # (5 / 25) 01.cfg.js {

(function($, _){


	_.cfg = {
		img : {
			preview : {
				width: 256,
				height: 456
			},
			upload : {
				width : 1920,
				height : 1080
			}
		},
		nav : {
			filter : {
				q : {
					min_length : 0
				}
			}
		},
		title : document.title,
		wysiwyg : {
			options : {
				autoresize : false,
				buttonsAdd : ['clips'],
				buttonsAdd_content : ['_save','_cancel','clips'],
				resize : false,
				imageUpload : '/admin/save?img',
				imageUploadCallback : function(obj, json){
					_.log('@ wysiwyg img[upload]',obj,json,this);
				},
				keyupCallback : function(obj, e){
					var doc = (obj.$frame ? _.frame.doc(obj.$frame[0]) : document);
					var sel = doc.getSelection();
					
					_.log('@ wysiwyg key '+_.get.key(e.keyCode),sel, sel.getRangeAt(0),e);	
					
					var ele = (sel.anchorNode.tagName ? sel.anchorNode : sel.anchorNode.parentNode);
					var tag = (sel.anchorNode.tagName ? sel.anchorNode.tagName : sel.anchorNode.parentNode.tagName);
					var previous_sibling = ele.previousElementSibling || ele.previousSibling;
					var sibling = ele.nextElementSibling || ele.nextSibling;
					
					_.page.title($(doc).find('h1').text());
					
					_.log('!!!',document.title);
				},
				keydownCallback : function(obj, e){
					
					var doc = (obj.$frame ? _.frame.doc(obj.$frame[0]) : document);
					var sel = doc.getSelection();
					
					var ele = (sel.anchorNode.tagName ? sel.anchorNode : sel.anchorNode.parentNode);
					var tag = (sel.anchorNode.tagName ? sel.anchorNode.tagName : sel.anchorNode.parentNode.tagName);
					var previous_sibling = ele.previousElementSibling || ele.previousSibling || false;
					var sibling = ele.nextElementSibling || ele.nextSibling;
					
					_.log('@ wysiwyg key '+_.get.key(e.keyCode),ele,sel.getRangeAt(0),e);
										
					switch(e.keyCode){
						case _.key.keys.backspace:						
							if(sel.anchorOffset == 0 && previous_sibling.tagName.toLowerCase() == 'h1'){
								_.log('@ wysiwyg block +');
								_.key._blocked = true;
							}
							
							break;
						
						case _.key.keys.del:
							if(sel.anchorOffset == sel.anchorNode.textContent.length && ele.tagName.toLowerCase() == 'h1'){
								var next_content = _.str.trim($(sibling).html());
								
								if(!_.array.isin(next_content,['','<br>','<br />'])){
									_.log('@ wysiwyg block +');
									_.key._blocked = true;
								}
							}
							
							break;
						
						case _.key.keys.enter:
							if(ele.tagName.toLowerCase() == 'h1'){
								_.log('@ wysiwyg block +');
								_.key._blocked = true;
							}
						

						break;
						
					}
					
				},
				plugins : ['clips']
			}
		}	
		
	};
	
})(jQuery,_);				
				// } 01.cfg.js # (5 / 25) 

			
				// # (6 / 25) 02._.api.js {

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
				// } 02._.api.js # (6 / 25) 

			
				// # (7 / 25) 02._.viewmodel.js {

(function(_, $, ko){

	var __class = {
		_ : 'ViewModel',
		parents : ['_']
	};

	_._.add({
		_class : __class,
		constructor : function(args){
		
			_._.parentConstruct(this,arguments,__class);
		
			var _t = this; //for scope reasons
			this._id = __class._;
			this._cmd = 'viewmodel';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add
			this.uuid = '';
			
			this.key = ''; // api key
			
			this.current = ko.observable({});
			this.view = ko.observable(''); // current view (template id)
			
			this.eles = {}; // list of ui elements

			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			_._[__class._].prototype.init.call(this,args);

		},
		proto : {
			init : function(args){
				this.register();
			},
			register : function(args){
				_._[__class.parents[0]].prototype.register.call(this);

				_.ViewModels = _.ViewModels || {};
				_.ViewModels[this.uuid] = this;
			}
		}
	});

	_._.api = {
		// place api CLASSES here	
	};
	
	_.api = {
		// place api OBJECTS here	
	};
	
})(_, jQuery, ko);				
				// } 02._.viewmodel.js # (7 / 25) 

			
				// # (8 / 25) 02.args.js {

(function(_){
	_.args = {
		ac : {
			appendTo : '',
			create : function(e,ui){
				_.log('input[ac][create]',e,ui);	
			},
			open : function(e,ui){
				var ele = e.target || e.currentTarget || e,
					ac = parent = false;
					
				(function($){
				
					if(!(ac = $(ele).autocomplete('widget').get(0))){
						return false;
					}
					
					parent = $(ele).parents('._-input--ac--wrapper').get(0);
					
					$(ac).css({
						width : 'auto',
						left :	$(parent).hasClass('_-blank') ? '20px' : '22.5%',
						right : '6px'
					});
					
				})(jQuery);
								
				_.log('input[ac][open]',e,$(ac).css('top'));
			},
			source : function( request, response ) {
				$.ajax({
					url: "/_",
					dataType: "json",
					data: {
						ac : _.tmp.actype,
						num : _.tmp.max,
/*								maxRows: 12,
						name_startsWith: request.term*/
					},
					success: function( data ) {
						
						response($.map(data,function(item){
							return {
								label : item.name,
								value : item.ticker
							};
						}));
						
/*								response( $.map( data.geonames, function( item ) {
						  return {
						    label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
						    value: item.name
						  }
						}));*/
					}
				});
			},
			minLength : 0,
			response: function(data, ui) {
				_.log('333',ui.content);
				_.log('444',arguments,data);
				/*
				response( $.map( data.geonames, function( item ) {
					return {
						label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
						value: item.name
					}
				}));*/
			},
			select : function(e,ui){
				e.preventDefault();
				
				var ele = e.target || e.currentTarget || e;
//						ele.value = ui.item.label;

				var itype = _.field.get_type(ele),
					clone = parent = false;
				
				(function($){
				
					parent = $(ele).parents('._-input--ac--wrapper').get(0);
					
					clone = $(parent).clone(true,false);
					
					_.log('input[ac][clone]',$(ele).parents('._-input--ac--wrapper'),e.target,ele,parent);
					
					$(parent).find('._-input--ticker--wrapper._-blank').removeClass('_-blank');
					$(parent).removeClass('_-blank').find('._-selected').removeClass('_-selected');
					$(ele).val(ui.item.label).siblings('._-input--ticker--ticker').find('._-text').html(ui.item.value);
					
					if(!$(parent).siblings('._-blank').length){
					
						$(clone).remove('.ui-autocomplete')/*.removeClass('_-selected')*/.find('._-input--ac').val('');
						
						var parent_z = $(parent).css('z-index'), clone_z = false;
						
						if(parent_z && (parent_z = parseInt(parent_z))){
							$(clone).css('z-index',parent_z-10);
						}
					
						var args_ac = _.args.ac;
						args_ac.appendTo = clone || 'body';
						
	//					$(clone).find('._-input--ac').autocomplete('destroy');
						$(clone).find('.ui-autocomplete').remove();
	
						$(clone).appendTo(parent.parentNode);
	//					$(clone).find('._-input--ac').autocomplete('option','appendTo',clone);
						$(clone).find('._-input--ac').autocomplete(args_ac).focus(function(e){
							$(this).autocomplete('search',$(this).val());
						}).focus();
						$(parent).find('._-input--ac').blur();
					}
					
				})(jQuery);
				
				_.log('!!select',ele,ui.item.label);
			}
		},
		animate : {
			duration : 500
		}
	};
})(_);				
				// } 02.args.js # (8 / 25) 

			
				// # (9 / 25) 02.e.js {

(function(_){
	_.e = {
		date : {
			close : function(selectedDate,ui){
				if(!ui || !ui.input)
					return false;
					
				var ele = ui.input, start = end = false;
				
				(function($){				

					// $( "#to" ).datepicker( "option", "minDate", selectedDate );
					if($(ele).hasClass('_-input--date--start')){
						start = ele[0];
						end = $(start).parents('._-input--date--group').find('input._-input--date--end').datepicker('option','minDate',selectedDate);
					}else{
						end = ele[0];
						start = $(end).parents('._-input--date--group').find('input._-input--date--start').datepicker('option','maxDate',selectedDate);
					}
					
				})(jQuery);
			},
			focus : function(e){
								
				var prefix = _.str.css._.prefix + _.str.css.input.prefix,
					sep = _.str.css._.sep,
					str_wrapper = _.str.css.wrapper,
					class_selected = _.str.css._.prefix + _.str.css.selected,
					ele = e.currentTarget || ele;
					
				var classes = ele.className.split(' '),
					itype = _.field.get_type(ele),
					class_parent = parent = false;
				
				if(!itype){
					return false;
				}
				
				class_parent = [prefix , itype, str_wrapper].join(sep);
								
				(function($){	
					if(parent = $(ele).parents('.'+class_parent).get(0)){
						$(parent).addClass(class_selected);
					}			
				})(jQuery);
			},
			blur : function(e){
								
				var prefix = _.str.css._.prefix + _.str.css.input.prefix,
					sep = _.str.css._.sep,
					str_wrapper = _.str.css.wrapper,
					class_selected = _.str.css._.prefix + _.str.css.selected,
					ele = e.currentTarget || ele;
					
				var classes = ele.className.split(' '),
					itype = _.field.get_type(ele),
					class_parent = parent = false;
				
				if(!itype){
					return false;
				}
				
				class_parent = [prefix , itype, str_wrapper].join(sep);
								
				(function($){	
					if(parent = $(ele).parents('.'+class_parent).get(0)){
						$(parent).removeClass(class_selected);
					}			
				})(jQuery);
			}
		},
		file : {
			cancel : function(e){
			
				var ele = e.currentTarget || e,
					text = input = parent = false;
					
				(function($){
					
					parent = $(ele).parents('._-input--file--wrapper').get(0);
					text = $(parent).removeClass('_-selected').find('._-input--file--upload ._-text');
					
					$(text).html(_._.file.upload.text ? _._.file.upload.text : 'Please Upload a File');
					
					if($(parent).parents('#_-step--form--tickers--q--file-wrapper--wrapper').length){
						$('#_-step--form--tickers--q--custom--tickers ._-input--ticker--wrapper').removeClass('_-disabled').find('input').prop('disabled',false);
					}
					
				})(jQuery);
			
			},
			select : function(e){ // ~EN: used for step 2 file selection
				var ele = e.currentTarget || ele,
					class_selected = '_-selected';
					parent = false;
					
				_.log('input[file][select]',ele);
					
				(function($){
					parent = $(ele).parents('._-input--file--select--wrapper').get(0);
					
					if(parent){
					
						if($(parent).hasClass(class_selected)){ // deselect
							$(ele).removeClass(class_selected).find('input[type="hidden"]').val('');
							$(parent).removeClass(class_selected);
						}else{
							$(ele).addClass(class_selected).find('input[type="hidden"]').val('1');
							$(parent).addClass(class_selected);
						}
						
					}
					
					
				})(jQuery);
			},
			update : function(e){ // ~EN: will be inside of input._-input--file (sibling to a._-inpout--file--upload)
			
				var ele = e.currentTarget || e,
					text = input = parent = val = false;
					
				(function($){
					
					parent = $(ele).parents('._-input--file--wrapper').get(0);
					text = $(parent).addClass('_-selected').find('._-input--file--upload ._-text');
					
					if(!_._.file.upload.text){
						_._.file.upload.text = $(text).html();
					}
					
					if(val = $(ele).val()){
						$(text).html(val);
						
						if($(parent).parents('#_-step--form--tickers--q--file-wrapper--wrapper').length){
							$('#_-step--form--tickers--q--custom--tickers ._-input--ticker--wrapper').addClass('_-disabled').find('input').prop('disabled',true);
						}
						
					}
					
				})(jQuery);
			
				_.log('input[file][update]',_._.file.upload.text,e);
			},
			upload : function(e){ // ~EN: will be inside of a._-input--file--upload
				
				var ele = e.currentTarget || e,
					input = false;
					
				if(!e.type){
					return false;
				}

				_.log('input[file][upload]',e.type,ele,$(ele).siblings('._-input--file').get(0));
					
				(function($){
					/* ~EN: needs to be sibling because child causes infinite event loop :( */
					input = $(ele).siblings('._-input--file').get(0);
					
					if(input && (input != ele)){
						$(input).click();
					}
				})(jQuery);
				
				e.stopPropagation();
				
				return (!input ? false : true);
			}
		},
		radio : {
			change : function(e){
				var ele = e.currentTarget || e;
				
				if(!ele || !ele.value){
					return false;
				}
				
				switch(ele.value){
					case 'all':
						(function($){
							$('#_-step--form--tickers--q--custom').hide();							
						})(jQuery);
						
						break;
					case 'custom':
						(function($){
							$('#_-step--form--tickers--q--custom').show();							
						})(jQuery);
						
						break;
				}
			}
		},
		str : 'blur change click contextmenu copy cut dblclick error focus focusin focusout keydown keypress keyup load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup mousewheel paste reset resize scroll select submit textinput unload wheel'

	};
	
})(_);				
				// } 02.e.js # (9 / 25) 

			
				// # (10 / 25) 02.field.js {

(function(_,$){

	_.field = {
		init : function(){
			$(document).ready(function(){
				
				$('._-form [data-_-ui-btn-select]').click(function(e){
					var attr = 'data-_-ui-btn-select';
					var ele = e.currentTarget || e;

					var wrapper = $(ele).parents('[data-_-ui-btn-wrapper]')[0],
						target = $(ele).attr(attr),
						value = $(ele).attr('value');
						
					var field = $(wrapper).find('._-input--hidden[name="' + target + '"]').val(value);
					
					$(wrapper).find('[' + attr + ']').removeClass('_-selected');
					$(ele).addClass('_-selected');
					
					_.log('field[btn][select]',target,$(wrapper).find('._-input--hidden[name="' + target + '"]'));
					
				});
				
				$('._-form [data-_-ui-field-auto]').each(function(i,ele){
					var attr = 'data-_-ui-field-auto';
					var actype = ele.getAttribute(attr),
						wrapper = $(ele).parents('[' + attr + '-wrapper]')[0];
					var target = $(wrapper).find('[' + attr + '-target]')[0];
					
					var f_select = function (event, ui) {
						var selectedObj = ui.item,
							loc = false;
							
							
						// ~EN (2015): strip off "united states" where applicable
						var city = ui.item.value.split(', ');
						
						if(city[city.length-1].toLowerCase().indexOf('united states')>=0){
							city.pop();
						}
						
						ui.item.value = city.join(', ');
							
						_.geo.lookup({address : ui.item.value}, function(data){
							var field = null;
							loc = data.results[0].geometry.location;
							
							if(field = $('._-form [name="dest[lat]"]').get(0)){
								field.value = loc.lat;
							}
							
							if(field = $('._-form [name="dest[lng]"]').get(0)){
								field.value = loc.lng;
							}
							
							_.log('field[autocomplete][select][*Geo][lookup]',ui.item,ui.item.value,loc);
							
							_.api.sfm.map._.recenter(loc);
							_.api.sfm.map._.nearby({
								loc : loc,
								type : 'airport',
								rankby : 'distance',
								radius : 50000,
								callback : function(results,status){
									
									$('._-input--field--vacation--airport--arrival').children().each(function(i,ele){
										if(!$(ele).hasClass('_-placeholder')){
											$(ele).remove();
										}
									});
									
									for(var i in results){
										if(results.hasOwnProperty(i)){
											var res = results[i];
											
/*												_.api.sfm.map._.places.getDetails({placeId : results[i].place_id}, function(place, st2){
												ret.push({
													nearby : results[i],
													place : place
												});
												
												_.log('##22#',place,res,st2,google.maps.places.PlacesServiceStatus.OK);
											
											}); */
											
											var sel = $('._-input--field--vacation--airport--arrival').attr('data-_-field-select-option');

											$('._-input--field--vacation--airport--arrival').append('<option value="' + res.place_id + '"' + (sel && (sel == res.place_id) ? ' selected' : '') + '>' + res.name + '</option>');
										}
									}
								}
							});

						});
						
						return true;
					};
					
					if(ele.value){
						f_select(false,{item : { value : ele.value }});
					}
					
					$(ele).autocomplete({
						source: function (request, response) {
							jQuery.getJSON(
								"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
								function (data) {
									response(data);
								}
							);
						},
						appendTo: wrapper,
						minLength: 3,
						position: {
							my : 'center top',
							at : 'center bottom'
						},
						select: f_select
					})
					
				});
				
			});
		},
		get_type : function(ele){
			if(!ele){
				return false;
			}
			
			var prefix = '_-input',
				sep = '--',
				str_wrapper = 'wrapper',
				class_selected = '_-selected';
			var classes = ele.className.split(' ');
			var itype = class_parent = parent = false;
			
			if(classes.length){
				for(var i=0; i<classes.length; i++){
					if(classes[i].indexOf(prefix) >= 0){
						itype = classes[i].split(sep);
						if(itype[1]){
							return itype[1];
						}
					}
				}
			}
			
			return false;
		}
	};
	
})(_,jQuery);				
				// } 02.field.js # (10 / 25) 

			
				// # (11 / 25) 02.key.js {

(function(_){

	// key bindings
	_.key = {
		_blocked : false,
		is : function(e,name){
			if(!name){
				return false;
			}
			
			return (_.key.keys[name] && e.keyCode && (_.key.keys[name] == e.keyCode));
	
		},
		is_meta : function(key){
			return key && (
				(key == _.key.keys.ctrl) ||
				(key == _.key.keys.shift) ||
				(key == _.key.keys.alt) ||
				(key == _.key.keys.up) ||
				(key == _.key.keys.down) ||
				(key == _.key.keys.left) ||
				(key == _.key.keys.right) ||
				(key == _.key.keys.apple) ||
				(key == _.key.keys.meta) ||
				(key == _.key.keys.win) ||
				(key == _.key.keys.fn) ||
				(key == _.key.keys.esc)
			);
		},
		keys : {
	//		strg : 17,
			ctrl : 17,
			ctrl_right : 18,
			ctrl_r : 18,
			shift : 16,
			enter : 13,
			backspace : 8,
			bcksp : 8,
			alt : 18,
			alt_r : 17,
			alt_right : 17,
			space : 32,
			apple : 224,
			cmd : 224,
			command : 224,
			mac : 224,
			meta : 224,
			win : 224,
			fn : null,
			up : 38,
			down : 40,
			left : 37,
			right : 39,
			esc : 27,
			del : 46,
			f1: 112,
			f2: 113,
			f3: 114,
			f4: 115,
			f5: 116,
			f6: 117,
			f7: 118,
			f8: 119,
			f9: 120,
			f10: 121,
			f11: 122,
			f12: 123
		}
	};
	
})(_);				
				// } 02.key.js # (11 / 25) 

			
				// # (12 / 25) 02.socket-io.js {

(function(_, $){

	_.socket = {};

})(_, jQuery);


/*! Socket.IO.js build:0.9.16, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

var io = ('undefined' === typeof module ? {} : module.exports);
(function() {

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * IO namespace.
   *
   * @namespace
   */

  var io = exports;

  /**
   * Socket.IO version
   *
   * @api public
   */

  io.version = '0.9.16';

  /**
   * Protocol implemented.
   *
   * @api public
   */

  io.protocol = 1;

  /**
   * Available transports, these will be populated with the available transports
   *
   * @api public
   */

  io.transports = [];

  /**
   * Keep track of jsonp callbacks.
   *
   * @api private
   */

  io.j = [];

  /**
   * Keep track of our io.Sockets
   *
   * @api private
   */
  io.sockets = {};


  /**
   * Manages connections to hosts.
   *
   * @param {String} uri
   * @Param {Boolean} force creation of new socket (defaults to false)
   * @api public
   */

  io.connect = function (host, details) {
    var uri = io.util.parseUri(host)
      , uuri
      , socket;

    if (global && global.location) {
      uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
      uri.host = uri.host || (global.document
        ? global.document.domain : global.location.hostname);
      uri.port = uri.port || global.location.port;
    }

    uuri = io.util.uniqueUri(uri);

    var options = {
        host: uri.host
      , secure: 'https' == uri.protocol
      , port: uri.port || ('https' == uri.protocol ? 443 : 80)
      , query: uri.query || ''
    };

    io.util.merge(options, details);

    if (options['force new connection'] || !io.sockets[uuri]) {
      socket = new io.Socket(options);
    }

    if (!options['force new connection'] && socket) {
      io.sockets[uuri] = socket;
    }

    socket = socket || io.sockets[uuri];

    // if path is different from '' or /
    return socket.of(uri.path.length > 1 ? uri.path : '');
  };

})('object' === typeof module ? module.exports : (this.io = {}), this);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * Utilities namespace.
   *
   * @namespace
   */

  var util = exports.util = {};

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api public
   */

  var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
               'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
               'anchor'];

  util.parseUri = function (str) {
    var m = re.exec(str || '')
      , uri = {}
      , i = 14;

    while (i--) {
      uri[parts[i]] = m[i] || '';
    }

    return uri;
  };

  /**
   * Produces a unique url that identifies a Socket.IO connection.
   *
   * @param {Object} uri
   * @api public
   */

  util.uniqueUri = function (uri) {
    var protocol = uri.protocol
      , host = uri.host
      , port = uri.port;

    if ('document' in global) {
      host = host || document.domain;
      port = port || (protocol == 'https'
        && document.location.protocol !== 'https:' ? 443 : document.location.port);
    } else {
      host = host || 'localhost';

      if (!port && protocol == 'https') {
        port = 443;
      }
    }

    return (protocol || 'http') + '://' + host + ':' + (port || 80);
  };

  /**
   * Mergest 2 query strings in to once unique query string
   *
   * @param {String} base
   * @param {String} addition
   * @api public
   */

  util.query = function (base, addition) {
    var query = util.chunkQuery(base || '')
      , components = [];

    util.merge(query, util.chunkQuery(addition || ''));
    for (var part in query) {
      if (query.hasOwnProperty(part)) {
        components.push(part + '=' + query[part]);
      }
    }

    return components.length ? '?' + components.join('&') : '';
  };

  /**
   * Transforms a querystring in to an object
   *
   * @param {String} qs
   * @api public
   */

  util.chunkQuery = function (qs) {
    var query = {}
      , params = qs.split('&')
      , i = 0
      , l = params.length
      , kv;

    for (; i < l; ++i) {
      kv = params[i].split('=');
      if (kv[0]) {
        query[kv[0]] = kv[1];
      }
    }

    return query;
  };

  /**
   * Executes the given function when the page is loaded.
   *
   *     io.util.load(function () { console.log('page loaded'); });
   *
   * @param {Function} fn
   * @api public
   */

  var pageLoaded = false;

  util.load = function (fn) {
    if ('document' in global && document.readyState === 'complete' || pageLoaded) {
      return fn();
    }

    util.on(global, 'load', fn, false);
  };

  /**
   * Adds an event.
   *
   * @api private
   */

  util.on = function (element, event, fn, capture) {
    if (element.attachEvent) {
      element.attachEvent('on' + event, fn);
    } else if (element.addEventListener) {
      element.addEventListener(event, fn, capture);
    }
  };

  /**
   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
   *
   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
   * @api private
   */

  util.request = function (xdomain) {

    if (xdomain && 'undefined' != typeof XDomainRequest && !util.ua.hasCORS) {
      return new XDomainRequest();
    }

    if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
      return new XMLHttpRequest();
    }

    if (!xdomain) {
      try {
        return new window[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
      } catch(e) { }
    }

    return null;
  };

  /**
   * XHR based transport constructor.
   *
   * @constructor
   * @api public
   */

  /**
   * Change the internal pageLoaded value.
   */

  if ('undefined' != typeof window) {
    util.load(function () {
      pageLoaded = true;
    });
  }

  /**
   * Defers a function to ensure a spinner is not displayed by the browser
   *
   * @param {Function} fn
   * @api public
   */

  util.defer = function (fn) {
    if (!util.ua.webkit || 'undefined' != typeof importScripts) {
      return fn();
    }

    util.load(function () {
      setTimeout(fn, 100);
    });
  };

  /**
   * Merges two objects.
   *
   * @api public
   */

  util.merge = function merge (target, additional, deep, lastseen) {
    var seen = lastseen || []
      , depth = typeof deep == 'undefined' ? 2 : deep
      , prop;

    for (prop in additional) {
      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
        if (typeof target[prop] !== 'object' || !depth) {
          target[prop] = additional[prop];
          seen.push(additional[prop]);
        } else {
          util.merge(target[prop], additional[prop], depth - 1, seen);
        }
      }
    }

    return target;
  };

  /**
   * Merges prototypes from objects
   *
   * @api public
   */

  util.mixin = function (ctor, ctor2) {
    util.merge(ctor.prototype, ctor2.prototype);
  };

  /**
   * Shortcut for prototypical and static inheritance.
   *
   * @api private
   */

  util.inherit = function (ctor, ctor2) {
    function f() {};
    f.prototype = ctor2.prototype;
    ctor.prototype = new f;
  };

  /**
   * Checks if the given object is an Array.
   *
   *     io.util.isArray([]); // true
   *     io.util.isArray({}); // false
   *
   * @param Object obj
   * @api public
   */

  util.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /**
   * Intersects values of two arrays into a third
   *
   * @api public
   */

  util.intersect = function (arr, arr2) {
    var ret = []
      , longest = arr.length > arr2.length ? arr : arr2
      , shortest = arr.length > arr2.length ? arr2 : arr;

    for (var i = 0, l = shortest.length; i < l; i++) {
      if (~util.indexOf(longest, shortest[i]))
        ret.push(shortest[i]);
    }

    return ret;
  };

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  util.indexOf = function (arr, o, i) {

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0;
         i < j && arr[i] !== o; i++) {}

    return j <= i ? -1 : i;
  };

  /**
   * Converts enumerables to array.
   *
   * @api public
   */

  util.toArray = function (enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
      arr.push(enu[i]);

    return arr;
  };

  /**
   * UA / engines detection namespace.
   *
   * @namespace
   */

  util.ua = {};

  /**
   * Whether the UA supports CORS for XHR.
   *
   * @api public
   */

  util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
    try {
      var a = new XMLHttpRequest();
    } catch (e) {
      return false;
    }

    return a.withCredentials != undefined;
  })();

  /**
   * Detect webkit.
   *
   * @api public
   */

  util.ua.webkit = 'undefined' != typeof navigator
    && /webkit/i.test(navigator.userAgent);

   /**
   * Detect iPad/iPhone/iPod.
   *
   * @api public
   */

  util.ua.iDevice = 'undefined' != typeof navigator
      && /iPad|iPhone|iPod/i.test(navigator.userAgent);

})('undefined' != typeof io ? io : module.exports, this);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.EventEmitter = EventEmitter;

  /**
   * Event emitter constructor.
   *
   * @api public.
   */

  function EventEmitter () {};

  /**
   * Adds a listener
   *
   * @api public
   */

  EventEmitter.prototype.on = function (name, fn) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = fn;
    } else if (io.util.isArray(this.$events[name])) {
      this.$events[name].push(fn);
    } else {
      this.$events[name] = [this.$events[name], fn];
    }

    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  /**
   * Adds a volatile listener.
   *
   * @api public
   */

  EventEmitter.prototype.once = function (name, fn) {
    var self = this;

    function on () {
      self.removeListener(name, on);
      fn.apply(this, arguments);
    };

    on.listener = fn;
    this.on(name, on);

    return this;
  };

  /**
   * Removes a listener.
   *
   * @api public
   */

  EventEmitter.prototype.removeListener = function (name, fn) {
    if (this.$events && this.$events[name]) {
      var list = this.$events[name];

      if (io.util.isArray(list)) {
        var pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
            pos = i;
            break;
          }
        }

        if (pos < 0) {
          return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
          delete this.$events[name];
        }
      } else if (list === fn || (list.listener && list.listener === fn)) {
        delete this.$events[name];
      }
    }

    return this;
  };

  /**
   * Removes all listeners for an event.
   *
   * @api public
   */

  EventEmitter.prototype.removeAllListeners = function (name) {
    if (name === undefined) {
      this.$events = {};
      return this;
    }

    if (this.$events && this.$events[name]) {
      this.$events[name] = null;
    }

    return this;
  };

  /**
   * Gets all listeners for a certain event.
   *
   * @api publci
   */

  EventEmitter.prototype.listeners = function (name) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = [];
    }

    if (!io.util.isArray(this.$events[name])) {
      this.$events[name] = [this.$events[name]];
    }

    return this.$events[name];
  };

  /**
   * Emits an event.
   *
   * @api public
   */

  EventEmitter.prototype.emit = function (name) {
    if (!this.$events) {
      return false;
    }

    var handler = this.$events[name];

    if (!handler) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    if ('function' == typeof handler) {
      handler.apply(this, args);
    } else if (io.util.isArray(handler)) {
      var listeners = handler.slice();

      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    } else {
      return false;
    }

    return true;
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Based on JSON2 (http://www.JSON.org/js.html).
 */

(function (exports, nativeJSON) {
  "use strict";

  // use native JSON if it's available
  if (nativeJSON && nativeJSON.parse){
    return exports.JSON = {
      parse: nativeJSON.parse
    , stringify: nativeJSON.stringify
    };
  }

  var JSON = exports.JSON = {};

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  function date(d, key) {
    return isFinite(d.valueOf()) ?
        d.getUTCFullYear()     + '-' +
        f(d.getUTCMonth() + 1) + '-' +
        f(d.getUTCDate())      + 'T' +
        f(d.getUTCHours())     + ':' +
        f(d.getUTCMinutes())   + ':' +
        f(d.getUTCSeconds())   + 'Z' : null;
  };

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {    // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
      },
      rep;


  function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

// Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

      if (value instanceof Date) {
          value = date(key);
      }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

// What happens next depends on the value's type.

      switch (typeof value) {
      case 'string':
          return quote(value);

      case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

          return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

      case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

          if (!value) {
              return 'null';
          }

// Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

// Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

              length = value.length;
              for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value) || 'null';
              }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

              v = partial.length === 0 ? '[]' : gap ?
                  '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                  '[' + partial.join(',') + ']';
              gap = mind;
              return v;
          }

// If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                  if (typeof rep[i] === 'string') {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          } else {

// Otherwise, iterate through all of the keys in the object.

              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

          v = partial.length === 0 ? '{}' : gap ?
              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
              '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
  }

// If the JSON object does not yet have a stringify method, give it one.

  JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

// If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
              (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

      return str('', {'': value});
  };

// If the JSON object does not yet have a parse method, give it one.

  JSON.parse = function (text, reviver) {
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.

          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                          value[k] = v;
                      } else {
                          delete value[k];
                      }
                  }
              }
          }
          return reviver.call(holder, key, value);
      }


  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
          text = text.replace(cx, function (a) {
              return '\\u' +
                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
      }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.

  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/
              .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.

          j = eval('(' + text + ')');

  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === 'function' ?
              walk({'': j}, '') : j;
      }

  // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
  };

})(
    'undefined' != typeof io ? io : module.exports
  , typeof JSON !== 'undefined' ? JSON : undefined
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Parser namespace.
   *
   * @namespace
   */

  var parser = exports.parser = {};

  /**
   * Packet types.
   */

  var packets = parser.packets = [
      'disconnect'
    , 'connect'
    , 'heartbeat'
    , 'message'
    , 'json'
    , 'event'
    , 'ack'
    , 'error'
    , 'noop'
  ];

  /**
   * Errors reasons.
   */

  var reasons = parser.reasons = [
      'transport not supported'
    , 'client not handshaken'
    , 'unauthorized'
  ];

  /**
   * Errors advice.
   */

  var advice = parser.advice = [
      'reconnect'
  ];

  /**
   * Shortcuts.
   */

  var JSON = io.JSON
    , indexOf = io.util.indexOf;

  /**
   * Encodes a packet.
   *
   * @api private
   */

  parser.encodePacket = function (packet) {
    var type = indexOf(packets, packet.type)
      , id = packet.id || ''
      , endpoint = packet.endpoint || ''
      , ack = packet.ack
      , data = null;

    switch (packet.type) {
      case 'error':
        var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
          , adv = packet.advice ? indexOf(advice, packet.advice) : '';

        if (reason !== '' || adv !== '')
          data = reason + (adv !== '' ? ('+' + adv) : '');

        break;

      case 'message':
        if (packet.data !== '')
          data = packet.data;
        break;

      case 'event':
        var ev = { name: packet.name };

        if (packet.args && packet.args.length) {
          ev.args = packet.args;
        }

        data = JSON.stringify(ev);
        break;

      case 'json':
        data = JSON.stringify(packet.data);
        break;

      case 'connect':
        if (packet.qs)
          data = packet.qs;
        break;

      case 'ack':
        data = packet.ackId
          + (packet.args && packet.args.length
              ? '+' + JSON.stringify(packet.args) : '');
        break;
    }

    // construct packet with required fragments
    var encoded = [
        type
      , id + (ack == 'data' ? '+' : '')
      , endpoint
    ];

    // data fragment is optional
    if (data !== null && data !== undefined)
      encoded.push(data);

    return encoded.join(':');
  };

  /**
   * Encodes multiple messages (payload).
   *
   * @param {Array} messages
   * @api private
   */

  parser.encodePayload = function (packets) {
    var decoded = '';

    if (packets.length == 1)
      return packets[0];

    for (var i = 0, l = packets.length; i < l; i++) {
      var packet = packets[i];
      decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
    }

    return decoded;
  };

  /**
   * Decodes a packet
   *
   * @api private
   */

  var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

  parser.decodePacket = function (data) {
    var pieces = data.match(regexp);

    if (!pieces) return {};

    var id = pieces[2] || ''
      , data = pieces[5] || ''
      , packet = {
            type: packets[pieces[1]]
          , endpoint: pieces[4] || ''
        };

    // whether we need to acknowledge the packet
    if (id) {
      packet.id = id;
      if (pieces[3])
        packet.ack = 'data';
      else
        packet.ack = true;
    }

    // handle different packet types
    switch (packet.type) {
      case 'error':
        var pieces = data.split('+');
        packet.reason = reasons[pieces[0]] || '';
        packet.advice = advice[pieces[1]] || '';
        break;

      case 'message':
        packet.data = data || '';
        break;

      case 'event':
        try {
          var opts = JSON.parse(data);
          packet.name = opts.name;
          packet.args = opts.args;
        } catch (e) { }

        packet.args = packet.args || [];
        break;

      case 'json':
        try {
          packet.data = JSON.parse(data);
        } catch (e) { }
        break;

      case 'connect':
        packet.qs = data || '';
        break;

      case 'ack':
        var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
        if (pieces) {
          packet.ackId = pieces[1];
          packet.args = [];

          if (pieces[3]) {
            try {
              packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
            } catch (e) { }
          }
        }
        break;

      case 'disconnect':
      case 'heartbeat':
        break;
    };

    return packet;
  };

  /**
   * Decodes data payload. Detects multiple messages
   *
   * @return {Array} messages
   * @api public
   */

  parser.decodePayload = function (data) {
    // IE doesn't like data[i] for unicode chars, charAt works fine
    if (data.charAt(0) == '\ufffd') {
      var ret = [];

      for (var i = 1, length = ''; i < data.length; i++) {
        if (data.charAt(i) == '\ufffd') {
          ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
          i += Number(length) + 1;
          length = '';
        } else {
          length += data.charAt(i);
        }
      }

      return ret;
    } else {
      return [parser.decodePacket(data)];
    }
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.Transport = Transport;

  /**
   * This is the transport template for all supported transport methods.
   *
   * @constructor
   * @api public
   */

  function Transport (socket, sessid) {
    this.socket = socket;
    this.sessid = sessid;
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Transport, io.EventEmitter);


  /**
   * Indicates whether heartbeats is enabled for this transport
   *
   * @api private
   */

  Transport.prototype.heartbeats = function () {
    return true;
  };

  /**
   * Handles the response from the server. When a new response is received
   * it will automatically update the timeout, decode the message and
   * forwards the response to the onMessage function for further processing.
   *
   * @param {String} data Response from the server.
   * @api private
   */

  Transport.prototype.onData = function (data) {
    this.clearCloseTimeout();

    // If the connection in currently open (or in a reopening state) reset the close
    // timeout since we have just received data. This check is necessary so
    // that we don't reset the timeout on an explicitly disconnected connection.
    if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
      this.setCloseTimeout();
    }

    if (data !== '') {
      // todo: we should only do decodePayload for xhr transports
      var msgs = io.parser.decodePayload(data);

      if (msgs && msgs.length) {
        for (var i = 0, l = msgs.length; i < l; i++) {
          this.onPacket(msgs[i]);
        }
      }
    }

    return this;
  };

  /**
   * Handles packets.
   *
   * @api private
   */

  Transport.prototype.onPacket = function (packet) {
    this.socket.setHeartbeatTimeout();

    if (packet.type == 'heartbeat') {
      return this.onHeartbeat();
    }

    if (packet.type == 'connect' && packet.endpoint == '') {
      this.onConnect();
    }

    if (packet.type == 'error' && packet.advice == 'reconnect') {
      this.isOpen = false;
    }

    this.socket.onPacket(packet);

    return this;
  };

  /**
   * Sets close timeout
   *
   * @api private
   */

  Transport.prototype.setCloseTimeout = function () {
    if (!this.closeTimeout) {
      var self = this;

      this.closeTimeout = setTimeout(function () {
        self.onDisconnect();
      }, this.socket.closeTimeout);
    }
  };

  /**
   * Called when transport disconnects.
   *
   * @api private
   */

  Transport.prototype.onDisconnect = function () {
    if (this.isOpen) this.close();
    this.clearTimeouts();
    this.socket.onDisconnect();
    return this;
  };

  /**
   * Called when transport connects
   *
   * @api private
   */

  Transport.prototype.onConnect = function () {
    this.socket.onConnect();
    return this;
  };

  /**
   * Clears close timeout
   *
   * @api private
   */

  Transport.prototype.clearCloseTimeout = function () {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  /**
   * Clear timeouts
   *
   * @api private
   */

  Transport.prototype.clearTimeouts = function () {
    this.clearCloseTimeout();

    if (this.reopenTimeout) {
      clearTimeout(this.reopenTimeout);
    }
  };

  /**
   * Sends a packet
   *
   * @param {Object} packet object.
   * @api private
   */

  Transport.prototype.packet = function (packet) {
    this.send(io.parser.encodePacket(packet));
  };

  /**
   * Send the received heartbeat message back to server. So the server
   * knows we are still connected.
   *
   * @param {String} heartbeat Heartbeat response from the server.
   * @api private
   */

  Transport.prototype.onHeartbeat = function (heartbeat) {
    this.packet({ type: 'heartbeat' });
  };

  /**
   * Called when the transport opens.
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.isOpen = true;
    this.clearCloseTimeout();
    this.socket.onOpen();
  };

  /**
   * Notifies the base when the connection with the Socket.IO server
   * has been disconnected.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    var self = this;

    /* FIXME: reopen delay causing a infinit loop
    this.reopenTimeout = setTimeout(function () {
      self.open();
    }, this.socket.options['reopen delay']);*/

    this.isOpen = false;
    this.socket.onClose();
    this.onDisconnect();
  };

  /**
   * Generates a connection url based on the Socket.IO URL Protocol.
   * See <https://github.com/learnboost/socket.io-node/> for more details.
   *
   * @returns {String} Connection url
   * @api private
   */

  Transport.prototype.prepareUrl = function () {
    var options = this.socket.options;

    return this.scheme() + '://'
      + options.host + ':' + options.port + '/'
      + options.resource + '/' + io.protocol
      + '/' + this.name + '/' + this.sessid;
  };

  /**
   * Checks if the transport is ready to start a connection.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Transport.prototype.ready = function (socket, fn) {
    fn.call(this);
  };
})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.Socket = Socket;

  /**
   * Create a new `Socket.IO client` which can establish a persistent
   * connection with a Socket.IO enabled server.
   *
   * @api public
   */

  function Socket (options) {
    this.options = {
        port: 80
      , secure: false
      , document: 'document' in global ? document : false
      , resource: 'socket.io'
      , transports: io.transports
      , 'connect timeout': 10000
      , 'try multiple transports': true
      , 'reconnect': true
      , 'reconnection delay': 500
      , 'reconnection limit': Infinity
      , 'reopen delay': 3000
      , 'max reconnection attempts': 10
      , 'sync disconnect on unload': false
      , 'auto connect': true
      , 'flash policy port': 10843
      , 'manualFlush': false
    };

    io.util.merge(this.options, options);

    this.connected = false;
    this.open = false;
    this.connecting = false;
    this.reconnecting = false;
    this.namespaces = {};
    this.buffer = [];
    this.doBuffer = false;

    if (this.options['sync disconnect on unload'] &&
        (!this.isXDomain() || io.util.ua.hasCORS)) {
      var self = this;
      io.util.on(global, 'beforeunload', function () {
        self.disconnectSync();
      }, false);
    }

    if (this.options['auto connect']) {
      this.connect();
    }
};

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Socket, io.EventEmitter);

  /**
   * Returns a namespace listener/emitter for this socket
   *
   * @api public
   */

  Socket.prototype.of = function (name) {
    if (!this.namespaces[name]) {
      this.namespaces[name] = new io.SocketNamespace(this, name);

      if (name !== '') {
        this.namespaces[name].packet({ type: 'connect' });
      }
    }

    return this.namespaces[name];
  };

  /**
   * Emits the given event to the Socket and all namespaces
   *
   * @api private
   */

  Socket.prototype.publish = function () {
    this.emit.apply(this, arguments);

    var nsp;

    for (var i in this.namespaces) {
      if (this.namespaces.hasOwnProperty(i)) {
        nsp = this.of(i);
        nsp.$emit.apply(nsp, arguments);
      }
    }
  };

  /**
   * Performs the handshake
   *
   * @api private
   */

  function empty () { };

  Socket.prototype.handshake = function (fn) {
    var self = this
      , options = this.options;

    function complete (data) {
      if (data instanceof Error) {
        self.connecting = false;
        self.onError(data.message);
      } else {
        fn.apply(null, data.split(':'));
      }
    };

    var url = [
          'http' + (options.secure ? 's' : '') + ':/'
        , options.host + ':' + options.port
        , options.resource
        , io.protocol
        , io.util.query(this.options.query, 't=' + +new Date)
      ].join('/');

    if (this.isXDomain() && !io.util.ua.hasCORS) {
      var insertAt = document.getElementsByTagName('script')[0]
        , script = document.createElement('script');

      script.src = url + '&jsonp=' + io.j.length;
      insertAt.parentNode.insertBefore(script, insertAt);

      io.j.push(function (data) {
        complete(data);
        script.parentNode.removeChild(script);
      });
    } else {
      var xhr = io.util.request();

      xhr.open('GET', url, true);
      if (this.isXDomain()) {
        xhr.withCredentials = true;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;

          if (xhr.status == 200) {
            complete(xhr.responseText);
          } else if (xhr.status == 403) {
            self.onError(xhr.responseText);
          } else {
            self.connecting = false;            
            !self.reconnecting && self.onError(xhr.responseText);
          }
        }
      };
      xhr.send(null);
    }
  };

  /**
   * Find an available transport based on the options supplied in the constructor.
   *
   * @api private
   */

  Socket.prototype.getTransport = function (override) {
    var transports = override || this.transports, match;

    for (var i = 0, transport; transport = transports[i]; i++) {
      if (io.Transport[transport]
        && io.Transport[transport].check(this)
        && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
        return new io.Transport[transport](this, this.sessionid);
      }
    }

    return null;
  };

  /**
   * Connects to the server.
   *
   * @param {Function} [fn] Callback.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.connect = function (fn) {
    if (this.connecting) {
      return this;
    }

    var self = this;
    self.connecting = true;
    
    this.handshake(function (sid, heartbeat, close, transports) {
      self.sessionid = sid;
      self.closeTimeout = close * 1000;
      self.heartbeatTimeout = heartbeat * 1000;
      if(!self.transports)
          self.transports = self.origTransports = (transports ? io.util.intersect(
              transports.split(',')
            , self.options.transports
          ) : self.options.transports);

      self.setHeartbeatTimeout();

      function connect (transports){
        if (self.transport) self.transport.clearTimeouts();

        self.transport = self.getTransport(transports);
        if (!self.transport) return self.publish('connect_failed');

        // once the transport is ready
        self.transport.ready(self, function () {
          self.connecting = true;
          self.publish('connecting', self.transport.name);
          self.transport.open();

          if (self.options['connect timeout']) {
            self.connectTimeoutTimer = setTimeout(function () {
              if (!self.connected) {
                self.connecting = false;

                if (self.options['try multiple transports']) {
                  var remaining = self.transports;

                  while (remaining.length > 0 && remaining.splice(0,1)[0] !=
                         self.transport.name) {}

                    if (remaining.length){
                      connect(remaining);
                    } else {
                      self.publish('connect_failed');
                    }
                }
              }
            }, self.options['connect timeout']);
          }
        });
      }

      connect(self.transports);

      self.once('connect', function (){
        clearTimeout(self.connectTimeoutTimer);

        fn && typeof fn == 'function' && fn();
      });
    });

    return this;
  };

  /**
   * Clears and sets a new heartbeat timeout using the value given by the
   * server during the handshake.
   *
   * @api private
   */

  Socket.prototype.setHeartbeatTimeout = function () {
    clearTimeout(this.heartbeatTimeoutTimer);
    if(this.transport && !this.transport.heartbeats()) return;

    var self = this;
    this.heartbeatTimeoutTimer = setTimeout(function () {
      self.transport.onClose();
    }, this.heartbeatTimeout);
  };

  /**
   * Sends a message.
   *
   * @param {Object} data packet.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.packet = function (data) {
    if (this.connected && !this.doBuffer) {
      this.transport.packet(data);
    } else {
      this.buffer.push(data);
    }

    return this;
  };

  /**
   * Sets buffer state
   *
   * @api private
   */

  Socket.prototype.setBuffer = function (v) {
    this.doBuffer = v;

    if (!v && this.connected && this.buffer.length) {
      if (!this.options['manualFlush']) {
        this.flushBuffer();
      }
    }
  };

  /**
   * Flushes the buffer data over the wire.
   * To be invoked manually when 'manualFlush' is set to true.
   *
   * @api public
   */

  Socket.prototype.flushBuffer = function() {
    this.transport.payload(this.buffer);
    this.buffer = [];
  };
  

  /**
   * Disconnect the established connect.
   *
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.disconnect = function () {
    if (this.connected || this.connecting) {
      if (this.open) {
        this.of('').packet({ type: 'disconnect' });
      }

      // handle disconnection immediately
      this.onDisconnect('booted');
    }

    return this;
  };

  /**
   * Disconnects the socket with a sync XHR.
   *
   * @api private
   */

  Socket.prototype.disconnectSync = function () {
    // ensure disconnection
    var xhr = io.util.request();
    var uri = [
        'http' + (this.options.secure ? 's' : '') + ':/'
      , this.options.host + ':' + this.options.port
      , this.options.resource
      , io.protocol
      , ''
      , this.sessionid
    ].join('/') + '/?disconnect=1';

    xhr.open('GET', uri, false);
    xhr.send(null);

    // handle disconnection immediately
    this.onDisconnect('booted');
  };

  /**
   * Check if we need to use cross domain enabled transports. Cross domain would
   * be a different port or different domain name.
   *
   * @returns {Boolean}
   * @api private
   */

  Socket.prototype.isXDomain = function () {

    var port = global.location.port ||
      ('https:' == global.location.protocol ? 443 : 80);

    return this.options.host !== global.location.hostname 
      || this.options.port != port;
  };

  /**
   * Called upon handshake.
   *
   * @api private
   */

  Socket.prototype.onConnect = function () {
    if (!this.connected) {
      this.connected = true;
      this.connecting = false;
      if (!this.doBuffer) {
        // make sure to flush the buffer
        this.setBuffer(false);
      }
      this.emit('connect');
    }
  };

  /**
   * Called when the transport opens
   *
   * @api private
   */

  Socket.prototype.onOpen = function () {
    this.open = true;
  };

  /**
   * Called when the transport closes.
   *
   * @api private
   */

  Socket.prototype.onClose = function () {
    this.open = false;
    clearTimeout(this.heartbeatTimeoutTimer);
  };

  /**
   * Called when the transport first opens a connection
   *
   * @param text
   */

  Socket.prototype.onPacket = function (packet) {
    this.of(packet.endpoint).onPacket(packet);
  };

  /**
   * Handles an error.
   *
   * @api private
   */

  Socket.prototype.onError = function (err) {
    if (err && err.advice) {
      if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
        this.disconnect();
        if (this.options.reconnect) {
          this.reconnect();
        }
      }
    }

    this.publish('error', err && err.reason ? err.reason : err);
  };

  /**
   * Called when the transport disconnects.
   *
   * @api private
   */

  Socket.prototype.onDisconnect = function (reason) {
    var wasConnected = this.connected
      , wasConnecting = this.connecting;

    this.connected = false;
    this.connecting = false;
    this.open = false;

    if (wasConnected || wasConnecting) {
      this.transport.close();
      this.transport.clearTimeouts();
      if (wasConnected) {
        this.publish('disconnect', reason);

        if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
          this.reconnect();
        }
      }
    }
  };

  /**
   * Called upon reconnection.
   *
   * @api private
   */

  Socket.prototype.reconnect = function () {
    this.reconnecting = true;
    this.reconnectionAttempts = 0;
    this.reconnectionDelay = this.options['reconnection delay'];

    var self = this
      , maxAttempts = this.options['max reconnection attempts']
      , tryMultiple = this.options['try multiple transports']
      , limit = this.options['reconnection limit'];

    function reset () {
      if (self.connected) {
        for (var i in self.namespaces) {
          if (self.namespaces.hasOwnProperty(i) && '' !== i) {
              self.namespaces[i].packet({ type: 'connect' });
          }
        }
        self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
      }

      clearTimeout(self.reconnectionTimer);

      self.removeListener('connect_failed', maybeReconnect);
      self.removeListener('connect', maybeReconnect);

      self.reconnecting = false;

      delete self.reconnectionAttempts;
      delete self.reconnectionDelay;
      delete self.reconnectionTimer;
      delete self.redoTransports;

      self.options['try multiple transports'] = tryMultiple;
    };

    function maybeReconnect () {
      if (!self.reconnecting) {
        return;
      }

      if (self.connected) {
        return reset();
      };

      if (self.connecting && self.reconnecting) {
        return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
      }

      if (self.reconnectionAttempts++ >= maxAttempts) {
        if (!self.redoTransports) {
          self.on('connect_failed', maybeReconnect);
          self.options['try multiple transports'] = true;
          self.transports = self.origTransports;
          self.transport = self.getTransport();
          self.redoTransports = true;
          self.connect();
        } else {
          self.publish('reconnect_failed');
          reset();
        }
      } else {
        if (self.reconnectionDelay < limit) {
          self.reconnectionDelay *= 2; // exponential back off
        }

        self.connect();
        self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
        self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
      }
    };

    this.options['try multiple transports'] = false;
    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

    this.on('connect', maybeReconnect);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.SocketNamespace = SocketNamespace;

  /**
   * Socket namespace constructor.
   *
   * @constructor
   * @api public
   */

  function SocketNamespace (socket, name) {
    this.socket = socket;
    this.name = name || '';
    this.flags = {};
    this.json = new Flag(this, 'json');
    this.ackPackets = 0;
    this.acks = {};
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(SocketNamespace, io.EventEmitter);

  /**
   * Copies emit since we override it
   *
   * @api private
   */

  SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

  /**
   * Creates a new namespace, by proxying the request to the socket. This
   * allows us to use the synax as we do on the server.
   *
   * @api public
   */

  SocketNamespace.prototype.of = function () {
    return this.socket.of.apply(this.socket, arguments);
  };

  /**
   * Sends a packet.
   *
   * @api private
   */

  SocketNamespace.prototype.packet = function (packet) {
    packet.endpoint = this.name;
    this.socket.packet(packet);
    this.flags = {};
    return this;
  };

  /**
   * Sends a message
   *
   * @api public
   */

  SocketNamespace.prototype.send = function (data, fn) {
    var packet = {
        type: this.flags.json ? 'json' : 'message'
      , data: data
    };

    if ('function' == typeof fn) {
      packet.id = ++this.ackPackets;
      packet.ack = true;
      this.acks[packet.id] = fn;
    }

    return this.packet(packet);
  };

  /**
   * Emits an event
   *
   * @api public
   */
  
  SocketNamespace.prototype.emit = function (name) {
    var args = Array.prototype.slice.call(arguments, 1)
      , lastArg = args[args.length - 1]
      , packet = {
            type: 'event'
          , name: name
        };

    if ('function' == typeof lastArg) {
      packet.id = ++this.ackPackets;
      packet.ack = 'data';
      this.acks[packet.id] = lastArg;
      args = args.slice(0, args.length - 1);
    }

    packet.args = args;

    return this.packet(packet);
  };

  /**
   * Disconnects the namespace
   *
   * @api private
   */

  SocketNamespace.prototype.disconnect = function () {
    if (this.name === '') {
      this.socket.disconnect();
    } else {
      this.packet({ type: 'disconnect' });
      this.$emit('disconnect');
    }

    return this;
  };

  /**
   * Handles a packet
   *
   * @api private
   */

  SocketNamespace.prototype.onPacket = function (packet) {
    var self = this;

    function ack () {
      self.packet({
          type: 'ack'
        , args: io.util.toArray(arguments)
        , ackId: packet.id
      });
    };

    switch (packet.type) {
      case 'connect':
        this.$emit('connect');
        break;

      case 'disconnect':
        if (this.name === '') {
          this.socket.onDisconnect(packet.reason || 'booted');
        } else {
          this.$emit('disconnect', packet.reason);
        }
        break;

      case 'message':
      case 'json':
        var params = ['message', packet.data];

        if (packet.ack == 'data') {
          params.push(ack);
        } else if (packet.ack) {
          this.packet({ type: 'ack', ackId: packet.id });
        }

        this.$emit.apply(this, params);
        break;

      case 'event':
        var params = [packet.name].concat(packet.args);

        if (packet.ack == 'data')
          params.push(ack);

        this.$emit.apply(this, params);
        break;

      case 'ack':
        if (this.acks[packet.ackId]) {
          this.acks[packet.ackId].apply(this, packet.args);
          delete this.acks[packet.ackId];
        }
        break;

      case 'error':
        if (packet.advice){
          this.socket.onError(packet);
        } else {
          if (packet.reason == 'unauthorized') {
            this.$emit('connect_failed', packet.reason);
          } else {
            this.$emit('error', packet.reason);
          }
        }
        break;
    }
  };

  /**
   * Flag interface.
   *
   * @api private
   */

  function Flag (nsp, name) {
    this.namespace = nsp;
    this.name = name;
  };

  /**
   * Send a message
   *
   * @api public
   */

  Flag.prototype.send = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.send.apply(this.namespace, arguments);
  };

  /**
   * Emit an event
   *
   * @api public
   */

  Flag.prototype.emit = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.emit.apply(this.namespace, arguments);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.websocket = WS;

  /**
   * The WebSocket transport uses the HTML5 WebSocket API to establish an
   * persistent connection with the Socket.IO server. This transport will also
   * be inherited by the FlashSocket fallback as it provides a API compatible
   * polyfill for the WebSockets.
   *
   * @constructor
   * @extends {io.Transport}
   * @api public
   */

  function WS (socket) {
    io.Transport.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(WS, io.Transport);

  /**
   * Transport name
   *
   * @api public
   */

  WS.prototype.name = 'websocket';

  /**
   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
   * all the appropriate listeners to handle the responses from the server.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.open = function () {
    var query = io.util.query(this.socket.options.query)
      , self = this
      , Socket


    if (!Socket) {
      Socket = global.MozWebSocket || global.WebSocket;
    }

    this.websocket = new Socket(this.prepareUrl() + query);

    this.websocket.onopen = function () {
      self.onOpen();
      self.socket.setBuffer(false);
    };
    this.websocket.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.websocket.onclose = function () {
      self.onClose();
      self.socket.setBuffer(true);
    };
    this.websocket.onerror = function (e) {
      self.onError(e);
    };

    return this;
  };

  /**
   * Send a message to the Socket.IO server. The message will automatically be
   * encoded in the correct message format.
   *
   * @returns {Transport}
   * @api public
   */

  // Do to a bug in the current IDevices browser, we need to wrap the send in a 
  // setTimeout, when they resume from sleeping the browser will crash if 
  // we don't allow the browser time to detect the socket has been closed
  if (io.util.ua.iDevice) {
    WS.prototype.send = function (data) {
      var self = this;
      setTimeout(function() {
         self.websocket.send(data);
      },0);
      return this;
    };
  } else {
    WS.prototype.send = function (data) {
      this.websocket.send(data);
      return this;
    };
  }

  /**
   * Payload
   *
   * @api private
   */

  WS.prototype.payload = function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      this.packet(arr[i]);
    }
    return this;
  };

  /**
   * Disconnect the established `WebSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.close = function () {
    this.websocket.close();
    return this;
  };

  /**
   * Handle the errors that `WebSocket` might be giving when we
   * are attempting to connect or send messages.
   *
   * @param {Error} e The error.
   * @api private
   */

  WS.prototype.onError = function (e) {
    this.socket.onError(e);
  };

  /**
   * Returns the appropriate scheme for the URI generation.
   *
   * @api private
   */
  WS.prototype.scheme = function () {
    return this.socket.options.secure ? 'wss' : 'ws';
  };

  /**
   * Checks if the browser has support for native `WebSockets` and that
   * it's not the polyfill created for the FlashSocket transport.
   *
   * @return {Boolean}
   * @api public
   */

  WS.check = function () {
    return ('WebSocket' in global && !('__addTask' in WebSocket))
          || 'MozWebSocket' in global;
  };

  /**
   * Check if the `WebSocket` transport support cross domain communications.
   *
   * @returns {Boolean}
   * @api public
   */

  WS.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('websocket');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   *
   * @api public
   */

  exports.XHR = XHR;

  /**
   * XHR constructor
   *
   * @costructor
   * @api public
   */

  function XHR (socket) {
    if (!socket) return;

    io.Transport.apply(this, arguments);
    this.sendBuffer = [];
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(XHR, io.Transport);

  /**
   * Establish a connection
   *
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.open = function () {
    this.socket.setBuffer(false);
    this.onOpen();
    this.get();

    // we need to make sure the request succeeds since we have no indication
    // whether the request opened or not until it succeeded.
    this.setCloseTimeout();

    return this;
  };

  /**
   * Check if we need to send data to the Socket.IO server, if we have data in our
   * buffer we encode it and forward it to the `post` method.
   *
   * @api private
   */

  XHR.prototype.payload = function (payload) {
    var msgs = [];

    for (var i = 0, l = payload.length; i < l; i++) {
      msgs.push(io.parser.encodePacket(payload[i]));
    }

    this.send(io.parser.encodePayload(msgs));
  };

  /**
   * Send data to the Socket.IO server.
   *
   * @param data The message
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.send = function (data) {
    this.post(data);
    return this;
  };

  /**
   * Posts a encoded message to the Socket.IO server.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  function empty () { };

  XHR.prototype.post = function (data) {
    var self = this;
    this.socket.setBuffer(true);

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;
        self.posting = false;

        if (this.status == 200){
          self.socket.setBuffer(false);
        } else {
          self.onClose();
        }
      }
    }

    function onload () {
      this.onload = empty;
      self.socket.setBuffer(false);
    };

    this.sendXHR = this.request('POST');

    if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
      this.sendXHR.onload = this.sendXHR.onerror = onload;
    } else {
      this.sendXHR.onreadystatechange = stateChange;
    }

    this.sendXHR.send(data);
  };

  /**
   * Disconnects the established `XHR` connection.
   *
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.close = function () {
    this.onClose();
    return this;
  };

  /**
   * Generates a configured XHR request
   *
   * @param {String} url The url that needs to be requested.
   * @param {String} method The method the request should use.
   * @returns {XMLHttpRequest}
   * @api private
   */

  XHR.prototype.request = function (method) {
    var req = io.util.request(this.socket.isXDomain())
      , query = io.util.query(this.socket.options.query, 't=' + +new Date);

    req.open(method || 'GET', this.prepareUrl() + query, true);

    if (method == 'POST') {
      try {
        if (req.setRequestHeader) {
          req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        } else {
          // XDomainRequest
          req.contentType = 'text/plain';
        }
      } catch (e) {}
    }

    return req;
  };

  /**
   * Returns the scheme to use for the transport URLs.
   *
   * @api private
   */

  XHR.prototype.scheme = function () {
    return this.socket.options.secure ? 'https' : 'http';
  };

  /**
   * Check if the XHR transports are supported
   *
   * @param {Boolean} xdomain Check if we support cross domain requests.
   * @returns {Boolean}
   * @api public
   */

  XHR.check = function (socket, xdomain) {
    try {
      var request = io.util.request(xdomain),
          usesXDomReq = (global.XDomainRequest && request instanceof XDomainRequest),
          socketProtocol = (socket && socket.options && socket.options.secure ? 'https:' : 'http:'),
          isXProtocol = (global.location && socketProtocol != global.location.protocol);
      if (request && !(usesXDomReq && isXProtocol)) {
        return true;
      }
    } catch(e) {}

    return false;
  };

  /**
   * Check if the XHR transport supports cross domain requests.
   *
   * @returns {Boolean}
   * @api public
   */

  XHR.xdomainCheck = function (socket) {
    return XHR.check(socket, true);
  };

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.htmlfile = HTMLFile;

  /**
   * The HTMLFile transport creates a `forever iframe` based transport
   * for Internet Explorer. Regular forever iframe implementations will 
   * continuously trigger the browsers buzy indicators. If the forever iframe
   * is created inside a `htmlfile` these indicators will not be trigged.
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */

  function HTMLFile (socket) {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(HTMLFile, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  HTMLFile.prototype.name = 'htmlfile';

  /**
   * Creates a new Ac...eX `htmlfile` with a forever loading iframe
   * that can be used to listen to messages. Inside the generated
   * `htmlfile` a reference will be made to the HTMLFile transport.
   *
   * @api private
   */

  HTMLFile.prototype.get = function () {
    this.doc = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
    this.doc.open();
    this.doc.write('<html></html>');
    this.doc.close();
    this.doc.parentWindow.s = this;

    var iframeC = this.doc.createElement('div');
    iframeC.className = 'socketio';

    this.doc.body.appendChild(iframeC);
    this.iframe = this.doc.createElement('iframe');

    iframeC.appendChild(this.iframe);

    var self = this
      , query = io.util.query(this.socket.options.query, 't='+ +new Date);

    this.iframe.src = this.prepareUrl() + query;

    io.util.on(window, 'unload', function () {
      self.destroy();
    });
  };

  /**
   * The Socket.IO server will write script tags inside the forever
   * iframe, this function will be used as callback for the incoming
   * information.
   *
   * @param {String} data The message
   * @param {document} doc Reference to the context
   * @api private
   */

  HTMLFile.prototype._ = function (data, doc) {
    // unescape all forward slashes. see GH-1251
    data = data.replace(/\\\//g, '/');
    this.onData(data);
    try {
      var script = doc.getElementsByTagName('script')[0];
      script.parentNode.removeChild(script);
    } catch (e) { }
  };

  /**
   * Destroy the established connection, iframe and `htmlfile`.
   * And calls the `CollectGarbage` function of Internet Explorer
   * to release the memory.
   *
   * @api private
   */

  HTMLFile.prototype.destroy = function () {
    if (this.iframe){
      try {
        this.iframe.src = 'about:blank';
      } catch(e){}

      this.doc = null;
      this.iframe.parentNode.removeChild(this.iframe);
      this.iframe = null;

      CollectGarbage();
    }
  };

  /**
   * Disconnects the established connection.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  HTMLFile.prototype.close = function () {
    this.destroy();
    return io.Transport.XHR.prototype.close.call(this);
  };

  /**
   * Checks if the browser supports this transport. The browser
   * must have an `Ac...eXObject` implementation.
   *
   * @return {Boolean}
   * @api public
   */

  HTMLFile.check = function (socket) {
    if (typeof window != "undefined" && (['Active'].concat('Object').join('X')) in window){
      try {
        var a = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
        return a && io.Transport.XHR.check(socket);
      } catch(e){}
    }
    return false;
  };

  /**
   * Check if cross domain requests are supported.
   *
   * @returns {Boolean}
   * @api public
   */

  HTMLFile.xdomainCheck = function () {
    // we can probably do handling for sub-domains, we should
    // test that it's cross domain but a subdomain here
    return false;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('htmlfile');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports['xhr-polling'] = XHRPolling;

  /**
   * The XHR-polling transport uses long polling XHR requests to create a
   * "persistent" connection with the server.
   *
   * @constructor
   * @api public
   */

  function XHRPolling () {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(XHRPolling, io.Transport.XHR);

  /**
   * Merge the properties from XHR transport
   */

  io.util.merge(XHRPolling, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  XHRPolling.prototype.name = 'xhr-polling';

  /**
   * Indicates whether heartbeats is enabled for this transport
   *
   * @api private
   */

  XHRPolling.prototype.heartbeats = function () {
    return false;
  };

  /** 
   * Establish a connection, for iPhone and Android this will be done once the page
   * is loaded.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  XHRPolling.prototype.open = function () {
    var self = this;

    io.Transport.XHR.prototype.open.call(self);
    return false;
  };

  /**
   * Starts a XHR request to wait for incoming messages.
   *
   * @api private
   */

  function empty () {};

  XHRPolling.prototype.get = function () {
    if (!this.isOpen) return;

    var self = this;

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;

        if (this.status == 200) {
          self.onData(this.responseText);
          self.get();
        } else {
          self.onClose();
        }
      }
    };

    function onload () {
      this.onload = empty;
      this.onerror = empty;
      self.retryCounter = 1;
      self.onData(this.responseText);
      self.get();
    };

    function onerror () {
      self.retryCounter ++;
      if(!self.retryCounter || self.retryCounter > 3) {
        self.onClose();  
      } else {
        self.get();
      }
    };

    this.xhr = this.request();

    if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
      this.xhr.onload = onload;
      this.xhr.onerror = onerror;
    } else {
      this.xhr.onreadystatechange = stateChange;
    }

    this.xhr.send(null);
  };

  /**
   * Handle the unclean close behavior.
   *
   * @api private
   */

  XHRPolling.prototype.onClose = function () {
    io.Transport.XHR.prototype.onClose.call(this);

    if (this.xhr) {
      this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
      try {
        this.xhr.abort();
      } catch(e){}
      this.xhr = null;
    }
  };

  /**
   * Webkit based browsers show a infinit spinner when you start a XHR request
   * before the browsers onload event is called so we need to defer opening of
   * the transport until the onload event is called. Wrapping the cb in our
   * defer method solve this.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  XHRPolling.prototype.ready = function (socket, fn) {
    var self = this;

    io.util.defer(function () {
      fn.call(self);
    });
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('xhr-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {
  /**
   * There is a way to hide the loading indicator in Firefox. If you create and
   * remove a iframe it will stop showing the current loading indicator.
   * Unfortunately we can't feature detect that and UA sniffing is evil.
   *
   * @api private
   */

  var indicator = global.document && "MozAppearance" in
    global.document.documentElement.style;

  /**
   * Expose constructor.
   */

  exports['jsonp-polling'] = JSONPPolling;

  /**
   * The JSONP transport creates an persistent connection by dynamically
   * inserting a script tag in the page. This script tag will receive the
   * information of the Socket.IO server. When new information is received
   * it creates a new script tag for the new data stream.
   *
   * @constructor
   * @extends {io.Transport.xhr-polling}
   * @api public
   */

  function JSONPPolling (socket) {
    io.Transport['xhr-polling'].apply(this, arguments);

    this.index = io.j.length;

    var self = this;

    io.j.push(function (msg) {
      self._(msg);
    });
  };

  /**
   * Inherits from XHR polling transport.
   */

  io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

  /**
   * Transport name
   *
   * @api public
   */

  JSONPPolling.prototype.name = 'jsonp-polling';

  /**
   * Posts a encoded message to the Socket.IO server using an iframe.
   * The iframe is used because script tags can create POST based requests.
   * The iframe is positioned outside of the view so the user does not
   * notice it's existence.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  JSONPPolling.prototype.post = function (data) {
    var self = this
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (!this.form) {
      var form = document.createElement('form')
        , area = document.createElement('textarea')
        , id = this.iframeId = 'socketio_iframe_' + this.index
        , iframe;

      form.className = 'socketio';
      form.style.position = 'absolute';
      form.style.top = '0px';
      form.style.left = '0px';
      form.style.display = 'none';
      form.target = id;
      form.method = 'POST';
      form.setAttribute('accept-charset', 'utf-8');
      area.name = 'd';
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.prepareUrl() + query;

    function complete () {
      initIframe();
      self.socket.setBuffer(false);
    };

    function initIframe () {
      if (self.iframe) {
        self.form.removeChild(self.iframe);
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
      } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
      }

      iframe.id = self.iframeId;

      self.form.appendChild(iframe);
      self.iframe = iframe;
    };

    initIframe();

    // we temporarily stringify until we figure out how to prevent
    // browsers from turning `\n` into `\r\n` in form inputs
    this.area.value = io.JSON.stringify(data);

    try {
      this.form.submit();
    } catch(e) {}

    if (this.iframe.attachEvent) {
      iframe.onreadystatechange = function () {
        if (self.iframe.readyState == 'complete') {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }

    this.socket.setBuffer(true);
  };

  /**
   * Creates a new JSONP poll that can be used to listen
   * for messages from the Socket.IO server.
   *
   * @api private
   */

  JSONPPolling.prototype.get = function () {
    var self = this
      , script = document.createElement('script')
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.prepareUrl() + query;
    script.onerror = function () {
      self.onClose();
    };

    var insertAt = document.getElementsByTagName('script')[0];
    insertAt.parentNode.insertBefore(script, insertAt);
    this.script = script;

    if (indicator) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  };

  /**
   * Callback function for the incoming message stream from the Socket.IO server.
   *
   * @param {String} data The message
   * @api private
   */

  JSONPPolling.prototype._ = function (msg) {
    this.onData(msg);
    if (this.isOpen) {
      this.get();
    }
    return this;
  };

  /**
   * The indicator hack only works after onload
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  JSONPPolling.prototype.ready = function (socket, fn) {
    var self = this;
    if (!indicator) return fn.call(this);

    io.util.load(function () {
      fn.call(self);
    });
  };

  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */

  JSONPPolling.check = function () {
    return 'document' in global;
  };

  /**
   * Check if cross domain requests are supported
   *
   * @returns {Boolean}
   * @api public
   */

  JSONPPolling.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('jsonp-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

if (typeof define === "function" && define.amd) {
  define([], function () { return io; });
}
})();				
				// } 02.socket-io.js # (12 / 25) 

			
				// # (13 / 25) 02.str.js {

(function(_){

	_.str = {
		css : {
			_ : {
				prefix : '_-',
				sep : '--'
			},
			input : {
				prefix : 'input'
			},
			selected : 'selected',
			wrapper : 'wrapper',
		},
		html : {
			decode : function(string, quote_style){
			  var hash_map = {},
			    symbol = '',
			    tmp_str = '',
			    entity = '';
			  tmp_str = string.toString();
			
			  if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
			    return false;
			  }
			
			  // fix &amp; problem
			  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
			  delete(hash_map['&']);
			  hash_map['&'] = '&amp;';
			
			  for (symbol in hash_map) {
			    entity = hash_map[symbol];
			    tmp_str = tmp_str.split(entity)
			      .join(symbol);
			  }
			  tmp_str = tmp_str.split('&#039;')
			    .join("'");
			
			  return tmp_str;
			},
			encode : function(string, quote_style, charset, double_encode){
			
			  var hash_map = _.str.html.get_html_translation_table('HTML_ENTITIES', quote_style),
			    symbol = '';
			  string = string == null ? '' : string + '';
			
			  if (!hash_map) {
			    return false;
			  }
			
			  if (quote_style && quote_style === 'ENT_QUOTES') {
			    hash_map["'"] = '&#039;';
			  }
			
			  if ( !! double_encode || double_encode == null) {
			    for (symbol in hash_map) {
			      if (hash_map.hasOwnProperty(symbol)) {
			        string = string.split(symbol)
			          .join(hash_map[symbol]);
			      }
			    }
			  } else {
			    string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function(ignore, text, entity) {
			      for (symbol in hash_map) {
			        if (hash_map.hasOwnProperty(symbol)) {
			          text = text.split(symbol)
			            .join(hash_map[symbol]);
			        }
			      }
			
			      return text + entity;
			    });
			  }
			
			  return string;
			},
			get_html_translation_table : function(table, quote_style) {
			    var entities = {},
			        hash_map = {},
			        decimal;
			    var constMappingTable = {},
			        constMappingQuoteStyle = {};
			    var useTable = {},
			        useQuoteStyle = {};
			
			    // Translate arguments
			    constMappingTable[0] = 'HTML_SPECIALCHARS';
			    constMappingTable[1] = 'HTML_ENTITIES';
			    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
			    constMappingQuoteStyle[2] = 'ENT_COMPAT';
			    constMappingQuoteStyle[3] = 'ENT_QUOTES';
			
			    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
			    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
			
			    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
			        throw new Error("Table: " + useTable + ' not supported');
			        // return false;
			    }
			
			    entities['38'] = '&amp;';
			    if (useTable === 'HTML_ENTITIES') {
			        entities['160'] = '&nbsp;';
			        entities['161'] = '&iexcl;';
			        entities['162'] = '&cent;';
			        entities['163'] = '&pound;';
			        entities['164'] = '&curren;';
			        entities['165'] = '&yen;';
			        entities['166'] = '&brvbar;';
			        entities['167'] = '&sect;';
			        entities['168'] = '&uml;';
			        entities['169'] = '&copy;';
			        entities['170'] = '&ordf;';
			        entities['171'] = '&laquo;';
			        entities['172'] = '&not;';
			        entities['173'] = '&shy;';
			        entities['174'] = '&reg;';
			        entities['175'] = '&macr;';
			        entities['176'] = '&deg;';
			        entities['177'] = '&plusmn;';
			        entities['178'] = '&sup2;';
			        entities['179'] = '&sup3;';
			        entities['180'] = '&acute;';
			        entities['181'] = '&micro;';
			        entities['182'] = '&para;';
			        entities['183'] = '&middot;';
			        entities['184'] = '&cedil;';
			        entities['185'] = '&sup1;';
			        entities['186'] = '&ordm;';
			        entities['187'] = '&raquo;';
			        entities['188'] = '&frac14;';
			        entities['189'] = '&frac12;';
			        entities['190'] = '&frac34;';
			        entities['191'] = '&iquest;';
			        entities['192'] = '&Agrave;';
			        entities['193'] = '&Aacute;';
			        entities['194'] = '&Acirc;';
			        entities['195'] = '&Atilde;';
			        entities['196'] = '&Auml;';
			        entities['197'] = '&Aring;';
			        entities['198'] = '&AElig;';
			        entities['199'] = '&Ccedil;';
			        entities['200'] = '&Egrave;';
			        entities['201'] = '&Eacute;';
			        entities['202'] = '&Ecirc;';
			        entities['203'] = '&Euml;';
			        entities['204'] = '&Igrave;';
			        entities['205'] = '&Iacute;';
			        entities['206'] = '&Icirc;';
			        entities['207'] = '&Iuml;';
			        entities['208'] = '&ETH;';
			        entities['209'] = '&Ntilde;';
			        entities['210'] = '&Ograve;';
			        entities['211'] = '&Oacute;';
			        entities['212'] = '&Ocirc;';
			        entities['213'] = '&Otilde;';
			        entities['214'] = '&Ouml;';
			        entities['215'] = '&times;';
			        entities['216'] = '&Oslash;';
			        entities['217'] = '&Ugrave;';
			        entities['218'] = '&Uacute;';
			        entities['219'] = '&Ucirc;';
			        entities['220'] = '&Uuml;';
			        entities['221'] = '&Yacute;';
			        entities['222'] = '&THORN;';
			        entities['223'] = '&szlig;';
			        entities['224'] = '&agrave;';
			        entities['225'] = '&aacute;';
			        entities['226'] = '&acirc;';
			        entities['227'] = '&atilde;';
			        entities['228'] = '&auml;';
			        entities['229'] = '&aring;';
			        entities['230'] = '&aelig;';
			        entities['231'] = '&ccedil;';
			        entities['232'] = '&egrave;';
			        entities['233'] = '&eacute;';
			        entities['234'] = '&ecirc;';
			        entities['235'] = '&euml;';
			        entities['236'] = '&igrave;';
			        entities['237'] = '&iacute;';
			        entities['238'] = '&icirc;';
			        entities['239'] = '&iuml;';
			        entities['240'] = '&eth;';
			        entities['241'] = '&ntilde;';
			        entities['242'] = '&ograve;';
			        entities['243'] = '&oacute;';
			        entities['244'] = '&ocirc;';
			        entities['245'] = '&otilde;';
			        entities['246'] = '&ouml;';
			        entities['247'] = '&divide;';
			        entities['248'] = '&oslash;';
			        entities['249'] = '&ugrave;';
			        entities['250'] = '&uacute;';
			        entities['251'] = '&ucirc;';
			        entities['252'] = '&uuml;';
			        entities['253'] = '&yacute;';
			        entities['254'] = '&thorn;';
			        entities['255'] = '&yuml;';
			    }
			
			    if (useQuoteStyle !== 'ENT_NOQUOTES') {
			        entities['34'] = '&quot;';
			    }
			    if (useQuoteStyle === 'ENT_QUOTES') {
			        entities['39'] = '&#39;';
			    }
			    entities['60'] = '&lt;';
			    entities['62'] = '&gt;';
			
			
			    // ascii decimals to real symbols
			    for (decimal in entities) {
			        if (entities.hasOwnProperty(decimal)) {
			            hash_map[String.fromCharCode(decimal)] = entities[decimal];
			        }
			    }
			
			    return hash_map;
			}
		},
		ucwords : function(str){
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			    return $1.toUpperCase();
			  });
		},
		uniqid : function(prefix, more_entropy) {
		  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +    revised by: Kankrelune (http://www.webfaktory.info/)
		  // %        note 1: Uses an internal counter (in php_js global) to avoid collision
		  // *     example 1: uniqid();
		  // *     returns 1: 'a30285b160c14'
		  // *     example 2: uniqid('foo');
		  // *     returns 2: 'fooa30285b1cd361'
		  // *     example 3: uniqid('bar', true);
		  // *     returns 3: 'bara20285b23dfd1.31879087'
		  if (typeof prefix === 'undefined') {
		    prefix = "";
		  }
		
		  var retId;
		  var formatSeed = function (seed, reqWidth) {
		    seed = parseInt(seed, 10).toString(16); // to hex str
		    if (reqWidth < seed.length) { // so long we split
		      return seed.slice(seed.length - reqWidth);
		    }
		    if (reqWidth > seed.length) { // so short we pad
		      return Array(1 + (reqWidth - seed.length)).join('0') + seed;
		    }
		    return seed;
		  };
		
		  // BEGIN REDUNDANT
		  if (!this.php_js) {
		    this.php_js = {};
		  }
		  // END REDUNDANT
		  if (!this.php_js.uniqidSeed) { // init seed with big random int
		    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
		  }
		  this.php_js.uniqidSeed++;
		
		  retId = prefix; // start with prefix, add current milliseconds hex string
		  retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
		  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
		  if (more_entropy) {
		    // for more entropy we add a float lower to 10
		    retId += (Math.random() * 10).toFixed(8).toString();
		  }
		
		  return retId;
		}
	};
	
})(_);

/* prototype mods { */

if (typeof String.prototype.startsWith != 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function (str){
		return this.indexOf(str) == 0;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}
/* } prototype mods */
				
				// } 02.str.js # (13 / 25) 

			
				// # (14 / 25) 03._.linked-list.js {

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
				// } 03._.linked-list.js # (14 / 25) 

			
				// # (15 / 25) 03._.linked-list.node.js {

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
				// } 03._.linked-list.node.js # (15 / 25) 

			
				// # (16 / 25) 03._.router.js {

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
				// } 03._.router.js # (16 / 25) 

			
				// # (17 / 25) 03.google.maps.infobox.js {

/**
 * @name InfoBox
 * @version 1.1.13 [March 19, 2014]
 * @author Gary Little (inspired by proof-of-concept code from Pamela Fox of Google)
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
 * @fileoverview InfoBox extends the Google Maps JavaScript API V3 <tt>OverlayView</tt> class.
 *  <p>
 *  An InfoBox behaves like a <tt>google.maps.InfoWindow</tt>, but it supports several
 *  additional properties for advanced styling. An InfoBox can also be used as a map label.
 *  <p>
 *  An InfoBox also fires the same events as a <tt>google.maps.InfoWindow</tt>.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global google */

/**
 * @name InfoBoxOptions
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} [disableAutoPan=false] Disable auto-pan on <tt>open</tt>.
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} [boxClass="infoBox"] The name of the CSS class defining the styles for the InfoBox container.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} [isHidden=false] Hide the InfoBox on <tt>open</tt>.
 *  [Deprecated in favor of the <tt>visible</tt> property.]
 * @property {boolean} [visible=true] Show the InfoBox on <tt>open</tt>.
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, mousemove, mouseover, mouseout,
 *  mouseup, click, dblclick, touchstart, touchend, touchmove, and contextmenu events in the InfoBox
 *  (default is <tt>false</tt> to mimic the behavior of a <tt>google.maps.InfoWindow</tt>). Set
 *  this property to <tt>true</tt> if the InfoBox is being used as a map label.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {InfoBoxOptions} [opt_opts]
 */
function InfoBox(opt_opts) {

  opt_opts = opt_opts || {};

  google.maps.OverlayView.apply(this, arguments);

  // Standard options (in common with google.maps.InfoWindow):
  //
  this.content_ = opt_opts.content || "";
  this.disableAutoPan_ = opt_opts.disableAutoPan || false;
  this.maxWidth_ = opt_opts.maxWidth || 0;
  this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
  this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
  this.zIndex_ = opt_opts.zIndex || null;

  // Additional options (unique to InfoBox):
  //
  this.boxClass_ = opt_opts.boxClass || "infoBox";
  this.boxStyle_ = opt_opts.boxStyle || {};
  this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
  this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
  if (opt_opts.closeBoxURL === "") {
    this.closeBoxURL_ = "";
  }
  this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);

  if (typeof opt_opts.visible === "undefined") {
    if (typeof opt_opts.isHidden === "undefined") {
      opt_opts.visible = true;
    } else {
      opt_opts.visible = !opt_opts.isHidden;
    }
  }
  this.isHidden_ = !opt_opts.visible;

  this.alignBottom_ = opt_opts.alignBottom || false;
  this.pane_ = opt_opts.pane || "floatPane";
  this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;

  this.div_ = null;
  this.closeListener_ = null;
  this.moveListener_ = null;
  this.contextListener_ = null;
  this.eventListeners_ = null;
  this.fixedWidthSet_ = null;
}

/* InfoBox extends OverlayView in the Google Maps API v3.
 */
InfoBox.prototype = new google.maps.OverlayView();

/**
 * Creates the DIV representing the InfoBox.
 * @private
 */
InfoBox.prototype.createInfoBoxDiv_ = function () {

  var i;
  var events;
  var bw;
  var me = this;

  // This handler prevents an event in the InfoBox from being passed on to the map.
  //
  var cancelHandler = function (e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  };

  // This handler ignores the current event in the InfoBox and conditionally prevents
  // the event from being passed on to the map. It is used for the contextmenu event.
  //
  var ignoreHandler = function (e) {

    e.returnValue = false;

    if (e.preventDefault) {

      e.preventDefault();
    }

    if (!me.enableEventPropagation_) {

      cancelHandler(e);
    }
  };

  if (!this.div_) {

    this.div_ = document.createElement("div");

    this.setBoxStyle_();

    if (typeof this.content_.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(this.content_);
    }

    // Add the InfoBox DIV to the DOM
    this.getPanes()[this.pane_].appendChild(this.div_);

    this.addClickHandler_();

    if (this.div_.style.width) {

      this.fixedWidthSet_ = true;

    } else {

      if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

        this.div_.style.width = this.maxWidth_;
        this.div_.style.overflow = "auto";
        this.fixedWidthSet_ = true;

      } else { // The following code is needed to overcome problems with MSIE

        bw = this.getBoxWidths_();

        this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
        this.fixedWidthSet_ = false;
      }
    }

    this.panBox_(this.disableAutoPan_);

    if (!this.enableEventPropagation_) {

      this.eventListeners_ = [];

      // Cancel event propagation.
      //
      // Note: mousemove not included (to resolve Issue 152)
      events = ["mousedown", "mouseover", "mouseout", "mouseup",
      "click", "dblclick", "touchstart", "touchend", "touchmove"];

      for (i = 0; i < events.length; i++) {

        this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
      }
      
      // Workaround for Google bug that causes the cursor to change to a pointer
      // when the mouse moves over a marker underneath InfoBox.
      this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
        this.style.cursor = "default";
      }));
    }

    this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

    /**
     * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
     * @name InfoBox#domready
     * @event
     */
    google.maps.event.trigger(this, "domready");
  }
};

/**
 * Returns the HTML <IMG> tag for the close box.
 * @private
 */
InfoBox.prototype.getCloseBoxImg_ = function () {

  var img = "";

  if (this.closeBoxURL_ !== "") {

    img  = "<img";
    img += " src='" + this.closeBoxURL_ + "'";
    img += " align=right"; // Do this because Opera chokes on style='float: right;'
    img += " style='";
    img += " position: relative;"; // Required by MSIE
    img += " cursor: pointer;";
    img += " margin: " + this.closeBoxMargin_ + ";";
    img += "'>";
  }

  return img;
};

/**
 * Adds the click handler to the InfoBox close box.
 * @private
 */
InfoBox.prototype.addClickHandler_ = function () {

  var closeBox;

  if (this.closeBoxURL_ !== "") {

    closeBox = this.div_.firstChild;
    this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_());

  } else {

    this.closeListener_ = null;
  }
};

/**
 * Returns the function to call when the user clicks the close box of an InfoBox.
 * @private
 */
InfoBox.prototype.getCloseClickHandler_ = function () {

  var me = this;

  return function (e) {

    // 1.0.3 fix: Always prevent propagation of a close box click to the map:
    e.cancelBubble = true;

    if (e.stopPropagation) {

      e.stopPropagation();
    }

    /**
     * This event is fired when the InfoBox's close box is clicked.
     * @name InfoBox#closeclick
     * @event
     */
    google.maps.event.trigger(me, "closeclick");

    me.close();
  };
};

/**
 * Pans the map so that the InfoBox appears entirely within the map's visible area.
 * @private
 */
InfoBox.prototype.panBox_ = function (disablePan) {

  var map;
  var bounds;
  var xOffset = 0, yOffset = 0;

  if (!disablePan) {

    map = this.getMap();

    if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama

      if (!map.getBounds().contains(this.position_)) {
      // Marker not in visible area of map, so set center
      // of map to the marker position first.
        map.setCenter(this.position_);
      }

      bounds = map.getBounds();

      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var iwOffsetX = this.pixelOffset_.width;
      var iwOffsetY = this.pixelOffset_.height;
      var iwWidth = this.div_.offsetWidth;
      var iwHeight = this.div_.offsetHeight;
      var padX = this.infoBoxClearance_.width;
      var padY = this.infoBoxClearance_.height;
      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

      if (pixPosition.x < (-iwOffsetX + padX)) {
        xOffset = pixPosition.x + iwOffsetX - padX;
      } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
        xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
      }
      if (this.alignBottom_) {
        if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
          yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
        } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
        }
      } else {
        if (pixPosition.y < (-iwOffsetY + padY)) {
          yOffset = pixPosition.y + iwOffsetY - padY;
        } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
        }
      }

      if (!(xOffset === 0 && yOffset === 0)) {

        // Move the map to the shifted center.
        //
        var c = map.getCenter();
        map.panBy(xOffset, yOffset);
      }
    }
  }
};

/**
 * Sets the style of the InfoBox by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
InfoBox.prototype.setBoxStyle_ = function () {

  var i, boxStyle;

  if (this.div_) {

    // Apply style values from the style sheet defined in the boxClass parameter:
    this.div_.className = this.boxClass_;

    // Clear existing inline style values:
    this.div_.style.cssText = "";

    // Apply style values defined in the boxStyle parameter:
    boxStyle = this.boxStyle_;
    for (i in boxStyle) {

      if (boxStyle.hasOwnProperty(i)) {

        this.div_.style[i] = boxStyle[i];
      }
    }

    // Fix for iOS disappearing InfoBox problem.
    // See http://stackoverflow.com/questions/9229535/google-maps-markers-disappear-at-certain-zoom-level-only-on-iphone-ipad
    this.div_.style.WebkitTransform = "translateZ(0)";

    // Fix up opacity style for benefit of MSIE:
    //
    if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {
      // See http://www.quirksmode.org/css/opacity.html
      this.div_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this.div_.style.opacity * 100) + ")\"";
      this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
    }

    // Apply required styles:
    //
    this.div_.style.position = "absolute";
    this.div_.style.visibility = 'hidden';
    if (this.zIndex_ !== null) {

      this.div_.style.zIndex = this.zIndex_;
    }
  }
};

/**
 * Get the widths of the borders of the InfoBox.
 * @private
 * @return {Object} widths object (top, bottom left, right)
 */
InfoBox.prototype.getBoxWidths_ = function () {

  var computedStyle;
  var bw = {top: 0, bottom: 0, left: 0, right: 0};
  var box = this.div_;

  if (document.defaultView && document.defaultView.getComputedStyle) {

    computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

    if (computedStyle) {

      // The computed styles are always in pixel units (good!)
      bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
    }

  } else if (document.documentElement.currentStyle) { // MSIE

    if (box.currentStyle) {

      // The current styles may not be in pixel units, but assume they are (bad!)
      bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
    }
  }

  return bw;
};

/**
 * Invoked when <tt>close</tt> is called. Do not call it directly.
 */
InfoBox.prototype.onRemove = function () {

  if (this.div_) {

    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/**
 * Draws the InfoBox based on the current map projection and zoom level.
 */
InfoBox.prototype.draw = function () {

  this.createInfoBoxDiv_();

  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

  this.div_.style.left = (pixPosition.x + this.pixelOffset_.width) + "px";
  
  if (this.alignBottom_) {
    this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
  } else {
    this.div_.style.top = (pixPosition.y + this.pixelOffset_.height) + "px";
  }

  if (this.isHidden_) {

    this.div_.style.visibility = "hidden";

  } else {

    this.div_.style.visibility = "visible";
  }
};

/**
 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
 *  is <tt>open</tt>ed.
 * @param {InfoBoxOptions} opt_opts
 */
InfoBox.prototype.setOptions = function (opt_opts) {
  if (typeof opt_opts.boxClass !== "undefined") { // Must be first

    this.boxClass_ = opt_opts.boxClass;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.boxStyle !== "undefined") { // Must be second

    this.boxStyle_ = opt_opts.boxStyle;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.content !== "undefined") {

    this.setContent(opt_opts.content);
  }
  if (typeof opt_opts.disableAutoPan !== "undefined") {

    this.disableAutoPan_ = opt_opts.disableAutoPan;
  }
  if (typeof opt_opts.maxWidth !== "undefined") {

    this.maxWidth_ = opt_opts.maxWidth;
  }
  if (typeof opt_opts.pixelOffset !== "undefined") {

    this.pixelOffset_ = opt_opts.pixelOffset;
  }
  if (typeof opt_opts.alignBottom !== "undefined") {

    this.alignBottom_ = opt_opts.alignBottom;
  }
  if (typeof opt_opts.position !== "undefined") {

    this.setPosition(opt_opts.position);
  }
  if (typeof opt_opts.zIndex !== "undefined") {

    this.setZIndex(opt_opts.zIndex);
  }
  if (typeof opt_opts.closeBoxMargin !== "undefined") {

    this.closeBoxMargin_ = opt_opts.closeBoxMargin;
  }
  if (typeof opt_opts.closeBoxURL !== "undefined") {

    this.closeBoxURL_ = opt_opts.closeBoxURL;
  }
  if (typeof opt_opts.infoBoxClearance !== "undefined") {

    this.infoBoxClearance_ = opt_opts.infoBoxClearance;
  }
  if (typeof opt_opts.isHidden !== "undefined") {

    this.isHidden_ = opt_opts.isHidden;
  }
  if (typeof opt_opts.visible !== "undefined") {

    this.isHidden_ = !opt_opts.visible;
  }
  if (typeof opt_opts.enableEventPropagation !== "undefined") {

    this.enableEventPropagation_ = opt_opts.enableEventPropagation;
  }

  if (this.div_) {

    this.draw();
  }
};

/**
 * Sets the content of the InfoBox.
 *  The content can be plain text or an HTML DOM node.
 * @param {string|Node} content
 */
InfoBox.prototype.setContent = function (content) {
  this.content_ = content;

  if (this.div_) {

    if (this.closeListener_) {

      google.maps.event.removeListener(this.closeListener_);
      this.closeListener_ = null;
    }

    // Odd code required to make things work with MSIE.
    //
    if (!this.fixedWidthSet_) {

      this.div_.style.width = "";
    }

    if (typeof content.nodeType === "undefined") {
      this.div_.innerHTML = this.getCloseBoxImg_() + content;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(content);
    }

    // Perverse code required to make things work with MSIE.
    // (Ensures the close box does, in fact, float to the right.)
    //
    if (!this.fixedWidthSet_) {
      this.div_.style.width = this.div_.offsetWidth + "px";
      if (typeof content.nodeType === "undefined") {
        this.div_.innerHTML = this.getCloseBoxImg_() + content;
      } else {
        this.div_.innerHTML = this.getCloseBoxImg_();
        this.div_.appendChild(content);
      }
    }

    this.addClickHandler_();
  }

  /**
   * This event is fired when the content of the InfoBox changes.
   * @name InfoBox#content_changed
   * @event
   */
  google.maps.event.trigger(this, "content_changed");
};

/**
 * Sets the geographic location of the InfoBox.
 * @param {LatLng} latlng
 */
InfoBox.prototype.setPosition = function (latlng) {

  this.position_ = latlng;

  if (this.div_) {

    this.draw();
  }

  /**
   * This event is fired when the position of the InfoBox changes.
   * @name InfoBox#position_changed
   * @event
   */
  google.maps.event.trigger(this, "position_changed");
};

/**
 * Sets the zIndex style for the InfoBox.
 * @param {number} index
 */
InfoBox.prototype.setZIndex = function (index) {

  this.zIndex_ = index;

  if (this.div_) {

    this.div_.style.zIndex = index;
  }

  /**
   * This event is fired when the zIndex of the InfoBox changes.
   * @name InfoBox#zindex_changed
   * @event
   */
  google.maps.event.trigger(this, "zindex_changed");
};

/**
 * Sets the visibility of the InfoBox.
 * @param {boolean} isVisible
 */
InfoBox.prototype.setVisible = function (isVisible) {

  this.isHidden_ = !isVisible;
  if (this.div_) {
    this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible");
  }
};

/**
 * Returns the content of the InfoBox.
 * @returns {string}
 */
InfoBox.prototype.getContent = function () {

  return this.content_;
};

/**
 * Returns the geographic location of the InfoBox.
 * @returns {LatLng}
 */
InfoBox.prototype.getPosition = function () {

  return this.position_;
};

/**
 * Returns the zIndex for the InfoBox.
 * @returns {number}
 */
InfoBox.prototype.getZIndex = function () {

  return this.zIndex_;
};

/**
 * Returns a flag indicating whether the InfoBox is visible.
 * @returns {boolean}
 */
InfoBox.prototype.getVisible = function () {

  var isVisible;

  if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
    isVisible = false;
  } else {
    isVisible = !this.isHidden_;
  }
  return isVisible;
};

/**
 * Shows the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.show = function () {

  this.isHidden_ = false;
  if (this.div_) {
    this.div_.style.visibility = "visible";
  }
};

/**
 * Hides the InfoBox. [Deprecated; use <tt>setVisible</tt> instead.]
 */
InfoBox.prototype.hide = function () {

  this.isHidden_ = true;
  if (this.div_) {
    this.div_.style.visibility = "hidden";
  }
};

/**
 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
 *  anchor is dragged to a new location, the InfoBox moves as well.
 * @param {Map|StreetViewPanorama} map
 * @param {MVCObject} [anchor]
 */
InfoBox.prototype.open = function (map, anchor) {

  var me = this;

  if (anchor) {

    this.position_ = anchor.getPosition();
    this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
      me.setPosition(this.getPosition());
    });
  }

  this.setMap(map);

  if (this.div_) {

    this.panBox_();
  }
};

/**
 * Removes the InfoBox from the map.
 */
InfoBox.prototype.close = function () {

  var i;

  if (this.closeListener_) {

    google.maps.event.removeListener(this.closeListener_);
    this.closeListener_ = null;
  }

  if (this.eventListeners_) {
    
    for (i = 0; i < this.eventListeners_.length; i++) {

      google.maps.event.removeListener(this.eventListeners_[i]);
    }
    this.eventListeners_ = null;
  }

  if (this.moveListener_) {

    google.maps.event.removeListener(this.moveListener_);
    this.moveListener_ = null;
  }

  if (this.contextListener_) {

    google.maps.event.removeListener(this.contextListener_);
    this.contextListener_ = null;
  }

  this.setMap(null);
};				
				// } 03.google.maps.infobox.js # (17 / 25) 

			
				// # (18 / 25) 04._.geo.js {

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
				
				// } 04._.geo.js # (18 / 25) 

			
				// # (19 / 25) 04._.layer.js {

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
				
				// } 04._.layer.js # (19 / 25) 

			
				// # (20 / 25) 04._.window.js {

(function(_, $){

	var __class = {
		_ : 'Window',
		parents : ['_']
	};

	_._.add({
		_class : __class,
		constructor : function(args){
		
			if(!(args && args.noInit)){
				_._.parentConstruct(this,arguments,__class);	
			}

			var _t = this;
			this._id = __class._;
			this._cmd = 'window';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			this.uuid = '';
				
			this.window = (args ? args.w || args.window : false) || window;

			this.width = this.height = this.ratio = 0;
			this.wider = this.taller = this.square = false;
			
			this.attrs = {
				width : null,
				height	: null,
				ratio : null,
				ratio_round : null,
				wider : null,
				taller : null
			};
			
			this.cursor = false;
			
			this.ratios = {
				narrow : .5,
				skinny : .6,
				thin : .75,
				sq : 1,
				eq : 1.25,
				normal : 1.33,
				wide : 1.5,
				fat : 1.95,
				obese : 2,
				_wider : false,
				_taller : false,
				_square : false
			};
			
			this.ratios_current = {};
			
			this.uuid = '';
			
			this.clouds = {
				_ : function(hash,url){ // internal router for echo
					_.log(this._id + '[clouds]',this,hash);
					var fn = hash.shift();
					
					if(!hash.length){
						hash = false;
					}
					
					if(this.clouds[fn]){
						this.clouds[fn].call(this,{hash : hash});
					}
				},
				num : 0,
				time : 10000,
				wrapper : false,
				canvas : false,
				intervals : {
					spawn : [],
					tick : []
				},
				
				kill : function(args){
					_.log(this._id + '[clouds][*kill]',this.clouds.wrapper,this.clouds.canvas);
					
					for(var i in this.clouds.intervals){
						if(this.clouds.intervals.hasOwnProperty(i)){
							while(this.clouds.intervals[i] && this.clouds.intervals[i].length){
								clearInterval(this.clouds.intervals[i].shift());
							}
						}
					}
					
					$(this.clouds.wrapper).remove();
					this.clouds.wrapper = false;
					
					$(this.clouds.canvas).children().appendTo('body');
					$(this.clouds.canvas).remove();
					this.clouds.canvas = false;
				},
				
				move : function(icon,pole){
				
					pole = pole || {
						left : 1,
						top : 1
					};
								
					var dir = Math.floor((Math.random()*4)),
						opac = ((Math.random() * 50)+50)/100;
					
					var pos = {
						top : (icon.style.top!=='' ? parseInt(icon.style.top) : (Math.random()*100)),
	//							right : parseInt($(icon).css('right')),
	//							bottom : parseInt($(icon).css('bottom')),
						left : (icon.style.left!=='' ? parseInt(icon.style.left) : (Math.random()*100))
					},
					pos_unit = '%';
						
					var delta = (Math.random()*20);
					var sign = Math.floor(Math.random()*2);
					
					if(sign === 0){
						pole.left = 1;
						pole.top = 1;
					}else{
						pole.left = -1;
						pole.top = -1;
					}
					
					if(icon.style.top === '' && icon.style.left === ''){
						$(icon).css({
							top : pos.top + pos_unit,
							left : pos.left + pos_unit
						});
						
						_.log(this._id + '[clouds][move][init]',(pos.top + pos_unit),icon.style.top,icon.style.left);
						
						return true;
					}
					
					var cloud_id = icon.className.split(' ');
					cloud_id = cloud_id[cloud_id.length - 1];
					
					_.log(this._id + '[clouds][move][*move]',cloud_id,(icon.style.top === ''), sign,pole,pos,delta,(pos.top + delta) + pos_unit);
					
	//						return;
	
					if(pos.left >= 100){ // moved all the way right, left's move back left
						pole.left = -1;
					}else if(pos.left <= 0){
						pole.left = 1;
					}
					
					if(pos.top >= 100){ // gone
						pole.top = -1;
					}else if(pos.top <= 0){
						pole.top = 1;
					}
					
					if(dir == 0){ // top
						$(icon).css('top', (pos.top + pole.top*delta/2) + pos_unit);
					}else if(dir == 1){ //right
						$(icon).css('left', (pos.left + pole.left*delta) + pos_unit);
					}else if(dir == 2){ //bottom
						$(icon).css('top', (pos.top - pole.top*delta/2) + pos_unit);
					}else if(dir == 3){ //left
	//							$(icon).css('left', (pos.left - delta) + pos_unit);
						$(icon).css('left', (pos.left + pole.left*delta) + pos_unit);
					}
					
					$(icon).css('opacity',opac);
					
					icon.setAttribute(this.clouds.pole.attr+'-top', pole.top);
					icon.setAttribute(this.clouds.pole.attr+'-left', pole.left);
				
				},
				pole : {
					_ : {
						top : 1,
						left : 1
					},
					attr : 'data-pole'
				},
				reset : function(args){

					var _t = this;
					
					_.log(this._id + '[clouds][*reset]',_t,$(this.clouds.wrapper).find('._-icon--cloud'));
					
					if(this.clouds.wrapper){
						$(this.clouds.wrapper).find('._-icon--cloud').css('opacity',0);
					}
					
					while(this.clouds.intervals.tick && this.clouds.intervals.tick.length){
						clearInterval(this.clouds.intervals.tick.shift());
					}
					
					setTimeout(function(){

						if(_t.clouds.wrapper){
							$(_t.clouds.wrapper).find('._-icon--cloud').remove();
						}
					
					}, 10000);
					
					
				},
				start : function(args){
					var _t = this;
					
					_.log(this._id + '[clouds][*start]',_t);
					
					$('._-icon--cloud').each(function(i, ele){
						_t.clouds.tick.call(_t,i,ele);
					});
					
					this.clouds.intervals.spawn.push(
						setInterval(function(){
							_t.clouds.spawn.call(_t);
						}, this.clouds.time * 1.5)
					);
					
					this.clouds.spawn.call(this);

				},
				spawn : function(args){
					var num = 0;
					
					if(args && args.hash && (num = parseInt(args.hash.shift()))){
						if(num > 0){
							for(var i=0; i<num; i++){
								this.clouds.spawn.call(this);
							}
						}
					}

					var icon = $('<a class="_-icon _-icon--cloud _-icon--cloud--' + this.clouds.num + '"><span class="_-icon--shadow"></span><span class="_-shape _-shape--cir _-shape--cir--1"></span><span class="_-shape _-shape--cir _-shape--cir--2"></span><span class="_-shape _-shape--cir _-shape--cir--3"></span></a>')[0];
					
					if(!(this.clouds.canvas = $('body > ._-canvas').get(0))){
						this.clouds.canvas = $('<div class="_-canvas" style="position:fixed;top:0;right:0;bottom:0;left:0;z-index:200;"></div>')[0];
						
						$('body > *').appendTo(this.clouds.canvas);						
						$('body').append(this.clouds.canvas);
					}				
					
					
					if(!(this.clouds.wrapper = $('body > ._-icon--clouds--wrapper').get(0))){
						this.clouds.wrapper = $('<div class="_-icon--clouds--wrapper" style="position:fixed;top:0;right:0;bottom:0;left:0;z-index:1;"></div>')[0];
						$('body').append(this.clouds.wrapper);
					}
						
					$(this.clouds.wrapper).append(icon);
					
					this.clouds.tick.call(this,-1,icon);
					
					_.log(this._id + '[clouds][*spawn]',this,icon,this.clouds.wrapper);
					
				},
				tick : function(i, ele){ // typically called during jq foreach
				
					this.clouds.num++;
	
					var icon = ele,
						_t = this;
					
					$(icon).on({
						dblclick : function(e){
							_.log('cloud[*kill][single]',e);
							var ele = e.currentTarget || e;
							
							$(ele).remove();
						}
					})/*.draggable({
						stop : function(e, ui){
							var parent = this.parentNode;
							
							$(this).css("left",parseInt($(this).css("left")) / ($(parent).width() / 100)+"%");
							$(this).css("top",parseInt($(this).css("top")) / ($(parent).height() / 100)+"%");
						}
					})*/;
	
					
					var pole = {
						top : 1,
						left : 1
					};
					
					if(icon.hasAttribute(this.clouds.pole.attr+'-top')){
						pole.top = parseInt(icon.getAttribute(_attr+'-top'));
					}
					
					if(icon.hasAttribute(this.clouds.pole.attr+'-left')){
						pole.top = parseInt(icon.getAttribute(this.clouds.pole.attr+'-left'));
					}
					
					_.log('cloud[tick]',this,icon,icon.style.top);
					
					this.clouds.intervals.tick.push(
						setInterval(function(){
							_t.clouds.move.call(_t,icon,pole);
						}, this.clouds.time)
					);
				
					this.clouds.move.call(this,icon,pole);			
					
				}
			};
			
			this.echo = {
				_ : function(hash,url){ // internal router for echo
					_.log(this._id + '[echo][route]',hash);
					var fn = hash.shift();
					if(this.echo[fn]){
						this.echo[fn].call(this,{hash : hash});
					}
				},
				connect : function(tio){
					tio = tio || io;
					
					var _t = (this instanceof _._.Window ? this : _.window);
					
					if(tio && tio.connect){
						_.log(this._id + '[echo][connect]',tio);
		//				_.socket.node = io.connect('http://'+window.location.hostname+':1337');				
						_.socket.node = io.connect('http://dev.numonium.com:1337');
						
						_.socket.node.on('event', function(e){
							_t.echo.e.call(_t,e);
						});
						
						return true;
					}
					
					return false;
				},
				e : function(e){
					if(!e){
						return false;
					}
					_.log(this._id + '[echo][e]',e);
					if(e.start){
						this.echo.uuid = e.start;
						_.log(this._id + '[echo][*uuid]',this.echo.uuid);
					}else if(e.view){
						_.log(this._id + '[echo][*view]',e.view);	
						return this.echo.replay.call(this,e.view);
					}
					return true;
				},
				replay : function(e){
					_.log(this._id + '[echo][*replay]',e.type);
					
					var ele = false;
					if(e.type){
						if(e.type == 'mousemove'){
							if(!this.cursor){
								this.cursor = document.createElement('div');
								this.cursor.setAttribute('class', '_-window--cursor');
								
								$(this.cursor).css({
									position : 'fixed',
									background : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAtCAYAAADP5GkqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NDkyNmVkMy03OTJmLTQ3NDktYTVhOC04YzI1OWU4YWMwNzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ5MzY3QjA4RUYzMTFFM0FFMTBGMkM3OEYyMzA4MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTdFNTM2MjY4OUY2MTFFM0FFMTBGMkM3OEYyMzA4MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5MjZlZDMtNzkyZi00NzQ5LWE1YTgtOGMyNTllOGFjMDc2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc0OTI2ZWQzLTc5MmYtNDc0OS1hNWE4LThjMjU5ZThhYzA3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvmUwJEAAAT1SURBVHja7FhJSCxnEP7nzbjMqDhuY3w+MeO8cYnrKLgEXNCgXnyYoCQHDx4kp3iQBNxOvosScDnoSYOgooIaQcQICjqLOhqjRkFwPwRUiKJRjFvGTtWf7qHd5k3P8rykoKZ7/v676qv6q+qvv0UMw5CXpFfkhenFAUj4f0QikfkWmOFdHU7c0j/pgcTExAiNRhPJA+E8QiQcczQyMvL96enptr+/v9OWitP5UDC1dnd3d8Pb21s1MTExq1KpcOjOWfHypNC7uzs6npCQkDY0NKSD2HB3FogPCoyPj08fHx//xdXVVeoMEBaFbW1tkYWFBZKbm5s1NjY2CUOujgZhUdDq6ipJTU0lGxsbJCcn5/O5uTmji4uLzJEgLAoJCQmhkYogdnZ28KrR6XR6T09PP0eBsEoApCTJyMjgQCROAnl5efk6AoTVL+/v71NPYFykpKQkTE9P6zw8POwGIejFo6MjVE7W1tawWkZDTMzI5fJP7AEh+KWTkxOSmZlJAzQ2NjZSq9VO+/j4vLYVhE2oEUR6ejpZWloicXFxEXq9fgpABNoCwua1Ozs7o4GJdSI6Ojp8dnZWD3tHkFAQdkXwxcUFycrKIvPz8yQyMlJtMBj0AQEBwUJA2J3Hl5eX1BPgARIREaGCwDQEBgZaDcIh1ezm5oZ6AgKSwO75KXjEGBwcrLQGhMNq+u3tLZZrMjU1RUJDQ9/MzMxooZK+ZUGIPkpPaDKZSHZ2NgciBDwxA9e3bGf16qM1pQhidHSUBAUFKVZWVn5Vq9XhrCfEDgcAfQKRSCSPxgsKCkhHRweBSik3Go1zMTEx8eikhzol9gIA60hfXx+tC9fX10QmkxE3Nzeyt7dHxOL/DPYFgvKtLS4u/mJwcHCR9YTpqaaUBktTU9M7+M/AGjLs+plZqVQyYNS9sYGBAYalf4BvmWcIAtWUlpaWw9cryANRUVFkfX2dVFRUkJaWFvN4VVUVKSwsxKUQFxUVNULP8BsEny/0libOKFB+A97yhf5Saqktf9YDSUlJDOwB1JLl5eVHnqmvr6fPYDlGWNEytoVz5zGSGz4z67QEAKoaFQ5bMHN1dcW5kV7Ly8vvAYA2njk4OKDP8vLyvnomyEXcmFUAwBoGyisD+U0Ft7e3a/Pz83/Ee2hQHsVCdXU1nbe4uPg7/JdaczCxCABaMebw8JAKHR4exuhNBQ7q7++fxLHa2tp7ACAlGWhg6fySkpJvWV1imwFwBJ6Yg+EkYAU+T05OLsBxXBYItnsgSktL6Tubm5s7UqnU3y4PIPX09BjwfILpzAYQXUNYDpp7jY2NjwISqh99t6am5v1zBe9ZAHhE7+zs/BIFdHV1TcNYOGu5O19AWFhYKky5wXkYJ3wAkOsUwPn5+TF0Sm8Ee6C5ufk7qFh6PBoAB7KW88kFf8D6n1BRb2/vo4yASkhBdHd3dwoBQMnPz08JfT+2V95PKOfP+ww65T9RERQpqry1tdWcqkjHx8d/KRQKtRAAYpYlH9grsMiQysrK92zqMdvb22bFkEFXdXV1P4Mh+TDt9UNZFj0ghOBwEgaK/+AUQ/llGhoaxiAl32HKoqOAvR42JY4CQK0qKyv7AZW3tbVNQNB9w8YOBq5caB2whcTQhKo1Gs3XcI+fUwIsKX4IQMRXzPtKJvRsIWYzwAP4b9z8rP1KJvr/S+lLA/hXgAEAcH+o0qfpzIcAAAAASUVORK5CYII=')",
									width : '32px',
									height : '45px'
								});
								
								this.cursor.style.background = 
								document.getElementsByTagName('body')[0].appendChild(this.cursor);
							}
							
							if(e.relX){
								this.cursor.style.left = e.relX * this.width + 'px';						
							}else{
								this.cursor.style.left = e.pageX + 'px';
							}
							if(e.relY){
								this.cursor.style.top = e.relY * this.height + 'px';					
							}else{
								this.cursor.style.top = e.pageY + 'px';
							}
							_.log(this._id + '[echo][*replay]['+e.type+']',this.cursor,e.relX * this.width,e.pageX,e.relY * this.height,e.pageY);
						}	
					}
					
					if(e.target){
						if(e.target.attributes && (ele = _.find({attrs : e.target.attributes}))){
							if(e.type && e.type=='click'){
								_.log(this._id + '[echo][replay][click]',ele);
								$(ele).click();
							}else if(e.type && e.type=='focus'){
								_.log(this._id + '[echo][replay][focus]',ele);
								$(ele).focus();
							}
							if(e.value){
								_.log(this._id + '[echo][replay][value]',e.value,ele );
								$(ele).val(e.value).change();
							}
						}
					}		
				},
				start : function(args){
					if(!args){
						_.log('err - ' + this._id +'[echo][start] - no args',args);
						return false;
					}
					
					var _t = this; //abstract for jquery
					
					_.log('Window[echo][start]',this);
					
					if(this.echo.connect.call(this,io)){				
						_.socket.node.emit('event',{server : 'start'});
						
						$(window).on(_.e.str,'','',function(e){
							var packet = {},
								fields = [ 'type', 'timeStamp', 'clientX', 'clientY', 'pageX', 'pageY', 'offsetX', 'offsetY', 'screenX', 'screenY', 'altKey', 'ctrlKey', 'shiftKey', 'button', 'buttons', 'cancelable', 'bubbles', 'eventPhase', 'attrChange', 'attrName','key','keyCode','metaKey'];
							
							for(var i=0; i<fields.length; i++){
								if(typeof e[fields[i]] !== 'undefined'){
									packet[fields[i]] = e[fields[i]];
								}
							}
							
							if(e.target){
								if(!packet.target || packet.target == ''){
									packet.target = { attributes : {} };
								}
								if(e.target.attributes){
									var find = {attrs : {}};
									for(var i in e.target.attributes){
										if(e.target.attributes[i].nodeName){
											packet.target.attributes[i] = {
												nodeName : e.target.attributes[i].nodeName,
												nodeType : e.target.attributes[i].nodeType,
												nodeValue : e.target.attributes[i].nodeValue
											}
											
											find.attrs[e.target.attributes[i].nodeName] = e.target.attributes[i].nodeValue;
											
											_.log( _t._id + '[echo][start][packet][target][attr]',e.target.attributes[i],JSON.stringify(packet.target.attributes[i]));
										}
									}
									_.log('## find',_.find(find),find);
								}
								if(e.target.value){
									packet.value = e.target.value;
								}
							}
							
							if(e.pageX){
								packet.relX = e.pageX / _t.width;
							}
							if(e.pageY){
								packet.relY = e.pageY / _t.height;
							}
						
							_.log('** e',e.target.attributes,packet,e,_.socket.node);
							_.socket.node.emit('event',packet);
						});
						
						return true;
					}
					
					return false;			
				},
				uuid : '',
				view : function(args){
				
					var dest = false;
					if(args.hash && args.hash[0]){
						dest = args.hash[0];
					}else if(this.echo.uuid){
						dest = this.echo.uuid;
					}
				
					_.log(this._id + '[echo][view]',dest,args);
					if(this.echo.connect(io)){				
						_.socket.node.emit('event',{server : 'view', uuid : dest});
					}
					
					return true;			
				}
			};
			
			this.init = function(){
				this.register();
				this.window = window;
				this.body = document.getElementsByTagName('body')[0];
				
				this.width = $(this.window).width();
				this.height = $(this.window).height();
				this.ratio = this.width / this.height;
				this.ratio_round = Math.ceil(this.ratio * 100)/100;
				this.wider = (this.width > this.height);
				this.taller = (this.width < this.height);
				this.square = (this.width == this.height);

				
				$(window).resize(this.resize);
				
				$(document).ready(function(){
					_t.resize(_t.window);
				});
				
			};
			
			this.init_attrs = function(ele,args){
				ele = ele || _t.window || window;
				var body = (ele == _t.window || ele == window ? _t.body : ele);

				if(!ele){
					return false;
				}
				
//				_.log('window[init-attrs]',ele,body,_t.body);
				
				if(!args){
					args = {
						width : _t.width,
						height : _t.height,
						ratio : _t.ratio,
						ratio_round : _t.ratio_round,
						wider : _t.wider,
						taller : _t.taller,
						square : _t.square
					}
				}
				
				_.log(_t._id + '[init-attrs]',_t.ratios,ele,args);
				
				$(ele).attr({
					'data-window-width' : args.width,
					'data-window-height': args.height,
					'data-window-ratio' : args.ratio,
					'data-window-ratio-round' : args.ratio_round
				});
				
				// ~EN (2014): call "slice" to clone array, not set pointer
				var ratios = JSON.parse(JSON.stringify(_t.ratios));
				
				for(var i in ratios){
					if(ratios.hasOwnProperty(i)){
						ratios[i] = false;
					}
				}
				
				if(args.width < args.height){
					ratios._taller = true;
				}else if(args.width > args.height){
					ratios._wider = true;
				}else{
					ratios._square = true;
				}
				
				if(args.ratio_round >= _t.ratios.fat){
//					$('body').addClass('_-window--obese').removeClass('_-window--narrow _-window--normal _-window--wide _-window--eq _-window--sq _-window--tv _-window--thin _-window--fat _-window--skinny');
//					$('body').addClass('_-window--obese').removeClass('_-window--narrow _-window--normal _-window--eq _-window--sq _-window--tv _-window--thin _-window--skinny');
					ratios.obese = true;
				}
								
				if((args.ratio_round > _t.ratios.wide && args.ratio_round <= _t.ratios.fat) || ratios.obese){
//					$('body').addClass('_-window--fat').removeClass('_-window--wide _-window--narrow _-window--normal _-window--eq _-window--sq _-window--tv _-window--thin _-window--obese _-window--skinny');
//					$('body').addClass('_-window--fat').removeClass('_-window--narrow _-window--normal _-window--eq _-window--sq _-window--tv _-window--thin _-window--obese _-window--skinny');
					ratios.fat = true;
				}
				
				if((args.ratio_round > _t.ratios.normal && args.ratio_round <= _t.ratios.wide) || ratios.fat || ratios.obese){
//					$('body').addClass('_-window--wide').removeClass('_-window--normal _-window--narrow _-window--fat _-window--eq _-window--sq _-window--tv _-window--thin _-window--obese _-window--skinny');
//					$('body').addClass('_-window--wide').removeClass('_-window--normal _-window--narrow _-window--fat _-window--eq _-window--sq _-window--tv _-window--thin _-window--obese _-window--skinny');
					ratios.wide = true;
				}
				
				if(args.ratio_round > _t.ratios.eq && args.ratio_round <= _t.ratios.normal){
//					$('body').addClass('_-window--normal').removeClass('_-window--wide _-window--narrow _-window--fat _-window--eq _-window--sq _-window--tv _-window--thin _-window--obese _-window--skinny');
					ratios.normal = true;
				}
				
				if(args.ratio_round > _t.ratios.sq && args.ratio_round <= _t.ratios.eq){
//					$('body').addClass('_-window--eq').removeClass('_-window--wide _-window--narrow _-window--fat _-window--normal _-window--sq  _-window--tv _-window--thin _-window--obese _-window--skinny');
					ratios.eq = true;
				}
				
				if(args.ratio_round > _t.ratios.thin && args.ratio_round <= _t.ratios.sq){
//					$('body').addClass('_-window--sq').removeClass('_-window--wide _-window--narrow _-window--fat _-window--normal _-window--eq  _-window--tv _-window--thin _-window--obese _-window--skinny');
	//			}else if(args.ratio_round > _t.ratios.thin && args.ratio_round <= _t.ratios.sq){
					ratios.sq = true;
				}
				
				if(args.ratio_round <= _t.ratios.narrow){
//					$('body').addClass('_-window--narrow').removeClass('_-window--wide _-window--normal _-window--fat _-window--eq _-window--sq _-window--tv');
					ratios.narrow = true;
				}				
								
				if(ratios.narrow || (args.ratio_round > _t.ratios.narrow && args.ratio_round <= _t.ratios.skinny)){
//					$('body').addClass('_-window--skinny').removeClass('_-window--wide _-window--narrow _-window--fat _-window--normal _-window--eq  _-window--tv _-window--obese _-window--sq');
					ratios.skinny = true;
				}
				
				if(ratios.narrow || ratios.skinny || (args.ratio_round > _t.ratios.skinny && args.ratio_round <= _t.ratios.thin)){
//					$('body').addClass('_-window--thin').removeClass('_-window--wide _-window--narrow _-window--fat _-window--normal _-window--eq  _-window--tv _-window--skinny _-window--obese _-window--sq');
					ratios.thin = true;
				}
				
				_t.ratios_current = ratios;
				
				for(var i in ratios){
					if(ratios.hasOwnProperty(i)){
						if(ratios[i] === true){
							$('body').addClass('_-window--' + (i.charAt(0) == '_' ? i.substring(1) : i));
						}else{
							$('body').removeClass('_-window--' + (i.charAt(0) == '_' ? i.substring(1) : i));
						}
					}
				}
				
			}
			
			this.pitch = {
				_ : function(hash,url){ // internal router for echo
					_.log(this._id + '[pitch][route]',hash);
					var fn = hash.shift();
					if(this.pitch[fn]){
						this.pitch[fn].call(this,{hash : hash});
					}
				},
				_connected : false,
				connect : function(tio){
					tio = tio || io;
					
					var _t = (this instanceof _._.Window ? this : _.window);
					
					if(_t.pitch._connected){
						return true;
					}
					
					if(tio && tio.connect){
						_t.pitch._connected = true;
						_.log(this._id + '[pitch][connect]',tio);
						_.socket.node = io.connect('http://'+window.location.hostname+':1337');				
		//				_.socket.node = io.connect('http://dev.numonium.com:1337');
						
						_.socket.node.on('pitch', function(e){
							_t.pitch.e.call(_t,e);
						});
						
						return true;
					}
					
					_t.pitch._connected = false;
					
					return false;
				},	
				beat : function(args){
					if(!args || !args.data || !_.socket){
						return false;
					}
					
					var _t = (this instanceof _._.Window ? this : _.window);

					_t.pitch.connect();
					
/*					_.socket.node.emit('pitch',{
						pitch : args
					});*/
					
					if(args.channelData){
						_.socket.node.emit('channelData',args.channelData);
					}
					
					if(args.b64){
						_.socket.node.emit('channelData-x64',args.b64);
					}
				}
				
			};
		
			this.register = function(args){
				_.log('router[register]['+this._id+']',args,this);
				_.routers[this._cmd] = this;		
			};
			
			this.resize = function(e){
				var ele = (e ? e.currentTarget || e : _t.window || window);
				
				var width = $(ele).width(),
					height = $(ele).height();
					
				if(height == 0){
					_.log("ERR["+_t._id + '][resize][no-height]',width,height,ele);
				}
					
				var ratio = width / height;
				var ratio_round = Math.ceil(ratio * 100)/100;
				
				var body = document.getElementsByTagName('body')[0];
				
				if(ele == _t.window){
					_t.width = width;
					_t.height = height;
				}
				
				_t.init_attrs(body,{
					width : width,
					height : height,
					ratio : ratio,
					ratio_round : ratio_round,
//					wider : _t.wider,
//					taller : _t.taller,
//					square : _t.square
				});

				
				if(width > height){
					_t.wider = true;
					_t.taller = _t.square = false;
					
					_.log('window[resize][wider]',width, height);

					$('*[data-window-sync]').each(function(i,ele){
						var attr;
											
						if(
							(attr = $(ele).attr('data-window-sync-height')) ||
							(attr = $(ele).attr('width'))
						){
							_.log('window[resize][sync]',ele);
							$(ele).removeAttr('width').attr('height', attr); // typically only works for %
						}
	
					});
					
/*					$('*[data-window-sync]').each(function(i,ele){
						var attr, sync = ele.getAttribute('data-window-sync');
						
						if((sync ==='' || (sync !== '' && _t.ratios_current[sync] != false)) && (attr = $(ele).attr('data-window-sync-width') || $(ele).attr('width'))){
							_.log('window[resize][sync]',ele);
							$(ele).removeAttr('width').attr('height', attr); // typically only works for %
						}else if(((sync !== '') && !_t.ratios_current[sync]) && (attr = ele.getAttribute('data-window-sync-height') || ele.getAttribute('height'))){
							_.log('window[resize][sync][width / height -> width]',ele);
							$(ele).removeAttr('height').attr('width', attr); // typically only works for %
						}
	
					});*/
					
				}else if(width < height){
					_t.taller = true;
					_t.wider = _t.square = false;
					
					_.log('window[resize][taller]',width,height, e);

					$('[data-window-sync]').each(function(i,ele){
						var attr;
						
						if(
							(attr = $(ele).attr('data-window-sync-width')) ||
							(attr = $(ele).attr('height'))
						){
						
							_.log('window[resize][sync]',ele);
							$(ele).removeAttr('height').attr('width', attr); // typically only works for %
						}
						
					});
										
/*					$('[data-window-sync]').each(function(i,ele){
						var attr, sync = ele.getAttribute('data-window-sync');
						
						if((sync ==='' || (sync !== '' && _t.ratios_current[sync] != false)) && (attr = ele.getAttribute('data-window-sync-height') || ele.getAttribute('height'))){
							_.log('window[resize][sync]',ele);
							$(ele).removeAttr('height').attr('width', attr); // typically only works for %
						}else if(((sync !== '') && !_t.ratios_current[sync]) && (attr = ele.getAttribute('data-window-sync-width') || ele.getAttribute('width'))){
							_.log('window[resize][sync][height / width -> height]',sync,ele,_t.ratios_current[sync]);
							$(ele).removeAttr('width').attr('height', attr); // typically only works for %
						}
						
					});*/
					
				}else{
					_t.square = true;
					_t.wider = _t.taller = false;
					
					_.log('window[resize][sq]',width, height, e);
//					$(body).addClass('_-window--sq').removeClass('_-window--wider _-window--taller');
				}
								
/*				$('._-logo img').each(function(i,ele){
					var height = width = 0;
					if(parseFloat($(body).attr('data-window-ratio-round')) <= .75){
						if(height = $(ele).attr('height')){
							$(ele).removeAttr('height').attr('width','95%');
						}
					}else{
						if(width = $(ele).attr('width')){
							$(ele).removeAttr('width').attr('height','100%');
						}
		
					}
				});
				
				$('._-pictcha ._-pictcha--select--img img').each(function(i,ele){
					var height = width = 0;
					if(parseFloat($(body).attr('data-window-ratio-round')) >= 1.4){
						if(width = $(ele).attr('width')){
							$(ele).removeAttr('width').attr('height','100%');
						}
					}else{
						if(height = $(ele).attr('height')){
							$(ele).removeAttr('height').attr('width','100%');
						}
					}
				});
			};
			
			this.route = function(e,args){		
				var sep = '/';
				var url = args._url || window.location.pathname.substring(1).split(sep),
					hash = args._hash || window.location.hash.substring(2).split(sep); // ~EN: hash[0] = '#'; hash[1] = '/';
					
				var _url = url.join(sep),
					_hash = hash.join(sep),
					cmd = hash.shift() || 'load';
					
				if(!_hash || !cmd){
					_.log(this._id + '[route][empty]',_hash);
					
					return false;
				}
				
				_.log(this._id + '[route][>>'+cmd+']',_hash);
				
				if(_.is.defined(this[cmd]) && _.is.defined(this[cmd]._)){
					
					return this[cmd]._.call(this,hash,url);
				} /*
				
				if(cmd == 'echo'){
					return this.echo._(hash,url);
				}*/
			};
			
			this.init();
		}
	});
	
	_.window = new _._.Window();
	
})(_, jQuery);				
				// } 04._.window.js # (20 / 25) 

			
				// # (21 / 25) 05._.audio.js {

(function(_, $, ko){

	var __class = {
		_ : 'Audio',
		parents : ['_']
	};
	
	_._.add({
		_class : __class,
		constructor : function(args){
			
			_._.parentConstruct(this,arguments,__class);
			
			var _t = this;
			this._id = 'Audio';
			this._cmd = 'audio';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd;
			
			this.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
			
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;			
			this.media = navigator.getUserMedia;
			
			this.fft = (typeof FFT != 'undefined' ? new FFT(4096,this.context.sampleRate) : false);
			
			this.remote = true;
			
			this.pitchDetector = (typeof PitchDetector != 'undefined' ? new PitchDetector() : false);
			
			this.mic = {
				_kill : false,
				beat : function(e){
					if(_t.mic._kill){
						return false;
					}
					
					var fFrequencyData = bFrequencyData = 0;
					
					var results = results2 = [];
					
					if(!_t.mic.waveform_context){
						_t.mic.waveform_context = _t.mic.waveform.getContext('2d');
					}
					
				    _t.mic.waveform_context.clearRect(0,0,_t.mic.waveform.width,_t.mic.waveform.height);
				    var barWidth = 1;

					
					if(_t.remote && _.window){
					
						fFrequencyData = new Float32Array(_t.analyser.frequencyBinCount);
						bFrequencyData = new Uint8Array(_t.analyser.frequencyBinCount);
						
						_t.analyser.getFloatFrequencyData(fFrequencyData);
						_t.analyser.getByteFrequencyData(bFrequencyData);
						_t.analyser.getByteTimeDomainData(bFrequencyData);
						
						for(var i = 0; i < fFrequencyData.length/2; i++){
							var real = Math.abs(fFrequencyData[2*i]),
								im = Math.abs(fFrequencyData[2*i+1]);
							
							results2[i] = Math.sqrt(real*real + im * im);
							
						    var value = Math.abs(results2[i]);
						    var percent = value / 256;
						    var height = 480 * percent;
						    var offset = 256 - height - 1;
						    
						    _t.mic.waveform_context.fillStyle = '#0000ff';
						    _t.mic.waveform_context.fillRect(i * barWidth, 0, barWidth, value);
						}

					
						_.window.pitch.beat({
							channelData : results2,
							data : new Uint8Array(_t.analyser.frequencyBinCount),
//							b64 : Base64.encode(new Uint8Array(_t.analyser.frequencyBinCount)),
						});
						
						return true;
					}else if(_t.fft){
					
						_t.fft.forward(e.inputBuffer.getChannelData(0));
						fFrequencyData = _t.fft.spectrum;
//						_.log('@@@@!',e.inputBuffer.getChannelData(0),_t.fft);
						_t.analyser.getFloatFrequencyData(fFrequencyData);
						
					}else{
						
						fFrequencyData = new Float32Array(_t.analyser.frequencyBinCount);
						bFrequencyData = new Uint8Array(_t.analyser.frequencyBinCount);
						
						_t.analyser.getFloatFrequencyData(fFrequencyData);
						_t.analyser.getByteFrequencyData(bFrequencyData);
						_t.analyser.getByteTimeDomainData(bFrequencyData);
						
					}
									    
				    var highest = highest2 = lowest = lowest2 = 0;
				    var results2 = [];

					/*
					
					Real frequencies are mapped to k as follows:
					
					F = k*Fs/N  for k = 0 ... N/2-1 ((N-1)/2 for odd N) */

					for(var i = 0; i < fFrequencyData.length/2; i++){
						var real = Math.abs(fFrequencyData[2*i]),
							im = Math.abs(fFrequencyData[2*i+1]);
						
						results2[i] = Math.sqrt(real*real + im * im);
						
						if(results2[i] < results2[lowest]){
							lowest2 = lowest;
							lowest = i;
						}else if(results2[i] < results2[lowest2] && results2[i] > results2[lowest]){
							lowest2 = i;
						}else if(results2[i] > results2[highest]){
							highest2 = highest;
							highest = i;
						}else if((results2[i] > results2[highest2]) && results2[i] < results2[highest]){
							highest2 = i;
						}
						
					    var value = Math.abs(results2[i]);
					    var percent = value / 256;
					    var height = 480 * percent;
					    var offset = 256 - height - 1;
					    
					    _t.mic.waveform_context.fillStyle = '#0000ff';
					    _t.mic.waveform_context.fillRect(i * barWidth, 0, barWidth, value);
					}

/*					
					for(var i = 0; i < fFrequencyData.length; i++){
						results[i] = i * _t.context.sampleRate / fFrequencyData.length;
						
						if(fFrequencyData[i] < fFrequencyData[lowest]){
							lowest2 = lowest;
							lowest = i;
						}else if(fFrequencyData[i] < fFrequencyData[lowest2] && fFrequencyData[i] > fFrequencyData[lowest]){
							lowest2 = i;
						}else if(fFrequencyData[i] > fFrequencyData[highest]){
							highest2 = highest;
							highest = i;
						}else if((fFrequencyData[i] > fFrequencyData[highest2]) && fFrequencyData[i] < fFrequencyData[highest]){
							highest2 = i;
						}

						
						
/*						for(var j = 0; j <= 22020; j += 60){
							results[i][j] = _t.freq(j,fFrequencyData);
						}*
						
					    var value = Math.abs(fFrequencyData[i]);
					    var percent = value / 256;
					    var height = 480 * percent;
					    var offset = 256 - height - 1;
					    
					    _t.mic.waveform_context.fillStyle = '#0000ff';
					    _t.mic.waveform_context.fillRect(i * barWidth, 0, barWidth, value);
		
					}*/
					
					if(_.api.tuner){
						_.api.tuner.ViewModel.freq_high1(results2[highest] + ' (' + highest + ')');
						_.api.tuner.ViewModel.freq_high2(results2[highest2] + ' (' + highest2 + ')');
						_.api.tuner.ViewModel.freq_high_avg((results2[highest2] + results2[highest])/2.0 + ' (' + (highest + highest2)/2.0 + ')');
						
						
/*						_.api.tuner.ViewModel.freq_low1(results[lowest] + ' (' + lowest + ')');
						_.api.tuner.ViewModel.freq_low2(results[lowest2] + ' (' + lowest2 + ')');*/
					}
					
					_.log('###',{ low1: results[lowest], low2: results[lowest2], high2: results[highest2],high1: results[highest]},fFrequencyData[lowest],highest,fFrequencyData[highest]);
				},
				err : function(err){
					_.err(_t._cmd + '[mic][err]',err);
				},
				input : function(){
					if(this.pitchDetector){
						this.pitchDetector.toggleLiveInput();
					}else{
						alert('no pitch detector :(');
						navigator.getUserMedia({audio : true}, _t.mic.stream, _t.mic.err);
					}
				},
				interval : '',
				stream : function(stream){
					_.log(_t._cmd + '[mic][stream]',stream);
					
					_t.input = _t.input || _t.context.createMediaStreamSource(stream);
					
					_t.analyser = _t.analyser || _t.context.createAnalyser();
					_t.analyser.smoothingTimeConstant = 0.3;
					_t.analyser.maxDecibles = 0;
					
					_t.filter = _t.filter || _t.context.createBiquadFilter();
/*					_t.filter.type = _t.filter.NOTCH;
					_t.filter.frequency.value = 60.0;
					_t.filter.Q = 10.0;*/
					_t.filter.type = _t.filter.LOWPASS;
					_t.filter.frequency.value = 10500;
					
					_t.input.connect(_t.filter);
					_t.filter.connect(_t.analyser);
//					_t.input.connect(_t.context.destination);
					
					_t.nyquist = _t.context.sampleRate/2;
					
					var node = _t.context.createGain();
					node.gain.value = 1;
					
					var proc = _t.input.context.createScriptProcessor(4096,1,1);
/*					proc.onaudioprocess = function(e){
						_.log('$$$',e,this);

					}*/
										
					node.connect(proc);
					node.connect(_t.analyser);
					proc.connect(_t.context.destination);
					
					proc.onaudioprocess = _t.mic.beat;
					
//					_t.mic.interval = setInterval(_t.mic.beat,300);
					
				},
				waveform : document.getElementById('_-waveform'),
				waveform_context : ''
			};
			
			_._[__class._].prototype.init.call(this,args);
			
		},
		proto : {
			freq : function(freq,domain){
				var nyquist = this.context.sampleRate/2;
				var index = Math.round(freq/nyquist * domain.length);
				return domain[index];	
			},
			init : function(args){
				this.register();
				
				if(!this.context.createGain){
					this.context.createGain = this.context.createGainNode;
				}
				
				if(!this.context.createDelay){
					this.context.createDelay = this.context.createDelayNode;
				}
				
				if(!this.context.createScriptProcessor){
					this.context.createScriptProcessor = this.context.createJavaScriptNode;
				}
				
				this.data = this.uuid;
				
				window.addEventListener('touchstart', function() {
				
					// create empty buffer
					var buffer = this.context.createBuffer(1, 1, 22050);
					var source = this.context.createBufferSource();
					source.buffer = buffer;
				
					// connect to output (your speakers)
					source.connect(this.context.destination);
				
					// play the file
					source.noteOn(0);
				
				}, false);
			},
			register : function(){
				
			}
		}
	});
	
	$(document).ready(function(){
		
		_.audio = _.audio || new _._.Audio();
		
	});
	
})(_, jQuery, ko);				
				// } 05._.audio.js # (21 / 25) 

			
				// # (22 / 25) 07._.page.js {

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
				// } 07._.page.js # (22 / 25) 

			
				// # (23 / 25) 09.ui.js {

(function($,_){

	var __t = _.ui = {
		_id : 'ui',
		init : function(args){
			$('form ._-ui--file-upload').each(function(i,ele){
				_.ui.forms.upload.init({ele : ele});
			});
			
			__t.font.size();
		},	
		
		editors : {
			ckeditor : {
				_ : {},
				fn : {
					init : function(ele,options){
						CKEDITOR.replace(ele,options);	
						
					}
				}
			},
			wysiwyg : {
				_ : {},
				buttons : {
					_cancel : {
						title : 'Cancel',
						callback : function(obj, e, key){								
							return _.ui.editors.wysiwyg.fn.destroy(obj,e,key);
						}
					},
					_save : {
						title : 'Save!',
						callback : function(obj, e, key){
							if(!jQuery)
								return false;
								
							var form = document.getElementById('_-form--admin'),
								input = false;
							
							(function($){
							
								if($(form).find('input[name="page\\[content\\]"]').length > 0){
									input = $(form).find('input[name="page\\[content\\]"]')[0];
								}
								
							})(jQuery);
							
							if(!input){
								input = document.createElement('input');
								input.setAttribute('name', 'page[content]');
								input.setAttribute('type', 'hidden');
								form.appendChild(input);
							}
							
							input.setAttribute('value',obj.getCode());
							
							form.submit();
							
							_.log('> save',form,input);
						}
					}
				},
				fn : {
					destroy : function(obj, e, key){
						if(!jQuery){
							return false;
						}
						
						(function($){
							
							_.log('@ wysiwyg cancel',obj,e,key,$(obj.$editor).find('._-wysiwyg--link'));
							
							$(obj.$editor).removeClass('_-wysiwyg--frame _-editable').unbind('.wysiwyg').find('._-wysiwyg--link').each(function(i,ele){
							
								href = this.getAttribute('loc') || this.getAttribute('href');
								rel = this.getAttribute('rel');
								
								if(rel && rel=='lightbox'){
									
								}else{
								
									this.setAttribute('href','#/admin/leave' + (href.charAt(0) != '/' ? '/' : '') + href);
									
								}
							
							}).removeClass('_-wysiwyg--link');
							obj.$editor.destroyEditor();
							
//							_.admin.editing = false;
//							_.admin.setState(false);
							
							
						})(jQuery);
						
						return true;
					},
					drag : function(e){
					
					},
					img : {
						
						drag : function(e){
							_.log('253 img[drag]',e);
						},					
						mouseenter : function(e){
							var ele = e.currentTarget || event.currentTarget || e, t = this;
							_.log('223 img[mouseenter]',e,ele);
							
							if(!jQuery){
								return false;
							}
							
							(function($){
	
								var $this = $(t);
							  
								if($this.hasClass('_-wysiwyg--dragging')){
									return;
								}
							  
								if(!$this.is(':data(draggable)')) {
									$this.draggable({
										containment : '._-wysiwyg--frame',
										start : function(e, ui){
									    	$(this).addClass('_-wysiwyg--dragging');
										},
										stop : function(e, ui){
									    	$(this).removeClass('_-wysiwyg--dragging');
										}
									});
									
									_.log('223a img[drag] enabled',this);
								}
								
								_.log('223a img[drag] blocked',this);
							
							})(jQuery);
						},
						upload : function(ele){ // <input type="file" onchange="_.ui.editors.wysiwyg.fn.img.upload(this)">
							if(!jQuery || !ele)
								return false;
								
							var img = {
								_ :  false,
								id : false,
								preview : false,
								parent : false,
								wrapper : false,
								top : false,
								link : false
							};
							
							var _new = {};
							
							var clone = last = false,
								num_current = 0;
								
	
								
							(function($){
								
								img.id = id = parseInt(_.array.last($(ele).attr('id').split('--')));							
								img.parent = ele.parentNode;
								img.top = $(ele).parents('.img--upload')[0];							
								
								img._ = $(img.top).find('.img--preview')[0];
								img.wrapper = img._.parentNode;
								img.fieldset = img.wrapper.parentNode;
								img.field = img.fieldset.parentNode;
								img.info = $(img.fieldset).find('.img--upload--info')[0];
								img.link = $(img.top).find('.img--link')[0];
								
								img.inputs = $(img.top).find('.img--upload--img--file');
								for(var i=0; i < img.inputs.length; i++){
									if(img.inputs[i].type=='file'){
										img.file=img.inputs[i];
									}else if(img.inputs[i].type=='checkbox'){
										img.photo_delete=img.inputs[i];
									}
								}
	
								siblings = $(img.top).siblings();
	
								last = (siblings.length == 0 ? img.top : $(img.top).siblings(':last')[0]);
								last_link = last.getElementsByTagName('a')[0];
	
								if(last == img.top || (last != img.top && !$(last).hasClass('empty'))){
									
									//if we're changing the last node, set it to not empty and add one
									_new.top = last.cloneNode(true);
									if(last == img.top){
										$(last).removeClass('empty');
									}else{
										$(_new.top).addClass('empty');
									}
									
									var tmp = _new.top.id.split('--');
									tmp[tmp.length-1] = (id+1);
									_new.top.id=tmp.join('--');
		
									_new.link = $(_new.top).find('.img--link')[0];
									
									_new._ = $(_new.top).find('.img--preview')[0];
									
									_.log('_new',id,_new,last);
									
									_new._.src='';
									
									tmp = _new.link.id.split('--');
									tmp[tmp.length-1] = (id+1);
									_new.link.id=tmp.join('--');
	
									
							//		new_link.id=new_link.id.substring(0,new_link.id.length-1)+(id+1);
									
									tmp = _new.link.name.split('--');
									tmp[tmp.length-1]=(id+2);
									_new.link.name=tmp.join('--');
													
							//		new_link.name=new_link.name.substring(0,new_link.name.length-1)+(id+2);
									
									_new.img = $(_new.top).find('.img--preview')[0];
									tmp = _new.img.id.split('--');
									tmp[tmp.length-1]=(id+1);
									_new.img.id=tmp.join('--');
									
									_new.inputs = $(_new.top).find('.img--upload--img--file');
									for(var i=0; i < _new.inputs.length; i++){
										if(_new.inputs[i].type=='file'){
											_new.file=_new.inputs[i];
										}else if(_new.inputs[i].type=='checkbox'){
											_new.photo_delete=_new.inputs[i];
										}
									}
							
									tmp = _new.file.id.split('-');
									tmp[tmp.length-1]=(id+1);
									_new.file.id=tmp.join('-');
									
									_new.file.value='';
									
									if(_new.photo_delete){
										_new.photo_delete.id='img--delete-'+(id+1);
										_new.photo_delete.name='img--delete['+(id+1)+']';
										_new.photo_delete.checked=false;
										_new.label=$(_new.top).find('label')[0];
										_new.label.id='img--delete--label--'+(id+1);
										_new.label.setAttribute('for',_new.photo_delete.id);
									}
									
									_new.legend = $(_new.top).find('legend')[0];
									_new.text = _new.legend.firstChild;
							
									tmp = _new.text.nodeValue.split('#');
									tmp[tmp.length-1]=(id+2);
									_new.text.nodeValue=tmp.join('#');
	
									$(_new.top).find('.img--upload--info').hide();
	
									
									_.log('baa',id, img,siblings.length,_new);
	
								}
								
								/*
								if(clone = $(img.top).clone(true)){
									
									var clone_id = $(clone).attr('id').split('--'),
										clone_link = $(clone).find('.img--link'),
										clone_link_name = $(clone_link).attr('name').split('--');
									
									num_current = clone_link_name[clone_link_name.length-1] = clone_id[clone_id.length-1] = parseInt(clone_id[clone_id.length-1])+1;
									
	
									
									$(clone).attr('id',clone_id.join('--')).find('.img--link').attr({
										name : clone_link_name.join('--')
									});
									
								}*/
								
								
								
							})(jQuery);
							
							if(!img._)
								return false;
								
							if(clone){
								
							}
																				
	
							try{
						      var reader = new FileReader();
						
						      reader.onload = (function(file) {
						      
						        return function(e) {
						          _.img.resize({
						          	data : reader.result,
						          	file : file,
	//					          	dest : img._
						          	img : img
						          });
	
	//					          img._.src = reader.result;
						        };
						      })(ele.files[0]);
						
						      _.log('87999',ele.files[0]);
						      reader.readAsDataURL(ele.files[0]);
							}catch(err){
								img._.src=ele.value;
							}
							
							(function($){
								
								$(img.top).removeClass('empty').find('.img--upload--info').show();
								
							})(jQuery);
							
							img.field.parentNode.appendChild(_new.top);
	
							window.location.href='#'+(!_new.link ? last_link.name : _new.link.name);
						}
						
					},		
					init : function(ele,options){ // ele -> content to transfer into textarea
						if(!jQuery){
							return false;
						}
						
						if(!$){
							$ = jQuery;
						}
											
						options = options || _.cfg.wysiwyg.options || {};
						
						_.log('+ wysiwyg[init][tag]',ele.tagName,options);
						
						var iframe = iframe_body = iframe_content = iframe_content_main = iframe_head = iframe_page = iframe_title = iframe_title_wrapper = iframe_title_content = styles = false;
						
						var wrapper = document.createElement('div');
						wrapper.setAttribute('class','_-wysiwyg _-wysiwyg--wrapper _-loading');
						
						var textarea = false;
						if(ele.tagName.toLowerCase() == 'textarea'){ // called to enhance textarea editing
							textarea = ele;
						}else{ //called on a page to edit content
							textarea = document.createElement('textarea');
							textarea.setAttribute('class', 'redactor');
							textarea.setAttribute('name','page[content]');
							options.buttonsAdd = options.buttonsAdd_content || options.buttonsAdd;
						}
						
						var content = document.createElement('div');
						content.setAttribute('class','_-wysiwyg--content');
						
						/*
						
						if(ele){
							if(ele.id){
								textarea.setAttribute('id',ele.id+'--wysiwyg');
								wrapper.setAttribute('id',ele.id);
								ele.setAttribute('id','');
								_.add.className(ele,'_-wysiwyg--content');
							}
							
							styles = ele.style;
							
							if(jQuery){
								(function($){
	
									$(textarea).html( $(ele).html() );
								
								})(jQuery);
								
							}else{
								textarea.innerHTML = content.innerHTML = textarea.innerHTML;								
							}
							
						}
						
						wrapper.appendChild(textarea);
						
						if(ele){
							ele.parentNode.appendChild(wrapper);
							wrapper.appendChild(ele);
						}*/
	
						var _id = false;
												
						(function($){
	
							var css = [];
							
							_.log('444',options,_.cfg.wysiwyg.options);
							
	//							var _id = $('._-wysiwyg textarea').redactor(options).data('redactor')._id || _id; 
	
							_.redactor = $(ele).redactor(options).data('redactor');
							
							var _id = _.redactor._id || _id; 
	
							_.log('@ wysiwyg init',ele.id,_id,options,arguments);
							
							iframe = $(ele).parent().find('.redactor_frame')[0];
													
							if(!iframe){ //~EN: new redactor encloses in a div, rather than a whole iframe, and should have attr contenteditable="true"
								iframe = $(ele).parent().find('.redactor_editor')[0];
								
								$(iframe).addClass('_-wysiwyg--frame').on(_.ui.editors.wysiwyg.e.frame).on(_.ui.editors.wysiwyg.e.links,'a').find('a').addClass('_-wysiwyg--link _-tmp--wysiwyg--target').attr('href','javascript:;');
								
								$(iframe).on(_.ui.editors.wysiwyg.e.img,'._-img').find('._-img').addClass('_-wysiwyg--img _-tmp--wysiwyg--target');
								
								/*
								
								$(iframe).addClass('_-wysiwyg--frame').keydown(_.e.keydown).keyup(_.e.keyup).find('a').addClass('_-wysiwyg--link _-tmp--wysiwyg--target').attr('href','javascript:;').live('click',_.ui.editors.wysiwyg.fn.link); */
								
								$(iframe).children().dblclick(_.ui.editors.wysiwyg.toggle.menu.context)/*.mouseup(_.ui.editors.wysiwyg.toggle.menu.context)*/;
								
								_.log('@ wysiwyg iframe',iframe);
							
							}else{ //~EN: legacy redactor
							
								_.log('@ wysiwyg iframe',iframe);
								
								iframe_doc = _.frame.doc(iframe);
							
								iframe_head = $(iframe_doc).find('head')[0];
								iframe_body = $(iframe_doc).find('body')[0];
								iframe_page = $(iframe_body).find('#page')[0];
								
								//add key handler
								$(iframe_doc).find('*[contenteditable="true"]').keydown(_.e.keydown);
								$(iframe_doc).find('*[contenteditable="true"]').keyup(_.e.keyup);
								
								$(iframe).addClass('_-wysiwyg--frame');
								$(iframe_body).attr('id','_-wysiwyg--frame--body--'+_.size(_.editors)).addClass('_-wysiwyg--frame--body '+$('body').attr('class').replace('_-admin',''));
								
								_.tmp.iframe_css = '';
								
								_.tmp.iframe_head = iframe_head;
								
								_.tmp.iframe_ss = 0; // # css downloaded
								_.tmp.iframe_ss_length = document.styleSheets.length;
								
								_.tmp.stylesheets = [];
								
								for(var i=0; i<document.styleSheets.length; i++){
								
									var path = document.styleSheets[i].href;
									
									if(!path){
										continue;
									}
									
									_.tmp.stylesheets.push({
										ele : document.styleSheets[i].ownerNode || document.styleSheets[i].ownerElement,
										path : path
									});
	//										_.log('+ css',path,_.tmp.stylesheets);
									
									$.get(path, function(response){
									
										var ele = false;
										for(var i=0; i<_.tmp.stylesheets.length; i++){
											if(_.tmp.stylesheets[i].path == this.url){
												ele = _.tmp.stylesheets[i];
												break;
											}
										}
	//										_.log('- css',_.tmp.stylesheets);
									
	/*										_.tmp.iframe_head.appendChild(_.add.css({
											from : path,
											content : response
										})); */
										
										$(_.tmp.iframe_head).append('<style'+(ele ? ' id="'+ele.ele.getAttribute('id')+'" class="'+ele.ele.getAttribute('class')+'"' : '')+' type="text/css">' + response + '</style>');
	
									
									
	//										$(_.tmp.iframe_head).find('#_-wysiwyg--frame--css').append(response);
								
										if(_.tmp.iframe_ss == _.tmp.iframe_ss_length-1){
											_.ui.editors.wysiwyg.fn.show(iframe);
										}
										
										_.tmp.iframe_ss++;
									});
	//									iframe_head.appendChild(_.add.css({href : document.styleSheets[i].href}));
								}
								
								iframe_content = document.createElement('div');
								iframe_content.setAttribute('id', 'content');
	
								iframe_content_main = document.createElement('div');
								iframe_content_main.setAttribute('id', 'content--main');
								iframe_content_main.setAttribute('class', '_-wysiwyg--frame--content');
	
								iframe_page.parentNode.removeChild(iframe_page);
								
								iframe_content_main.appendChild(iframe_page);
								iframe_content.appendChild(iframe_content_main);
								
								$(iframe_content_main).click(function(e){
									_.log('? click',e);
								}).on(_.ui.editors.wysiwyg.e.links,'a').find('a').addClass('_-wysiwyg--link').attr('href','javascript:;');
								
								$(iframe_content_main).find('#page > *').dblclick(_.ui.editors.wysiwyg.toggle.menu.context)/*.mouseup(_.ui.editors.wysiwyg.toggle.menu.context)*/;
								
								iframe_body.appendChild(iframe_content);
								
								/*
								if($(iframe_page).find('h1').length > 0){
									iframe_title = $(iframe_page).find('h1')[0];
									var styles = [];
									
									for(var i in iframe_title.style){
											styles[i] = $(iframe_title).css(i);
									}
									
									$(iframe_page).remove('h1');
									
									iframe_title_content = document.createElement('input');
									iframe_title_content.setAttribute('type', 'text');
									iframe_title_content.setAttribute('name', 'page[title]');
									
									for(var i in styles){
										$(iframe_title_content).css(i,styles[i]);
									}
									
									iframe_title_wrapper = document.createElement('div');
									iframe_title_wrapper.setAttribute('class', '_-wysiwyg--title--wrapper');
									iframe_title_wrapper.appendChild(iframe_title_content);
									iframe_title_wrapper.style.display='none';
									
									$(iframe_page).parent().prepend(iframe_title_wrapper);
									
									
									_.log("$*!!*$",$(iframe_title),iframe_title_wrapper);
									
								}*/
							}
						
						})(jQuery);
						
						return _id;
					},
					link : function(e){
						/* redactor links have two input text ele
							* url -> #redactor_link_url
							* text -> #redactor_link_url_text
							-> #redactor_insert_link_btn.click()	*/
							
						e = e || event;
						
						var ele = e.currentTarget,
							parent = ele.parentNode,
							text = '',
							url = ele.getAttribute('loc') || ele.getAttribute('href');
							
						if(jQuery){
							
							(function($){
							
								text = $(ele).text();
							
							})(jQuery);
							
						}
						
						var content = 
							'<form id="redactorInsertLinkForm" method="post" action="javascript:;">' +
								'<label><strong>URL:</strong> <input type="text" class="_-input--text" id="redactor_link_url" value="' + url +'" /></label>' +
								'<input type="hidden" id="redactor_link_url_text" contenteditable="true" value="' + text + '" />' +
								'<input type="submit" class="_-input--submit" id="redactor_insert_link_btn" value="&raquo;" />' +
							'</form>';
						
						_.ui.editors.wysiwyg.toggle.tooltip({
							ele : ele,
							name : 'link',
							content : content
						});
						
						$('#redactor_insert_link_btn').click(function(e){
							var tooltip_parent = $(this).parents('._-tmp--wysiwyg')[0];
							
							if(target = $(tooltip_parent).children('a[loc]')[0]){
								$(target).attr('loc',$('#redactor_link_url').val());
							}
							
							_.ui.editors.wysiwyg.toggle.tooltip({
								ele : target,
								name : 'link',
								content : content,
								parent : tooltip_parent
							});
							
	//							_.redactor.insertLink();
						});
	
						_.log('@ wysiwyg link',ele,url,$(ele).text());
					},
					show : function(ele){
						if(!jQuery){
							return false;
						}
							
						(function($){
						
	//							$(ele).parents('._-wysiwyg').css('visibility','visible');
							$(ele).parents('._-wysiwyg').removeClass('_-loading').addClass('_-loaded').find('._-wysiwyg--content').animate({
								opacity : 0
							},500,function(){
								$(this).hide();
							});
							
							$(ele).parents('._-wysiwyg').find('.redactor_box').animate({
								opacity : 1
							},500);
							
						})(jQuery);
						
					}
				},
				toggle : {
					menu : {
						context : function(e){
							if(e.preventDefault){
								e.preventDefault();
							}
							
							var content = 'asd',
							sel = window.getSelection();
							
							if(e.type=='dblclick'){
								_.log('* mouse[dblclick]',e,sel,e);								
							}
							
							_.log('? toggle[context]',e,sel,e);
							
							_.ui.editors.wysiwyg.toggle.tooltip({
								ele : e.currentTarget,
								name : 'context',
								content : content,
								pos : {
									x : e.clientX,
									y : 0
								},
								sel : sel
							});
	
						}	
					},
					tooltip : function(args){
						var content = args.content || '&nbsp;',
							ele = args.ele || false,
							name = args.name || '',
							parent = args.parent || ele.parentNode || false,
							grandp = args.grandp || parent.parentNode || false,
							sel = args.sel || false;
							
							_.log('900',parent,ele,parent.childNodes[0], parent.childNodes[0] == ele);
							
						if(sel)
							return true;
					
						if(parent.getAttribute('class') && _.array.isin('_-tmp--wysiwyg',parent.getAttribute('class').split(' '))){
							_.log('- toggle['+name+']',sel,args);
							parent.removeChild(ele);
							grandp.replaceChild(ele, parent);
							
						}else{
							_.log('+ toggle['+name+']',sel,args);
							var clone = ele.cloneNode(true);
							var events = {};
							
							if(jQuery){ // clone events
								
								(function($){
									
									events = $(ele).data('events');
									
									if( events ){
									    for( var eventType in events ){
									        for( var i in events[eventType]){
									            // this will essentially do $other_link.click( fn ) for each bound event
									            $(clone)[ eventType ]( events[eventType][i].handler );
									        }
									    }
									}
								
								})(jQuery);
								
							}
							
							var wrapper = document.createElement('span');
							wrapper.setAttribute('class','_-tmp--wysiwyg _-tmp--wysiwyg--wrapper');
							wrapper.appendChild(clone);
							parent.replaceChild(wrapper,ele);
							
							var modal = document.createElement('div');
							modal.setAttribute('class', '_-tooltip'+(name ? ' _-tooltip--'+name : ''));
							modal.setAttribute('contenteditable',false);
							modal.setAttribute('id',  _.str.uniqid('_-tooltip-'+(name ? name+'-' : '')));
							
							if(args.pos && (args.pos.x || args.pos.y)){
								modal.style.position = 'absolute';
								
								if(args.pos.x !== null){
									modal.style.left = args.pos.x+'px';
								}
								
								if(args.pos.y !== null){
									modal.style.top = (_.is.int(args.pos.y) ? args.pos.y+'px' : args.pos.y);
								}
							}
	
							var html = 
								'<div class="_-tooltip--inner">' +
									'<div class="_-pivot">' + 
										'<div class="_-arrow--wrapper">' +
											'<span class="_-arrow"></span>' +
										'</div>' +
										'<div class="_-content">' +
											content +
										'</div>' +
									'</div>' +
								'</div>';
								
							modal.innerHTML = html;
							wrapper.appendChild(modal);
	
						}
					}
				}
			}
		},
		font : {
			size : function(){
				(function($){
					
					$('[data-_-ui-font-size]').each(function(i,ele){
						var len = $(ele).text().length;
						
						var size = '';
						if(len >= 30){
							size = '.85em';
						}else if(len >= 20){
							size = '1em';
						}else if(len >= 15){
							size = '1.2em';
						}
						
						if(size != ''){
							$(ele).css('font-size',size);
						}
						
						_.log('ui[font][size]',len,$(ele).text(),ele);
					})
					
				})(jQuery);
			}	
		},
		forms : {
			init : {
				ac : function(listType,ele){
					var list = _.ac;
					
					if(_.is.array(listType)){
						list = _.array.nav(_.ac,listType);
					}else{
						list = list[listType];
					}
					
					if(jQuery){
						(function($){
							
							var href = _.ac.src.base + '/' + listType.join('/');
							
							_.log('ac1[ajax]',listType,href,ele);
							
							if(!list){
							
								$.ajax({
									url : href,
									success : function(data){
										if(_.is.array(listType)){
											switch(listType.length){
												case 1:
													_.ac[listType[0]] = data;
													break;
												case 2:
													_.ac[listType[0]][listType[1]] = data;
													break;
												case 3:
													_.ac[listType[0]][listType[1]][listType[2]] = data;
													break;
											}
										}else{
											_.ac[listType] = data;
										}
										
										if(_.is.array(data) || _.is.object(data)){
											for(var i in data){
												if(data.hasOwnProperty(i)){
													data[i].label = data[i].name || data[i].title || data[i].slug || i;
													data[i].value = data[i].slug || i;
												}
											}
										}
										
										if(ele){
											_.ui.forms.ac(ele); // return to ac init
										}
										
									}
								});
							}
							
						})(jQuery);
					}
				},
			},
			upload : {
				init : function(args){
					
					var ele = args.ele || args;
					
					ele.onclick = _.ui.forms.upload.click;
					
					if(!('draggable' in document.createElement('span'))){
						return false;
					}
					
					ele.ondragover = _.ui.forms.upload.drag_over;
					ele.ondragend = _.ui.forms.upload.drag_end;
					ele.ondrop = _.ui.forms.upload.drop;
				},
				
				click : function(e){
					var ele = e.currentTarget || e;
					
					$(ele).find('._-input--file').change(_.ui.forms.upload.change).click();	
				},
				
				change : function(e){
					var ele = e.currentTarget || e;
					
					if(ele.files[0]){
						_.ui.forms.upload.read({
							ele : ele,
							files : ele.files
						});
					}
				},
				
				drag_over : function(e){
					e.preventDefault();
					
					var ele = e.currentTarget || e;
					
					$(ele).addClass('_-hover');
					
				},
				
				drag_end : function(e){
					
					var ele = e.currentTarget || e;
					
					$(ele).removeClass('_-hover');
					
				},
				
				drop : function(e){
					e.preventDefault();
					
					var ele = e.currentTarget;
					
					$(ele).removeClass('_-hover');
					
					if(e.dataTransfer.files[0]){
					
						_.ui.forms.upload.read({
							ele : $(ele).find('._-input--file').get(0),
							files : e.dataTransfer.files
						});
						
					}
				},
				
				read : function(args){
					
					var ele = args.ele || false;
					var wrapper = $(ele).parents('._-ui--file-upload').get(0);
					var files = args.files || (ele && ele.files ? ele.files : false);
	
					try{
						var reader = new FileReader();
						
						for(var i in files){
							
							if(files.hasOwnProperty(i)){
											      
								reader.onload = function (e){
									var img = false;
									
									_.log(__t._id + '[ui][img-drop][*load]',i,files[i],wrapper,ele,$(wrapper).find('[data-_-ui-upload-result]'),e.target.result);
									
									$(ele).val('');
									$(wrapper).find('[data-_-ui-upload-result]').val(e.target.result);
								
									
									if(img = $(wrapper).find('._-ui--file-upload--img').get(0)){
										
										
									}else{
										img = new Image();
										img.className='_-ui--file-upload--img';
										wrapper.appendChild(img);
									}
									
										_.log('ui[file-upload]',img,$(wrapper).find('[data-_-ui-upload-result]').val());

									
									img.src = reader.result;								
									
									$(wrapper).addClass('_-selected');
									
								};
								
								reader.readAsDataURL(files[i]);
								
							}
							
						}
					}catch(err){
	//					img._.src=ele.value;
					}
					
				}
				
			},
			ac : function(ele){
				var _class = '_-input--ac',
					key = false;
				
				if(!ele){
					ele = _.sel.ui.forms.ac;
				}
	
				if(_.is.string(ele)){
					if(jQuery){
						(function($){
							_.log('ac2['+ele+']',_.array.nav(_.ac,['features','property']));
	
							_.ui.forms.ac($(ele).toArray());
							
						})(jQuery);
						
						return true;
					}
					
					return false;
				}
				
				if(_.is.array(ele)){
					if(ele.length == 0){
						return false;
					}
					
					var ret = [];
					for(var i in ele){
						if(ele.hasOwnProperty(i)){
							ret[i] = _.ui.forms.ac(ele[i]);
						}
					}
					
					return ret;
				}
				
				_.log('ac3[' + ele.getAttribute('ac') + ']',ele);
				
				if(_.is.object(ele) && (attr = ele.getAttribute('ac'))){
					ret = false;
					
					if(jQuery){
						(function($){
						
							var attrs = [attr];
							
							if($(ele).attr('ac-type')){
								attrs.push($(ele).attr('ac-type'));
							}
							
							// TODO - attrs.length == 0 ?
							
							var source = _.array.nav(_.ac,attrs);
							
							if(!source){ // list hasn't been loaded yet -> load, then add element later
								_.ui.forms.init.ac(attrs,ele);
								
								return false;
							}
							
							$(ele).autocomplete({
								source : source,
								minLength : 2
							});
							
							ret = true;
							
	//						_.ui.forms.ac($(ele).toArray());
							
							/* ~EN: pretty sure we can hinge on jQuery's autocomplete, so let's not worry about events for now *
							$(document).on(_.ui.forms.e.infinite,ele); */
							
						})(jQuery);
					}
					
					return ret;
				}
			},
			i : {
				ac : 0,
				infinite : 0	
			},
			infinite : function(ele){
				var _class = '_-input--infinite',
					key = false;
				
				if(!ele){
					ele = _.sel.ui.forms.infinite;
				}
	
				if(_.is.string(ele)){
					if(jQuery){
						(function($){
							
							_.ui.forms.infinite($(ele).toArray()); //wrap all elements
							$(document).on(_.ui.forms.e.infinite,ele);
							
						})(jQuery);
						
						return true;
					}
					
					return false;
				}
				
				if(_.is.array(ele)){
					if(ele.length == 0){
						return false;
					}
					
					var ret = [];
					for(var i in ele){
						if(ele.hasOwnProperty(i)){
							ret[i] = _.ui.forms.infinite(ele[i]);
						}
					}
					
					return ret;
				}
				
				if(ele.currentTarget){ //passed an event -> actually do stuff
					var e = ele;
					ele = e.currentTarget;
	
					_.log('infinite[e]',e);
	
					key = ele.keyCode;
					clone = false;
					
					var wrapper = ele.parentNode || ele;
					var parent = wrapper.parentNode || wrapper;
					var next = false;
					
					_.log('infinite['+ele.tagName+']',$(ele).next().length,ele,ele.nextSibling);
					
					if(!jQuery){
						return false;
					}
					
					(function($){
					
						wrapper = $(ele).parents(_class)[0] || $(ele).parent()[0] || ele;
						parent = $(wrapper).parent()[0] || wrapper;
						next = $(wrapper).next()[0] || next;
						
					
						if($(wrapper).next().length == 0 && $(ele).val()!=''){
							
							if(ele == wrapper || !$(wrapper).hasClass(_class)){ //is not in wrapper -> wrap
								_.ui.forms.infinite(ele);
							}
							
							_.log('inf[parent]',wrapper,parent);
						
							$(wrapper).removeClass('_-blank');
							clone = $(wrapper).clone()[0];
							$(clone).addClass('_-blank');
	//						_.ui.forms.infinite([clone]); //we need to apply events to this new element
							$(clone).find(_.sel.ui.forms.infinite).val('');
							
							// TODO - move to isolated events cloning function
							_.ui.forms.ac($(clone).find(_.sel.ui.forms.ac)[0]);
							$(parent).append(clone);
							_.log('infinite[add]',$(ele).next().length,ele.nextSibling,clone);
						}else if($(ele).val()==''){					
							$(wrapper).addClass('_-blank');
						
							_.log('inf[blank]',key,_.key.keys.backsp,next,$(next).hasClass('_-blank'));
							if(next && $(next).hasClass('_-blank')){ //remove extra class
								$(next).remove();
							}
						}
						
					})(jQuery);
					
				}else{ //passed an object -> wrap; set an event
					if(jQuery){
						
						(function($){
						
							if(!ele.name.endsWith('[]')){
								ele.name += '[]';
							}
							
							var wrapper = parent = false;
							if($(ele).parent().hasClass(_class)){ //is in wrapper
								wrapper = parent = $(ele).parent()[0];
							}else{ // needs to be wrapped
								if($(ele).parent().length > 0){
									parent = $(ele).parent()[0];
								}
								wrapper = $('<div class="' + _class + ' ' + _class + '--' + ele.tagName.toLowerCase() + '"></div>').append(ele);
								
								if(parent){
									$(parent).append(wrapper);
								}
								
	//							parent = wrapper;
							}
							
							if($(ele).val()==''){
								$(ele).addClass('_-blank');
							}else{
								$(ele).removeClass('_-blank');						
							}
							
							$(ele).on(_.ui.forms.e.infinite); //set events
							
						})(jQuery);
						
						return true;
					}
				}
				
				return false;
			}
		},
		// navigation functions
		nav : {
			filter : function(ele,list){
				if(!ele)
					return false;
					
				var e = close = pages = false;
				
				if(ele.currentTarget){ // passed event
					e = ele;
					ele = ele.currentTarget;
				}
				
				var q = ele.value;
				
	/*			if(q.length < _.cfg.nav.filter.q.min_length){
					return false;
				}*/
				
				(function($){
				
					close = $(ele).siblings('.q--clear')[0];
					
					if(close){
						if(q){
							$(close).show();
						}else{
							$(close).hide();
						}
					}
				
					list = list || $(ele).parents('._-menu').children('._-listing')[0] || false;
					pages = $(list).find('._-page');
					
					_.log('@@@pages',q,$(pages).not(':hidden'));
					
					$(pages).each(function(i,page){
						var text = $(page).find('._-page--name').text(),
							regex = new RegExp(q,'gi');
						
						
						if(text.match(regex)){
							// show ele
							$(page).show();
						}else{
							$(page).hide();
						}
					});
					
					if(close){
						if($(pages).not(':hidden').length > 0){
							$(close).removeClass('_-not-found').addClass('_-found');
						}else{
							$(close).removeClass('_-found').addClass('_-not-found');
						}
					}
					
				})(jQuery);
				
			},
			search : {
				clear : function(e){
					_.log('admin[nav][search][clear]',e.currentTarget);
					
					var ele = e.currentTarget || e;
					
					e.stopPropagation();
					
					(function($){
						
						$(ele).siblings('.input--text').val('');
						_.ui.nav.filter(ele);
						$(ele).hide();
						
					})(jQuery);
				},
				focus : function(e){
					e.stopPropagation();
				}
			}
		}
	}
	
	_.ui.editors.wysiwyg.e = {
		frame : {
			'keyup._.wysiwyg.keyup'	: _.e.keyup,
			'keydown._.wysiwyg.keydown'	: _.e.keydown
		},
		gallery : {
			
		},
		img : {
			'mouseenter._.wysiwyg.img'	: _.ui.editors.wysiwyg.fn.img.mouseenter,
			'drag._.wysiwyg.img'	: _.ui.editors.wysiwyg.fn.drag
		},
		links : {
			'click._.wysiwyg.link'	: _.ui.editors.wysiwyg.fn.link
		},
		'_.wysiwyg.init'	: _.ui.editors.wysiwyg.fn.show,
		'_.wysiwyg.cleanup'	: _.ui.editors.wysiwyg.fn.destroy,
		'_.wysiwyg.destroy'	: _.ui.editors.wysiwyg.fn.destroy
	};
	
	_.ui.forms.e = {
		ac : {
			// event name/context	function
			'keyup._.form.ac.keyup' : _.ui.forms.ac
		},
		infinite : {
			// event name/context	function
			'keyup._.form.infinite.keyup' : _.ui.forms.infinite
		}
	};
	
	_.ui.nav.e = {
		filter : {
			clear : {
				'click._.nav.filter.click' : _.ui.nav.search.clear
			},
			q : {
				'keyup._.nav.filter.keyup' : _.ui.nav.filter,
				'click._.nav.filter.click' : _.ui.nav.search.focus,
				'focus._.nav.filter.focus' : _.ui.nav.search.focus
			}
		}
	};


	$(document).ready(function(){
		_.ui.init();
	});
	
})(jQuery,_);				
				// } 09.ui.js # (23 / 25) 

			
				// # (24 / 25) 99._.api.sfm.js {

// ~EN: SFM web api {

(function(_, $, ko){

	var __class = {
		_ : 'SFM',
		parents : ['API']
	};
	
	var __t = {}; // ~EN (2014): semi-global "this" identifier

	_._.add({
		_class : __class,
		base : _._.api, // remember to put apis in the api context
		constructor : function(args){
		
			_._.parentConstruct(this,arguments,__class);
		
			var _app = false;
		
			var _t = __t = this; //for scope reasons
			this._id = __class._;
			this._cmd = 'sfm';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add
			this.uuid = '';
			
			this.cfg = this.cfg || {};
			
			this.cfg.results_per_row = 4;
	
			this.auth = {
				user : false,
				pass : false,
				token : false, // server-returned hash to use on additional requests
				hash : false // hash of username + : + password -> 0b64
			};
			
			this.layers = {
				chrome : false
			};
			
			this.needs_auth = false; // will bypass auth requirements/headers if set to false			
			
			this.scroll = {
				ele : false,
				data : false
			};
									
			this.terms = {};
			
			this.templates = {
				header : (args ? args.tem.header || args.templates.header : false),
				footer : (args ? args.tem.footer || args.templates.footer : false)
			};
			
			this.timeline = false;
			this.timeline_ele = false;
			
			this.version = 'v1';
			this.urls = {
				base : '-',
				protocol : 'http',
				host : window.location.hostname,
				load : 'load',
				q : 'q',
			};
			
			this.chrome = {
				show : function(){
					if(!_t.layers.chrome){
						return _t.render_template('chrome');
					}
					
					$(_t.templates.header).show();
					$(_t.templates.footer).show();
					
					return true;
				},
				hide : function(){
					$('#'+_t.templates.header.id).hide();
					$('#'+_t.templates.footer).hide();
					
					return true;					
				}
			};
			
/*			this.search = function(data, e){
				_.log(this._id+'[search]',data,e);
			};*/
			
			this.ViewModel = new _._.ViewModel();
			this.ViewModel_setup();
			
			// call the linked-list-only init (because subclasses override this.init, and calling this.init here would call subclass.init)
			this.init();
			
		},
		proto : {
			
			admin : {
				vacations : {
					_ : {
						itin : {
							days : 0,
							nights : 0,
							day : [],
							night : []
						}	
					},
					init : function(args){
						
						if(args.map){
							__t.map._ = new __t.Map({
								ele : args.map,
								view_mode : 'single'
							});
						}
						
						var itin = {
							days : 0,
							nights : 0,
							day : [],
							night : []
						}, field = null;
						
						$('[data-_-vacation-migrate="url"]').change(function(e){
							var ele = e.currentTarget;
							var url = '/-/proxy/' + Base64.encode(ele.value).toString();
							
							_.log('@@@',url);
							
							$.ajax({
								url : url,
								success : function(data){
									var $data = $(data);
									var $detail = $data.find('.detail');
									$detail.find('.back_map_view, .other_trips, .clear, .destination--testimonial').remove();
									
									var detail = $detail.html();
									
									$('input[data-_-vacation-field="name"]').val($('h1',$data).text());
									
									if(CKEDITOR && CKEDITOR.instances['vacation[details]']){
										CKEDITOR.instances['vacation[details]'].setData(detail);
									}else{
										$('textarea[data-_-vacation-field="details"]').val(detail);
									}
									
									var img_src = false;
									
									if(img_src = $data.find('.destination_pic').attr('src')){
										
										var img = $('._-ui--file-upload ._-ui--file-upload--img').get(0);
										var img_data = $('._-ui--file-upload [data-_-ui-upload-result]').get(0);
										var img_src_ext = img_src.substr(img_src.lastIndexOf('.')+1)
										
										$(img).attr({
											'src' : '/-/proxy/' + Base64.encode('http://www.sunfunmedia.com' + img_src).toString(),
											'data-src' : img_src,
											'data-src-ext'	: img_src_ext
										}).load(function(e){											
											// create an empty canvas element
											var canvas = document.createElement("canvas"),
											canvasContext = canvas.getContext("2d");
											
											//Set canvas size is same as the picture
											canvas.width = img.width;
											canvas.height = img.height;
											
											// draw image into canvas element
											canvasContext.drawImage(img, 0, 0, img.width, img.height);
											
											// get canvas contents as a data URL (returns png format by default)
											var dataURL = img_data.value = canvas.toDataURL(img_src_ext ? 'image/' + img_src_ext : '');

											_.log('ui[file-upload]',img,dataURL,$(wrapper).find('[data-_-ui-upload-result]').val());


										});
										
/*										$.ajax({
											url : '/-/proxy/' + Base64.encode('http://www.sunfunmedia.com' + img_src).toString(),
											success : function(data2){
												_.log('$$$',data2);
											}
										});*/
									
									}
									
								},
								error : function(xhr,status,err){
									_.log('@@@',err);
								}
							});
						});
						
						
						if(field = $('[data-_-vacation-itin-control="day"]').get(0)){
							
							
							var f = function(e){
																
								if(!parseInt(field.value) || (e && e.keyCode && _.key.is_meta(e.keyCode))){
									return false;
								}
								
								itin.days = parseInt(field.value);
								
								var attr = 'data-_-vacation-itin-day';
								
								var rows = $('[' + attr + ']');
								
								var tr = $(rows).get(0);
								var tr_parent = tr.parentNode, clone = false;
								
								
								if(!rows.length || (rows.length < itin.days)){ // ~EN (2015): add rows
									
									for(var i=rows.length+1; i<=itin.days; i++){
										clone = $(tr).clone();
										$(clone).attr(attr,i).find('._-input--text').attr('placeholder','Itinerary - Day #' + i).val('');
										$(clone).find('._-table--vacations--itin--num').text(i);
										$(clone).appendTo(tr.parentNode);
										
										_.log(__t._id + '[ui][infinite][clone]',i,clone,tr.parentNode);
								
									}
									
								}else if(rows.length > itin.days){
									
									for(var i=rows.length; i > itin.days; i--){
										$(tr.parentNode).find('[' + attr + '="' + i + '"]').remove();
									}
									
								}
								
								$(tr_parent).find('[data-_-vacation-itin-day="1"] ._-input--text, [data-_-vacation-itin-day="' + itin.days + '"] ._-input--text').val($(tr_parent).parents('form').find('[data-_-vacation-field="city--name"]').val());
								
							};
							
							$(field).on('change keyup', f);
							f();
							
						}
						
						__t.admin.vacations._.itin = itin;
							
					},
				}
			},
			
			get : function(args){
				if(!args || !args.svc){
					return false;
				}
				
				// abstract context for use in jquery functions
				var _t = this;
				
				if(args.svc == 'lookup' || args.svc == 'q'){
				
				}else if(args.svc == 'layout'){ // GET from local server (header/footer/chrome)
					_.log('? sfm[ajax][?]['+args.svc+']',this.url({svc : args.svc}),args);
					$.ajax({
						type : 'GET',
						url : this.url({svc : args.svc}),
						success : args.success || args.callback,
						failure : args.failure || args.fail || function(err){
							_.log('--- sfm[ajax]['+args.svc+'][fail]',err);
						}
					})
				
				}else if(args.svc == 'login' || args.svc == 'profile' || args.svc == 'lookup'){ // GET + auth
					_.log('? sfm[ajax][?]['+args.svc+']',this.url({svc : args.svc}),args);
					$.ajax({
						type : 'GET',
						url : this.url({svc : args.svc}),
	//					data : JSON.stringify(args.data ? args.data : {}),
						data : {},
						contentType : 'application/json; charset=utf-8',
						beforeSend : function(xhr){
							xhr.setRequestHeader('Authorization','basic '+_t.auth.hash);	
						},
						error: function (xhr, ajaxOptions, thrownError) {
							_.log('--- sfm[ajax]['+args.svc+'][err]',xhr,ajaxOptions,thrownError);
						},
						success : args.callback,
						failure : function(err){
							_.log('--- sfm[ajax]['+args.svc+'][fail]',err);
						}
					});		
				}else if(args.svc == 'forgot' || args.svc == 'reset'){ // POST - no auth
					_.log('? sfm[ajax][?]['+args.svc+']',this.url({svc : args.svc}),args);
					$.ajax({
						type : 'POST',
						url : this.url({svc : args.svc}),
						data : JSON.stringify(args.data ? args.data : {}),
						contentType : 'application/json; charset=utf-8',
	//					beforeSend : function(xhr){
	//						xhr.setRequestHeader('Authentication','basic '+_t.auth.hash);	
	//					},
						success : args.callback,
						failure : function(err){
							_.log('--- sfm[ajax][fail]',err);
						}
					});				
				}else{ // POST + auth
					_.log('? sfm[ajax][?]['+args.svc+']',this.url({svc : args.svc}),args);
					$.ajax({
						type : 'POST',
						url : this.url({svc : args.svc}),
						data : {},
						contentType : 'application/json; charset=utf-8',
						beforeSend : function(xhr){
							xhr.setRequestHeader('Authorization','basic '+_t.auth.hash);	
						},
						success : args.callback,
						failure : function(err){
							_.log('--- sfm[ajax][fail]',err);
						}
					});				
				}
			},
			
			/* ~EN (2014): pages really shouldn't do any routing themselves, rather, groups of pages can route between them
				-> should direct commands to this.timeline -> router */
			go : function(cmd,data){
			
				var _t = (this instanceof _._.ViewModel ? _.api.sfm : this);
			
				if(!cmd)
					return false;
					
				if(cmd == 'view'){
				
					return (data.uuid && (data.uuid!='') ? _t.redirect(_t.url({ svc : cmd, data : data, hashchange : true })) : false);
				}else if(cmd == 'search'){
					
					return (data.q && (data.q!='') ? _t.redirect(_t.url({ svc : cmd, data : data, hashchange : true})) : false);
				}
				
				/* ~EN (2014): remember, pages shouldn't control navigation, that's what page controllers (timelines/page-groups) are for! */
				if(!_t.auth.user || _t.auth.hash){
					_t.timeline.go('login');
				}else if(cmd == 'login' && _t.auth.user && _t.auth.hash){
					_.log('##' + _t._id + '[go][*block]',cmd);
					return false;
				}else if(cmd == 'next'){
					_t.timeline.nextPage();
				}else if(cmd == 'prev'){
					_t.timeline.prevPage();
				}else{
					_t.timeline.go(cmd);
				}
		
			},
			
			init : function(args){
				var form = false, _t = this;
				
				this.register();
//				this.load();

				$(document).ready(function(){

					var slide_args = {
						play : 15000,
//						play : 0,
						animation : 'slide'
					};
					
					_.field.init();
					
					var map = false;
					
					if(map = $('._-page--vacations ._-map--wrapper ._-map').get(0)){
//						_t.vacations.init();
						_t.map._ = new _t.Map({
							ele : map,
							fullscreen : true,
							zoom : 3,
							center : {
								lat : 15,
								lng : -35
							}
						});
					}else if($('._-page--admin-vacations').get(0)){
						
						_t.admin.vacations.init({
							map : $('._-page--admin-vacations ._-map--wrapper ._-map').get(0)
						});
						
					}
					
					if($('._-page--home ._-gallery--wrapper').length){
					
						$('._-page--home ._-gallery--wrapper').superslides(slide_args).on('animating.slides',function(e){ // slide begin animation
	//						$('._-footer--top--pointer').css('visibility','hidden');
							$('._-footer--top--pointer').fadeTo(125,0);
	//						_.log('###',e,this);
						}).on('animated.slides',function(e){ // slide end animation
							var slide = $(this).find('._-gallery--slide--current').get(0);
							
							if(!slide){
								return;
							}
	
							var slug = slide.getAttribute('data-slug');
							
							if(!slug){
								return;
							}
							
	//						$('._-footer--top--pointers ._-footer--top--pointer[data-slug="' + slug + '"]').css('visibility','visible');
							$('._-footer--top--pointers ._-footer--top--pointer[data-slug="' + slug + '"]').fadeTo(125,1);
							
							_.log('gallery[e][animated][slides]',slide,slug, $('._-footer--top--pointers ._-footer--top--pointer[data-slug="' + slug + '"]'));
						});
						
						
					}else if(wrapper = $('._-page ._-gallery--sub--wrapper').get(0)){
						if($(wrapper).find('._-gallery[data-_-gallery-init="false"]').length){
							
							$(wrapper).attr('data-_-gallery-init',false);
							
							slide_args.play = false;
						}else{
							$('._-page ._-gallery--sub--wrapper').superslides(slide_args);
						}
					}
					
//					_t.init_links();
//					_t.init_page();

					_t.nav.footer.scroll.init();
											
				});

			},
			
			init_links : function(args){
				var _t = this;
				
				$('a[href]').each(function(i,ele){
				
					var href = ele.getAttribute('href');
					
					if(ele.hasAttribute('data-href') || href.startsWith('#') || href.startsWith('/#') || !href.startsWith('/')){
						return;
					}
					
					ele.setAttribute('href', '/#!/-' + href);
					ele.setAttribute('data-href',href);
					
				});
				
			},
			
			init_page : function(page){
				var _t = this;
				
				page = page || _.page;
				
				if(!page || !page.slug){
					return false;
				}
				
				/* ~EN (2014): initialise scrolling */				
				if(!this.scroll.ele && (this.scroll.ele = $('[data-page-modal="false"] ._-step--overflow').get(0))){
				
					$(this.scroll.ele).jScrollPane({
//						addTo : $('._-timeline')[0],
						addTo : page.ele,
			//			animateEast : portfolio_scroll_transition,
						animateScroll : true,
						autoReinitialise : true,
						showArrows : false
					});

					this.scroll.data = $(this.scroll.ele).data('jsp');
					
					/* ~EN (2014): jScrollPane will not auto-reinit scrolling if the scroll height changes,
							so we have to figure out would change that, and make it re-init itself */
							
					var f = function(e){
						_t.scroll.data.reinitialise();
					};
					
					/* ~EN (2014): while jScrollPane's auto-init does a decent job, manually calling it makes window resizing smoother */
//					$(':input').change(f);
					$(window).resize(f);
					
				}
								
//				page.layer.insert({ page : page });
//				page.layer.show();
			},
			
			e : {
				back : {
					click : function(data,e){
						var vm = (this instanceof _._.ViewModel ? this : this.ViewModel);
						
						_.log(this._id + '[back][click]',data,e);
						
						vm.view('listing');
					}
				},
				form : {

				},
				load : {
					success : function(data,textStatus,xhr){
						if(this.server.response.success(data)){
							return this.ViewModel_setup(this.ViewModel,data);
						}
						
						return false;
					}
				}
			},

			load : function(args){
				vm = (args && args.vm ? args.vm : this.ViewModel);
				
				if(!vm){
					return false;
				}
				
				var _t = this,
					cache = false;
					
/*				if(cache = this.cache_get()){
					var data = cache.sfm;
					
					_.log(this._id + '[*load][cache]',data);
					
					return this.e.load.success.call(this, data);
				}				
				*/
				return this.get({
					svc : 'load',
					success : function(){
						_t.e.load.success.apply(_t,arguments);
					}
				});

			},
			
			map : {
				_ : null,
				styles : [
					{
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#65c484"
				            }
				        ]
				    },
					{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#444444"
				            }
				        ]
				    },
					{
						"featureType": "administrative.province",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#222222"
				            },
							{
								"weight": "0.50"
				            }
				        ]
				    },
				    {
						"featureType": "administrative.neighborhood",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [
							{
								"color": "#65c484"
				            }
				        ]
				    },
					{
						"featureType": "poi",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "road",
						"elementType": "all",
						"stylers": [
							{
								"saturation": -100
				            },
							{
								"lightness": 45
				            }
				        ]
				    },
					{
						"featureType": "road",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#9ed195"
				            },
							{
								"weight": "0"
				            }
				        ]
				    },
					{
						"featureType": "road",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"weight": "0"
				            }
				        ]
				    },
					{
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "simplified"
				            }
				        ]
				    },
					{
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#9ed195"
				            },
							{
								"weight": "0.75"
				            },
							{
								"lightness": "31"
				            }
				        ]
				    },
					{
						"featureType": "road.arterial",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"weight": "0.5"
				            }
				        ]
				    },
					{
						"featureType": "road.arterial",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "road.local",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"weight": ".25"
				            }
				        ]
				    },
					{
						"featureType": "road.local",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "transit",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
				            }
				        ]
				    },
					{
						"featureType": "water",
						"elementType": "all",
						"stylers": [
							{
								"color": "#00b3d1"
				            },
							{
								"visibility": "on"
				            }
				        ]
				    }
				]
			},
			
			Map : function(args){ // map subclass
				
				var _t = this;
				
				this.ele = args.ele;
				
				this.center = args.center || {
/*					lat: 41.3190,
					lng: -72.9449*/
					lat : 28.784251,
					lng : -81.357936
				};
				
				this.fullscreen = args.fullscreen || false;
				this.view_mode = args.view_mode || 'default';
				this.zoom = args.zoom || 6;
				
				if(this.fullscreen){
					this.ele.style.width = window.outerWidth + "px";
					this.ele.style.height = window.outerHeight + "px";
					this.view_mode = 'fullscreen';
				}
				
				this.options = args.options || {
					center: this.center,
					zoom: this.zoom,
					mapTypeControl : false,
					streetViewControl :false,
					styles: args.styles || __t.map.styles
				};
				
				this.map = new google.maps.Map(this.ele,this.options);
				this.places = new google.maps.places.PlacesService(this.map);
				this.markers = {};
				
				this.add_marker = function(args){
					var lat, lng, loc, marker = {};
					
					if(args.loc){
						lat = args.loc.lat || args.lat;
						lng = args.loc.lng || args.lng;
					}else{
						lat = args.lat;
						lng = args.lng;
					}
					
					loc = {
						lat : lat,
						lng : lng
					};
					
					var title = args.title || '';
					
					marker.LatLng = new google.maps.LatLng(lat,lng);
					marker._ = new google.maps.Marker({
						position : marker.LatLng,
						map : _t.map,
						title : title
					});
					
					if(!_.admin._){
					
						marker.infobox = new InfoBox({
							content : _t.infobox_content(args),
							disableAutoPan: false,
							maxWidth: 150,
							pixelOffset: new google.maps.Size(-140, -100),
							zIndex: null,
							boxStyle: {
	//							background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
	//							opacity: 0.75,
								width: "360px"
							},
							infoBoxClearance: new google.maps.Size(1, 1)
						});
						
					}
					
					google.maps.event.addListener(marker._, 'click', function() {
						
						for(var i in _t.markers){
							if(_t.markers.hasOwnProperty(i) && _t.markers[i].infobox){
								_t.markers[i].infobox.close();
							}
						}
						
						if(marker.infobox){
							marker.infobox.open(_t.map, this);
						}
						
						var zoom_thresh = 6;
						
						if(_t.map.getZoom() < zoom_thresh){
							_t.map.setZoom(zoom_thresh);
						}

						_t.map.panTo(loc);
					});
					
					_t.markers[lat + "|" + lng] = marker;
				};
				
				this.infobox_content = function(args){
					_.log(__t._id + '[map][infobox][content]',args);					
					
					var html =
//						'<a class="_-map--infobox--wrapper" href="/vacations/map/' + args.slug + '">' +
						'<a class="_-map--infobox--wrapper" href="#/sfm/map/' + args.slug + '">' +
							'<div class="_-map--infobox">' +
								'<h2 class="_-map--infobox--title">' + args.title + '</h2>' +
								'<p>' + args.len + ' Vacation' + (args.len !== 1 ? 's' : '') + ' at this Destination ' + '<span class="_-icon _-icon--arrow--right">&#9658;</span></p>' +
								'<ul class="_-map--infobox--types">' +
									'<li class="_-map--infobox--type _-map--infobox--type--land ' + (args.dests && args.dests._.types.land ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-land"></span>' +
							    			'<span class="_-text">Land</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.land ? args.dests._.types.land : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--air ' + (args.dests && args.dests._.types.air ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-air"></span>' +
							    			'<span class="_-text">Air</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.air ? args.dests._.types.air : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--vacation ' + (args.dests && args.dests._.types.vacation ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--vacations"></span>' +
							    			'<span class="_-text">Vacation</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.vacation ? args.dests._.types.vacation : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--destination-cruise ' + (args.dests && args.dests._.types.cruise ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-cruise"></span>' +
							    			'<span class="_-text">Cruise</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.cruise ? args.dests._.types.cruise : 0) + '</span>' +
						    		'</li>' +
						    	'</ul>' +
							'</div>' +
						'</a>';
						
					return $(html)[0];
				};
				
				this.nearby = function(args,callback){
					if(!args){
						return false;
					}
					
					callback = callback || args.callback;
					
					var loc = args.loc || _t.center;
					var radius = (args.radius ? args.radius : 5000);
					var types = args.types || args.type || [];
					
					if(_.is.string(types)){
						types = types.split('|');
					}
					
					return _t.places.nearbySearch({
						location : new google.maps.LatLng(loc.lat,loc.lng),
						radius : radius,
//						rankBy : google.maps.places.RankBy.DISTANCE,
						types : types
					},callback /*function(results,status){
						
						var ret = [];
						
						if(!results){
							return callback(results,status);
						}
						
/*						for(var i in results){
							if(results.hasOwnProperty(i)){
								// ~EN (2014): each result contains only partial place data, and we need to get more details
								_t.places.getDetails(results[i].reference, function(place, st2){
									ret.push({
										nearby : results[i],
										place : place
									});
								});
							}	
						}*
						
						callback(results,status);
					}*/);
					
				};
				
				this.nearby_airports = function(args,callback){
					callback = callback || args.callback;
					
					var loc = args.loc || _t.center;
					var radius = (args.radius ? args.radius : 250);
					
					//http://api.geonames.org/findNearby?lat=40.776902&lng=-73.968887&fcode=AIRP&radius=25&maxRows=100&username=sunfunmedia
					//http://ws.geonames.org/findNearbyJSON?lat=40&lng=9&radius=250&featureClass=S&featureCode=AIRP&username=sunfunmedia
					
//					var url = 'http://api.geonames.org/findNearby?1';
					var url = 'http://ws.geonames.org/findNearbyJSON?1';
					
					$.ajax({
						dataType : 'json',
						type : 'GET',
						url : url,
						data : {
							lat : loc.lat,
							lng : loc.lng,
							code : 'AIRP',
							radius : radius,
							featureClass : 'S',
							featureCode : 'AIRP',
							username : 'sunfunmedia'
						},
						success : function(data){
							_.log(__t._id + '[ui][nearby-airports][*get]',data);
							
						}
					});
				};
				
				this.overlays = {
					_ : {
						overlay : false,
						content : false,
						shown : false
					},
					dest : function(hash,args){
						var overlay = _t.overlays._.overlay || $('._-over--map').get(0) || $('<div class="_-over _-over--map"><span class="_-bg--noise"></span><div class="_-over--content"></div></div>').appendTo('body').get(0);
						_t.overlays._.overlay = overlay;
						
						var content = _t.overlays._.content || overlay.getElementsByClassName('_-over--content')[0];
						_t.overlays._.content = content;
						
						$(overlay).hide();
						
						if(hash.length > 1){
							
							$.ajax({
								url : '/vacations/' + args.hash,
								success : function(data){
									
									_t.overlays.show({data : data, hash : args});
									
								}
							});
							
						}else if(hash.length = 1){
							var city = hash.shift();						
							
							$.ajax({
								url : '/vacations/map/' + city,
								success : function(data){
									
									_t.overlays.show({data : data, hash : args});
									
								}
							});

						}

					},
					show : function(args){
						
						var data = args.data;
						
						$('body > ._-page').addClass('_-has--over');
						
						var data = $(data)[0];
						
						$(_t.overlays._.content).html('').append(data);
						$(_t.overlays._.overlay).show();
						
						_.log('@@@',args.hash);
						
						$(document).on('click','._-over--map ._-over--content ._-btn--back',function(e){
							e.preventDefault();
							
							window.location.href='#/sfm/map';
						});
						
						_t.overlays._.shown = true;
						
						_.log(__t._id + '[Map][overlay][show]',$('._-over--map ._-over--content ._-btn--back'),_t.overlays._.overlay);
					},
					hide : function(args){
						
						if(!_t.overlays._.shown){ // already hidden
							return false;
						}
						
						_.log(__t._id + '[Map][overlay][hide]',args,_t.overlays._.overlay);						
						
						$(_t.overlays._.content).html('');
						$(_t.overlays._.overlay).hide();
						$('body > ._-page').removeClass('_-has--over');
						_t.overlays._.shown = false;
						
						return true;
					}
				};
				
				this.recenter = function(loc){
					_t.center = loc;	
					_t.map.setCenter(_t.center);
					
					if(_t.view_mode == 'single'){
						_t.remove_markers();
						_t.add_marker({
							loc : loc
						});
					}
				};
				
				this.remove_markers = function(){
					if(!_t.markers){
						return false;
					}
					
					for(var i in _t.markers){
						if(_t.markers.hasOwnProperty(i)){
							_t.markers[i]._.setMap(null);
						}
						
						delete _t.markers[i];
					}
				};
				
				this.resize = function(e){
					_.log(__t._id + '[Map][resize]',e,_t.map);
					_t.center = _t.map.getCenter();
					google.maps.event.trigger(_t.map,'resize');
					_t.map.setCenter(_t.center);
					
					if(_t.fullscreen){
						_t.ele.style.width = window.outerWidth + "px";
						_t.ele.style.height = window.outerHeight + "px";
					}

				};
				
				var minZoomLevel = 3;
				google.maps.event.addListener(this.map, 'zoom_changed', function() {
					if (_t.map.getZoom() < minZoomLevel) _t.map.setZoom(minZoomLevel);
				});
				

				
				if(this.view_mode == 'single'){
					this.remove_markers();
					this.add_marker({
						loc : this.center
					});
				}else if(this.view_mode == 'fullscreen'){
					// ~EN: set up markers
					$.getJSON('/-/vacations',function(data){

						_.log(__t._id + '[Map][*load][markers]',data);
						
						for(var i in data){
							if(data.hasOwnProperty(i)){
								
 //								if(data[i].length === 1){
									
									var dests = data[i];
									
									_t.add_marker({
										loc : data[i]._.loc,
										len : data[i]._.len,
										title : i,
										slug : data[i]._.slug,
										dests : data[i],
									});
//								}
							}
						}

					});
				}
				
				$(window).resize(this.resize);
				
/*				google.maps.event.addDomListener(this.map, 'tilesloaded', function(){
					$('div.gmnoprint').last().parent().wrap('<div class="_-map--controls" />');
				});*/
				
			},
			
			nav : {
				footer : {
					scroll : {
						at_left : function(ele){
							ele = ele || this.ele;
							
							return ele.scrollLeft == 0;	
						},
						at_right : function(ele){
							ele = ele || this.ele;
							
							return ele.scrollLeft + ele.offsetWidth >= ele.scrollWidth;	
						},
						e : function(e){
							if(this.at_left()){
								$(this.buttons.left).addClass('_-hide');
							}else{
								$(this.buttons.left).removeClass('_-hide');
							}
							
							if(this.at_right()){
								$(this.buttons.right).addClass('_-hide');
							}else{
								$(this.buttons.right).removeClass('_-hide');
							}
							_.log('ui[nav][scroll][e]',this.at_left(),this.at_right(), this.ele.scrollLeft, this.ele.scrollWidth);
						},
						easing :'easeInQuad',
						increment : function(){
							return $(this.ele).find('._-nav--item').width() * 2;		
						},
						init : function(){
							this.wrapper = $('._-footer--scroll--wrapper')[0];
							this.ele = $(this.wrapper).find('._-chrome--footer--scroll')[0];
							this.buttons = {
								_ : $(this.wrapper).find('._-footer--scroll--buttons')[0]
							};
							
							this.buttons.left = $(this.buttons._).find('._-footer--scroll--buttons--left')[0];
							this.buttons.right = $(this.buttons._).find('._-footer--scroll--buttons--right')[0];
							
							var _t2 = this;
							
							$(this.ele).scroll(function(e){
								_t2.e.apply(_t2,e);
							}).scroll();
							
							
							$(this.buttons.left).click(function(e){
								_t2.left.apply(_t2,e);
							});
							
							$(this.buttons.right).click(function(e){
								_t2.right.apply(_t2,e);
							});
							
							this.nav_item();

						},
						left : function(e){
							var ele = e ? (e.currentTarget || e) : false;
							
							var pos = this.ele.scrollLeft - this.increment();
							
							if(pos < 0){
								pos = 0;
							}

/*							if(pos <= 0){
								$(ele).hide();
								return;
							}*/
							
							$(this.ele).animate({
								scrollLeft : pos
							},{
								easing : this.easing	
							});
							
							_.log("ui[nav][scroll][left]",this.ele);
						},
						nav_item : function(e){
							var pos = this.ele.scrollLeft;
							var ele;
							
							if(!(ele = $(this.ele).find('._-footer--nav ._-nav--item._-selected').get(0))){
								return false;
							}
							
							this.ele.scrollLeft = ele.offsetLeft;
							
//							_.log('###!',);
						},
						right : function(e){
							var ele = e ? (e.currentTarget || e) : false;
							
							var pos = this.ele.scrollLeft + this.increment();
							
							if(pos > this.ele.scrollWidth){
								pos = this.ele.scrollWidth;
							}

/*							if(pos <= 0){
								$(ele).hide();
								return;
							}*/
							
							$(this.ele).animate({
								scrollLeft : pos
							},{
								easing : this.easing	
							});
							
							_.log("ui[nav][scroll][right]",this.ele,this.increment());
						}
					}
				}	
			},
			
			noise : {
				draw : function(ele){
					var canvas;
					
					if(!(canvas = $(ele).find('canvas').get(0))){
						canvas = document.createElement('canvas');
						$(ele).append(canvas);
					}
					
					if(!canvas){
						return false;
					}
					
					canvas.width = ele.offsetWidth || window.innerWidth;
					canvas.height = ele.offsetHeight || window.innerHeight;
					
					var ctx = canvas.getContext('2d');
					var color = {
						r : 241,
						g : 242,
						b : 242,
						a : 1
					};
					
					for(var i=0; i<canvas.width; i++){
						for(var j=0; j<canvas.height; j++){
							color.a = (Math.random() * (-.085) + .085).toFixed(3);
							ctx.fillStyle = "rgba(" + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ")";
							ctx.fillRect(i,j,1,1);
						}
					}
					
					_.log('@@@',ele,window.innerWidth,canvas.width,canvas.height,ctx,ele);
					
				},
				points : function(){

					var x1, x2, w, y1, y2;
					
					do {
						x1 = 2.0 * Math.random() - 1.0;
						x2 = 2.0 * Math.random() - 1.0;
						w = x1 * x1 + x2 * x2;
					} while ( w >= 1.0 );
					
					w = Math.sqrt( (-2.0 * Math.log( w ) ) / w );
					y1 = x1 * w;
					y2 = x2 * w;
					
					return [x1, x2, y1, y2];
				}	
			},
			
			q : function(data){
				var q = data.shift() || data;
				_.log(this._id + '[q]',q,data,this.ViewModel.eles.q);
				
				if(q){
					this.ViewModel.eles.q.value = q;
				}
				
//				return this.search({q : q, reset : true});
				return this.search(false,{currentTarget : this.ViewModel.eles.q});
//				this.ViewModel.current(this.terms[uuid]);
//				this.ViewModel.view('single');
			},
			
			redirect : function(url){
				if(!url || url==''){
					return false;
				}
				
				if(url.charAt(0) == '#'){
					window.location.hash = url;
				}else{
					window.location.href = url;
				}
				
				return true;
			},
			
			register : function(args){
				_._[__class.parents[0]].prototype.register.call(this,args);
				
				
			},
			
			render_template : function(tem){				
				if(!tem){
					return false;
				}
				
				_.log(this._id + '[render][tem]',this.templates,tem);
				
				if(tem == 'chrome' && !this.layers.chrome){
					this.layers.chrome = new _._.Layer({
						ele : this.timeline_ele,
						timeline : this.timeline,
						prepend : true
					});
					
					if(this.templates.header){
						document.getElementsByTagName('body')[0].appendChild(this.templates.header);
					}
					if(this.templates.footer){
						document.getElementsByTagName('body')[0].appendChild(this.templates.footer);
					}
					
					return true;
				}
				
				return false;
			},
			
			results_have_next_row : function(){
				var vm = false;
				
				if(this instanceof _._.ViewModel){
					vm = this;
//					_terms = _.api.sfm.terms;
				}else{
					vm = this.ViewModel || _.api.sfm.ViewModel;
//					_terms = this.terms;
				}
				
				return (vm.results_row_i() < vm.results_num_rows() - 1);
			},
			
			results_have_prev_row : function(){
				var vm = false;
				
				if(this instanceof _._.ViewModel){
					vm = this;
//					_terms = _.api.sfm.terms;
				}else{
					vm = this.ViewModel || _.api.sfm.ViewModel;
//					_terms = this.terms;
				}
				
				return (vm.results_row_i() > 0);
			},
			
			results_next_row : function(data, e){
				var vm = false;
				
				if(this instanceof _._.ViewModel){
					vm = this;
//					_terms = _.api.sfm.terms;
				}else{
					vm = this.ViewModel || _.api.sfm.ViewModel;
//					_terms = this.terms;
				}
				
				if(vm.results_row_i() < vm.results_num_rows() - 1){
					vm.results_row_i(vm.results_row_i() + 1);
					
					return true;
				}
				
				return false;
	
			},
			
			results_prev_row : function(){
				var vm = false;
				if(this instanceof _._.ViewModel){
					vm = this;
//					_terms = _.api.sfm.terms;
				}else{
					vm = this.ViewModel;
//					_terms = this.terms;
				}
				
				if(vm.results_row_i() > 0){
					vm.results_row_i(vm.results_row_i() - 1);
					
					return true;
				}
				
				return false;
	
			},
			
			route : function(e,args){		
				var sep = _.router.sep || '/';
				var url = args._url || window.location.pathname.substring(1).split(sep),
					hash = args._hash || window.location.hash.substring(2).split(sep); // ~EN: hash[0] = '#'; hash[1] = '/';
					
				var _url = url.join(sep),
					_hash = hash.join(sep),
					cmd = hash.shift() || 'load';
					
				if(!_hash || !cmd){
					_.log(this._id + '[route][empty]',_hash);
					
					return false;
				}				
				_.log(this._id + '[route]['+cmd+']',_hash,hash);
				
				if(this[cmd]){
					if(cmd == 'map'){
						if(hash.length >= 2){
							return this.map._.overlays.dest(hash,args);
						}else if(hash.length == 1){
							
							return this.map._.overlays.dest(hash,args);
						}else if(!hash.length){
							return this.map._.overlays.hide();
						}
					}

//					this[cmd](hash.shift());
					this[cmd](hash);
				}
/*				
				if(cmd == 'load'){
					return this.load(_hash);
		//			return this.go(_hash);
				}*/
				
			},
			
			server : {
				response : {
					success : function(data){
						return (data && !data.err && data.res ? true : false);
						
					},
					err : function(data){
						return !this.server.response.success(data);
					},
					error : function(data){
						return this.server.response.err(data);
					},
					fail : function(data){
						return this.server.response.err(data);
					}
				}
			},
			
			url : function(args){
				var svc = args.svc || args.service || args;
				
				var showVersion = false;
				
				if(!svc){
					return false;
				}
				
				switch(svc.toLowerCase()){
					case 'layout': // local query
						return  '/'+svc;
						break;
					case 'view':
						return (args.hashchange ? '#' : '') + '/sfm/term/' + args.data.uuid + '/' + args.data.slug;
						break;
					case 'search':
						return (args.hashchange ? '#' : '') + '/sfm/q/' + args.data.q;
						break;
				}
				
				return this.urls.protocol+'://'+this.urls.host+'/'+this.urls.base+'/'+(showVersion ? this.version+'/' : '')+ (this.urls[svc] ? this.urls[svc] : '');
			},
			
			vacations : {
				d3 : {
					projection : false,
					width : window.innerWidth,
					height : window.innerHeight,
					svg : false
				},
				mercator_bounds : function(projection,maxlat){
				    var yaw = projection.rotate()[0],
				        xymax = projection([-yaw+180-1e-6,-maxlat]),
				        xymin = projection([-yaw-180+1e-6, maxlat]);
				    
				    return [xymin,xymax];

				},
				projection : false,
				redraw : function(){},
				resize : function(e){},
				init : function(){},
				init2 : function(){}
			},
			
			ViewModel_setup : function(vm, data){
				var _t = this;
				vm = vm || this.ViewModel || this;
								
				vm.q_empty = ko.observable(true);
				
				vm.freq_high1 = ko.observable(0);
				vm.freq_high2 = ko.observable(0);
				vm.freq_high_avg = ko.observable(0);
				
				vm.freq_low1 = ko.observable(0);
				vm.freq_low2 = ko.observable(0);
				
				vm.freq_pitch = ko.observable(0);
				vm.freq_note = ko.observable(0);
				vm.freq_cents = ko.observable(0);
				vm.freq_confidence = ko.observable();
				
				
				if(!vm.q){
					vm.q = ko.observable('');
				}
				
				if(data){				
/*					if(data.res.sfm){
						this.dicts = {};
						for(var i in data.res.dicts){
							if(data.res.dicts.hasOwnProperty(i)){
								this.dicts[data.res.dicts[i].uuid] = data.res.dicts[i];
							}
						}
						vm.dicts = ko.observableArray(data.res.dicts);
					}*/
				
				}else{
//					vm.dicts = vm.volumes = vm.sources = vm.terms = ko.observableArray([]);
				}
				

				$(document).ready(function(){
				
					$('body').removeClass('_-ui--not--loaded').addClass('_-ui--state--loaded');
				
					ko.applyBindings(_t.ViewModel);	
				});
				
//				this.cache_set(data);
			}
		}

	});
			
	_.e.sfm = {

		};
		
	_.api.sfm = _.api.sfm || new _._.api.SFM();
	
	// } tuner web api :EN~

})(_, jQuery, ko);				
				// } 99._.api.sfm.js # (24 / 25)