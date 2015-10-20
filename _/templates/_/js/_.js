/* nimbus/lib/js - framework js libs
	(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
if(_){
	var __ = _;
}
	
var _ = {
	_ : __ || {},

	mod : {}, //modules
	
	// function definitions
	
	add : {
		className : function(ele, name){
			var classname = ele.className || '';
			classname = classname.split(' ');
			
			for(var i=0; i<classname.length; i++){
				if(classname[i]==name){
					return true;
				}
			}
			
			classname.push(name)
			
			ele.className = classname.join(' ');
		},
		css : function(args){
		
			var ret = document.createElement(args.content ? 'style' : 'link');
			
			if(args.content){
				ret.setAttribute('type', 'text/css');
				
				if(jQuery){ //~EN: IE throws some stupid error about setting innerhtml, but jquery helps fix that somehow
					(function($){
			_.log('554',ret);
						$(ret).html(args.content);					
					})(jQuery);
					
				}else{
					ret.innerHTML = args.content;	
				}
			}else{
				ret.setAttribute('rel', 'stylesheet');
				ret.setAttribute('type', 'text/css');
			}
			
			if(args.href){
				ret.setAttribute('href', args.href);
				
				//try to preload css files by stuffing them into images
				var img = document.createElement('img');
				img.setAttribute('src', args.href);
			}
			
			if(args.id){
				ret.setAttribute('id', args.id);
			}
			
			if(args.className){
				ret.setAttribute('class', args.className);
			}
			
			if(args.from){
				ret.setAttribute('from', args.from);
			}			
			
			return ret;
		}
		
	},
	
	// array functions
	array : {
		diff : function(arr1){
		    var retArr = {},
		        argl = arguments.length,
		        k1 = '',
		        i = 1,
		        k = '',
		        arr = {};
		
		    arr1keys: for (k1 in arr1) {
		        for (i = 1; i < argl; i++) {
		            arr = arguments[i];
		            for (k in arr) {
		                if (arr[k] === arr1[k1]) {
		                    // If it reaches here, it was found in at least one array, so try next value
		                    continue arr1keys;
		                }
		            }
		            retArr[k1] = arr1[k1];
		        }
		    }
		
		    return retArr;		
		},
		isin : function(needle, haystack){
		    for(var i = 0; i < haystack.length; i++) {
		        if(haystack[i] == needle)
		        	return true;
		    }
		    
		    return false;
		},
		last : function(ary){
			if(!ary || ary.length <= 0){
				return false;
			}
			
			return ary[ary.length-1];
		},
		merge : function(){
		    var args = Array.prototype.slice.call(arguments),
		        argl = args.length,
		        arg,
		        retObj = {},
		        k = '', 
		        argil = 0,
		        j = 0,
		        i = 0,
		        ct = 0,
		        toStr = Object.prototype.toString,
		        retArr = true;
		
		    for (i = 0; i < argl; i++) {
		        if (toStr.call(args[i]) !== '[object Array]') {
		            retArr = false;
		            break;
		        }
		    }
		
		    if (retArr) {
		        retArr = [];
		        for (i = 0; i < argl; i++) {
		            retArr = retArr.concat(args[i]);
		        }
		        return retArr;
		    }
		
		    for (i = 0, ct = 0; i < argl; i++) {
		        arg = args[i];
		        if (toStr.call(arg) === '[object Array]') {
		            for (j = 0, argil = arg.length; j < argil; j++) {
		                retObj[ct++] = arg[j];
		            }
		        }
		        else {
		            for (k in arg) {
		                if (arg.hasOwnProperty(k)) {
		                    if (parseInt(k, 10) + '' === k) {
		                        retObj[ct++] = arg[k];
		                    }
		                    else {
		                        retObj[k] = arg[k];
		                    }
		                }
		            }
		        }
		    }
		    return retObj;
		},
		merge_recursive : function(arr1, arr2) {
		    var idx = '';
		
		    if (arr1 && Object.prototype.toString.call(arr1) === '[object Array]' && 
		        arr2 && Object.prototype.toString.call(arr2) === '[object Array]') {
		        for (idx in arr2) {
		            arr1.push(arr2[idx]);
		        }
		    } else if ((arr1 && (arr1 instanceof Object)) && (arr2 && (arr2 instanceof Object))) {
		        for (idx in arr2) {
		            if (idx in arr1) {
		                if (typeof arr1[idx] == 'object' && typeof arr2 == 'object') {
		                    arr1[idx] = _.array.merge(arr1[idx], arr2[idx]);
		                } else {
		                    arr1[idx] = arr2[idx];
		                }
		            } else {
		                arr1[idx] = arr2[idx];
		            }
		        }
		    }
		
		    return arr1;
		},
		nav : function(root,coords){ //navigate multidimensional array
			if(!root){
				return false;
			}
			
			if(root && !coords){
				return root;
			}
			
			var ret = root;
			for(var i in coords){
				if(coords.hasOwnProperty(i)){
					if(ret[coords[i]]){
						ret = ret[coords[i]];
					}else{
						ret = false;
						break;
					}
				}
			}
			
			return ret;
			
		},
		save : function(dest,data){ //deep save to part of multidimensional object
			
		},
		values : function(input){
		    var tmp_arr = [],
		        key = '';
		
		    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
		        return input.values();
		    }
		
		    for (key in input) {
		        tmp_arr[tmp_arr.length] = input[key];
		    }
		
		    return tmp_arr;			
		}
	},
	
	canvas : {}, //main canvas dom element
	
	cfg : {
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
		
	},
	
	// events
	e : {},
	
	// lists of editors
	editors : {
		
	},
	
	// functions for frames and iframe
	frame : {
		doc : function(frame){
			return frame.contentDocument || (frame.contentWindow && frame.contentWindow.document ? frame.contentWindow.document : false) || frame.document;		
		}
	},
	
	get : {
		key : function(code){ //get key name for given int code
		
			for(var i in _.key.keys){
				if(_.key.keys.hasOwnProperty(i)){
					
					if(_.key.keys[i] == code){
						
						return i;
					}
					
				}
			}
			
			return String.fromCharCode(code);
		
		},
		keys_pressed : function(){
			
			var ret = [];
			
			for(var i in _.keys_pressed){
				if(_.keys_pressed[i] === true){
					ret.push(i);
				}
			}
						
			return ret;
			
		},
		styles : function(){
			
		}
		
	},
	
	img : {
		data_url : function(url, success, error){			
			var data, canvas, ctx;
			var img = new Image();
			img.onload = function(){
				// Create the canvas element.
			    canvas = document.createElement('canvas');
			    canvas.width = img.width;
			    canvas.height = img.height;
				// Get '2d' context and draw the image.
				ctx = canvas.getContext("2d");
			    ctx.drawImage(img, 0, 0);
				// Get canvas data URL
				try{
					data = canvas.toDataURL();
					success({image:img, data:data});
				}catch(e){
					error(e);
				}
			}
			// Load image URL.
			try{
				img.src = url;
			}catch(e){
				error(e);
			}
		},
		data_url_size : function(url,binary){ //returns size in bytes of data url
			var d = url.substr(url.indexOf('base64,') + 7),
				decoded = atob(d);
				
				return (binary ? decoded.length : d.length);
		},
		resize : function(args){
		
			var data = args.data || false,
				file = args.file || false,
				dest = args.dest || false,
				img = args.img || false,
				field = args.field || false,
				maxWidth = args[maxWidth] || _.cfg.img.upload.width,
				maxHeight = args[maxHeight] || _.cfg.img.upload.height;
			
			var date = new Date(),
				time = { start : date.getTime(), end : 0 };
			
		    var fileType = file.type, ret = false;
		 
		    var image = new Image();
		    image.src = data;
		    		 
		    image.onload = function() {
		      var size = _.img.size(image.width, image.height, maxWidth, maxHeight),
		          imageWidth = size.width,
		          imageHeight = size.height,
		 
		          // On créé un élément canvas 
		          canvas = document.createElement('canvas');
		          
		      canvas.width = imageWidth;
		      canvas.height = imageHeight;
		 
		      var ctx = canvas.getContext("2d");
		 
		      // drawImage va permettre le redimensionnement de l'image
		      // this représente ici notre image
		      ctx.drawImage(this, 0, 0, imageWidth, imageHeight);
		 
		      // Permet d'exporter le contenu de l'élément canvas (notre image redimensionnée) au format base64
		      data = canvas.toDataURL(fileType);
		      
		      // On supprime tous les éléments utilisés pour le redimensionnement
		      delete image;
		      delete canvas;
		      
		      ret = data;
		      
		      if(img){
			      img._.src = data;
			      
			      thumb = _.img.size(imageWidth, imageHeight, _.cfg.img.preview.width, _.cfg.img.preview.height);
			      
			      img._.width = thumb.width;
			      img._.height = thumb.height;
			      img.resized = false;
			      
			      if(jQuery){

				      (function($){
				      	
					      if(size.width != image.width && size.height != image.height){
					      
							//if image has been resized, move data to hidden input field and clear out file upload -> will incur 37% tax by being base64-enc
							_.log('879aa',$(img.file).parent());
							$(img.file).parent().append($('<input type="hidden" name="_img[data][]" value="' + data + '" />')[0]);
							img.file.setAttribute('type', 'hidden');
							img.file.setAttribute('value', '');
							img.file.setAttribute('type', 'file');
					      	img.resized = true;
					      	
						  }
					      
					      var orig_fsize = _.num.best_byte(file.size);
//					      var rsize = _.num.best_byte(((imageWidth * imageHeight) / (image.width * image.height)) * file.size * 1.37),
						  var rsize = (img.resized ? _.num.best_byte(_.img.data_url_size(data)) : orig_fsize),
					      	  psize = _.num.best_byte(((img._.width * img._.height) / (image.width * image.height)) * file.size * 1.37),
					      	  rsize_binary = _.num.best_byte(_.img.data_url_size(data,true));
					     
					     date = new Date();
					     time.end = date.getTime(); 
					     
					     var stats = 
					      	'<ul class="_-debug img--upload--stats">' +
					      		'<li><strong>Image:</strong> ' + image.width + ' x ' + image.height + ' (' + orig_fsize.num.toFixed(2) + ' ' + orig_fsize.unit + ')</li>' +
					      			'<li><strong>' + ( !img.resized ? 'Not ' : '' ) + 'Resized:</strong> ' + imageWidth.toFixed(2) + ' x ' + imageHeight.toFixed(2) + ' (' + rsize.num.toFixed(2) + ' ' + rsize.unit + ')</li>' +
					      			( img.resized ? 
					      				'<li><strong>Binary:</strong> ' + imageWidth.toFixed(2) + ' x ' + imageHeight.toFixed(2) + ' (' + rsize_binary.num.toFixed(2) + ' ' + rsize_binary.unit + ')</li>' :
					      			  '' ) +
					      		'<li><strong>Preview:</strong> ' + img._.width + ' x ' + img._.height + ' (' + psize.num.toFixed(2) + ' ' + psize.unit + ')</li>' +
					      		'<li><strong>Time:</strong> ' + (time.end - time.start) + ' ms</li>' +
					      	'</ul>';
					      	
					      if($(img.top).find('.img--upload--stats').length > 0){
						     $(img.top).find('.img--upload--stats').replaceWith($(stats)[0]); 
					      }else{
						      $(img.info).append($(stats)[0]);
					      }
					     					      
				      })(jQuery);
			      }
			      
		      }else if(dest && dest.src){
			      dest.src = data;
			      dest.width = imageWidth;
			      dest.height = imageHeight;
		      }else{
			      dest = data;
		      }
		      
		     // submitFile(data);
		    }
		    
		    return ret;
			
		},
		size : function(width, height, maxWidth, maxHeight){
			var newWidth = width, 
				 newHeight = height;
			
			if(width > height){
				if(width > maxWidth){
					 newHeight *= maxWidth / width;
					 newWidth = maxWidth;
				}
			}else{
				if(height > maxHeight){
					newWidth *= maxHeight / height;
					newHeight = maxHeight;
				}
			}
			
			return { width: newWidth, height: newHeight };
		}
	},
	
	// type functions
	is : {
		'array' : function(ary){
			return (typeof(ary)==='object' && ary!== null && ary instanceof Array);
		},
		'int' : function(num){
			return (typeof(num)=='number' && parseInt(num)==num);
		},
		'object' : function(o){
			return (typeof(o)==='object' && o!== null);
		},
		'string' : function(str){
			return (typeof(str)==='string' && str!== null && str!=='');
		},
		'window' : function(obj){
			if(obj === window)
				return true;
				
			for(var i=0; i<window.frames.length; i++){
				if(obj === window.frames[0]){
					return true;
				}
			}
			
			return false;
		}
	},
	
	// library
	lib : {
		shapes : {}
	},
	
	//logging
	log : function(){
		if(window.console){
			window.console.log( Array.prototype.slice.call(arguments) );
			return true;
		}
		
		return false;
		
		/* if(!window.console)
				return false;
			console.log.apply(null,arguments); */
	},
		
	num : {
		/* determines the best unit to use for a given filesize */
		best_byte : function(num,unit){
			if(_.is.object(num)){
				unit = num.unit;
				num = num.num;
			}
			
			unit = unit || 'B';
			
			var ret = { num : num, unit: unit };
			
			var ary = false;
			if(unit == unit.toUpperCase()){ //bytes
				ary = _.num.units.bytes;
			}else{
				ary = _.num.units.bits;
			}
			
			
			if(!ary) // no unit base -> return
				return ret;
			
			var start = 0;
			for(var i=0; i<ary; i++){
				if(ary[i] == unit){
					start = i;
					break;
				}
			}
			
			if(parseInt(num) >= 1){ //reduce size -> increment unit
				
				while(parseInt(num) >= 1 && start < ary.length){
					ret.num = num;
					num /= 1024.0;
					start++;
				}
				
			}else{ //increase size -> decrement unit

				while(parseInt(num) < 1 && start >= 0){
					ret.num = num;
					num *= 1024.0;
					start--;
				}
				
			}
			
			ret.unit = ary[start-1];
			
			return ret;
			
		},
		units : {
			bits :	['b','kb','mb','gb','tb','pb','eb','zb','yb'],
			bytes : ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
		}
	},
	
	obj : {
		clone : function(obj){
		    if (null == obj || "object" != typeof obj) return obj;
//		    var copy = obj.constructor();
			var copy = {};
		    for (var attr in obj) {
		    	_.log('$$$',attr,obj.hasOwnProperty(attr));
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}	
	},
	
	// event functions
	on : {
		resume : function(){
			if(jQuery){
				(function($){
				
				})(jQuery);
			}
		}
	},
	
	page : {
		title : function(str){
			document.title = _.str.trim(str) || _.cfg.title;
			_.cfg.title = document.title;
		}	
	},
	
	redactor : {}, 
	
	router : function(){
		var hash = arguments.hash || window.location.hash;
	
		for(var i in _.routers){
			if(_.routers.hasOwnProperty(i)){
				_.routers[i]({hash : hash});
			}
		}	
	},
	
	routers : {
		
	},
	
	sel : { // css selectors
		ui : {
			forms : {
				ac : ':input[ac]',
				infinite : ':input[infinite]'
			}
		}
		
	},
	
	size : function(obj){
//		var len = this.length ? --this.length : -1;
		
		if(obj.length && _.is.int(obj.length)){
			return obj.length;
		}

		var len = 0;
		for (var i in obj){
		    if(obj.hasOwnProperty(i)){
		    	len++;
		    }
		}
		
		return len;
	},
	
	//strings
	str : {
		events : {
			all : ['blur','change','click','contextmenu','copy','cut','dblclick','error','focus','focusin',
					'focusout','hashchange','keydown','keypress','keyup','keydown','mousedown','mouseenter',
					'mouseleave','mousemove','mouseout','mouseover','mouseup','mousewheel','paste','reset',
					'resize','scroll','select','submit','textinput','unload','wheel'],
			user : ['click','contextmenu','dblclick','keydown','keypress','keyup','keydown','mousedown',
					'mousemove','mouseout','mouseup','mousewheel','scroll']
		},
		trim : function(str){
			str = str.replace(/^\s\s*/, ''),
				ws = /\s/,
				i = str.length;
			while (ws.test(str.charAt(--i)));
			return str.slice(0, i + 1);
		},
		uniqid : function(prefix, more_entropy){
		    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		    // +    revised by: Kankrelune (http://www.webfaktory.info/)
		    // %        note 1: Uses an internal counter (in php_js global) to avoid collision
		    // *     example 1: uniqid();
		    // *     returns 1: 'a30285b160c14'
		    // *     example 2: uniqid('foo');
		    // *     returns 2: 'fooa30285b1cd361'
		    // *     example 3: uniqid('bar', true);
		    // *     returns 3: 'bara20285b23dfd1.31879087'
		    if (typeof prefix == 'undefined') {
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
	},
	
	tmp : {} //tmp storage
};
	
//ui kit
_.ac = {
	features : {
		cars : [], /*
		property : [
			{
				label : 'Florida Room',
				value : 'florida-room'
			},{
				label : 'Patio',
				value : 'patio'
			},{
				label : 'In-Ground Pool',
				value : 'pool--in-ground'
			},{
				label : 'Above-Ground Pool',
				value : 'pool--above-ground'
			},{
				label : 'Garage',
				value : 'garage'
			},{
				label : 'Carport',
				value : 'carport'
			}
		]*/
	},
	src : {
		base : '/ac'
	}
}; // auto-complete lists

_.ui = {
	editors : {
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
						
						_.admin.editing = false;
						_.admin.setState(false);
						
						
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

_.url = {
	get : {
		embed : false	
	},
	q : {},
	digest : function(){
		// This function is anonymous, is executed immediately and 
		// the return value is assigned to QueryString!
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");

		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
				// If first entry with this name
				
			if(typeof pair[1] === 'undefined'){
				pair[1] = true;
			}
			
			_.url.get[pair[0]] = pair[1];
				
			if (typeof query_string[pair[0]] === "undefined") {
			  query_string[pair[0]] = pair[1];
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
			  var arr = [ query_string[pair[0]], pair[1] ];
			  query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				if(typeof query_string[pair[0]] === 'undefined' ){
					query_string[pair[0]] = [];
				}else if(!_.is.array(query_string[pair[0]])){
					query_string[pair[0]] = [ query_string[pair[0]] ];
				} 
				
				query_string[pair[0]].push(pair[1]);
			}
		}
		
		_.url.q = query_string;
		
		return query_string;
	}	
};

_.lib.shapes = {
	_ : {
		blur : function(e){
			_.proximity.selected=false;
			_.ui.stats.clear();	
		},
		contextMenu  : function(ele,e){
			var items = {};
			
			var classes = {
				draggable : 'ui-draggable'
			};
			
			if(jQuery){
				(function($){
					if($(ele).hasClass(classes.draggable)){
						items.lock = {
							name : "Lock",
							icon : 'lock',
							callback : function(key,options){
								ele.removeAttr('draggable');
								ele.removeClass(classes.draggable);
								ele.draggable('option','disabled',true);
								ele.resizable('option','disabled',true);
							}
						}
					}else{
						items.unlock = {
							name : "Unlock",
							icon : "unlock",
							callback : function(key,options){
								ele.attr('draggable','true');
								$(ele).addClass(classes.draggable);
								ele.draggable('option','disabled',false);
								ele.resizable('option','disabled',false);
							}
						}
					}
					
					if($(ele).attr('repel')){
						items.attract = {
							name : "Attract",
							icon : 'attract',
							callback : function(key,options){
								$(ele).removeAttr('repel');
							}
						}
					}else{
						items.repel = {
							name : "Repel",
							icon : 'repel',
							callback : function(key,options){
								$(ele).attr('repel',5); //5 for 5px
							}
						}
					}
					
					items.clone = {
						name : "Clone",
						icon : 'copy',
						callback : function(key,options){
							var clone=$(this).clone();
							var pos = {
								top : $(this).position().top + (_.proximity.defaults.draggable.grid[1]*2),
								left : $(this).position().left + (_.proximity.defaults.draggable.grid[0]*2),
								bottom : 'auto',
								right : 'auto'
							};
							
							for(var i in pos){
								clone.css(i,pos[i]+'px');
							}
							
							clone.css('opacity',0);
							
							var id_step=1;
							while(document.getElementById(clone.attr('id')+'-'+id_step)){
								id_step++;
							}
							
							clone.attr('id',clone.attr('id')+'-'+id_step);
							clone.attr('tabindex',parseInt(clone.attr('tabindex')+100));
							
							_.lib.shapes._.life(clone);
							
							clone.appendTo($(this).parent());
							clone.animate({
								opacity : 1,
							},_.proximity.defaults.draggable.fadeTime);
						}
					}
					
					items.deleteItem = {
						name : "Delete",
						icon : "delete",
						callback : function(key,options){
//							$(this).css('opacity',1);
							$(this).fadeOut(_.proximity.defaults.draggable.fadeTime,function(){ $(this).remove(); });
						}
					}
				})(jQuery);
			}
			
			return {
				items : items || {
			        "edit": {name: "Edit", icon: "edit"},
			        "cut": {name: "Cut", icon: "cut"},
			        "copy": {name: "Copy", icon: "copy"},
			        "paste": {name: "Paste", icon: "paste"},
			        "delete": {name: "Delete", icon: "delete"},
			        "sep1": "---------",
			        "quit": {name: "Quit", icon: "quit"}
				}
			};
		},
		life : function(ele){
			_.ui.draggable(ele);
			_.ui.resizable(ele);
		},
		select : function(e){
			var ele=e.currentTarget;
			var stats=_.proximity.stats;
			
			_.proximity.selected=ele;
			
			if(jQuery){
				(function($){
					var pos=$(ele).position();
					pos.z=$(ele).css('z-index');
					
					$(ele).focus();
					$(stats._).find('.id .text').html('#'+ele.id);
					$(stats._).find('.label .text').html($(ele).find('label').html());
					$(stats._).find('.layer-position .text').html((pos.top ? 'top: '+parseInt(pos.top) : '')+" / left: "+parseInt(pos.left)+' / z: '+pos.z);

					if(_.proximity.stats){
						_.proximity.stats.colorpickers.fg.choose(_.ui.color.convert.rgb_hex($(ele).css('color')));
						_.proximity.stats.colorpickers.bg.choose(_.ui.color.convert.rgb_hex($(ele).css('background-color')));
					}
					
					$(stats._).find('.color .text').html(_.ui.color.convert.rgb_hex($(ele).css('color')));
					$(stats._).find('.bg-color .text').html(_.ui.color.convert.rgb_hex(ele.style.backgroundColor));
				})(jQuery);
			}
			
		}
	},
	rect : {
		_default : {
			top : false,
			right : false,
			bottom : false,
			left : false
		},
		_current : {
			id : 0
		},
		create : function(parent,attrs){
			if(!parent || is_object(parent)){
				parent = _.proximity.canvas;
			}
			
			_.lib.shapes.rect._current.id++;
			
			var ele = document.createElement('div');
			ele.className = 'shape shape--rect';
			ele.setAttribute('tabindex',_.lib.shapes.rect._current.id);
			ele.setAttribute('draggable','true');
			
			ele.setAttribute('id',ele.className.replace(' ','--')+'--'+_.lib.shapes.rect._current.id);
			
			var ele_pos=_.proximity.randomPosition(parent);
			for(var i in ele_pos){
				ele.style[i] = ele_pos[i]+"px";
			}
			
			ele.setAttribute('color-wheel',_.proximity.current.color);
			ele.style.backgroundColor = '#'+_.proximity.nextColor();
			
			if(_.ui.color.isLight(ele.style.backgroundColor)){
				ele.className+=' light';
			}
			_.lib.shapes._.life(ele);
						
			var label = document.createElement('label');
			label.innerHTML='rect '+_.lib.shapes.rect._current.id;
			
			ele.appendChild(label);
			
			if(jQuery){
				(function($){
					$(ele).mousedown(_.lib.shapes.rect.mousedown);
					$(ele).mouseup(_.lib.shapes.rect.mouseup);
					$(ele).click(_.lib.shapes._.select);
					$(ele).focusout(_.lib.shapes._.blur);
					$(ele).blur(_.lib.shapes._.blur);
					$(ele).css('opacity',0);
				})(jQuery);
			}
			
			if(parent){
				parent.appendChild(ele);
				if(jQuery){
					(function($){
//						$(ele).fadeIn(_.proximity.defaults.draggable.fadeTime,function(){ });
						$(ele).animate({
							opacity : 1
						},_.proximity.defaults.draggable.fadeTime);
					})(jQuery);
				}
			}else
				return ele;
		},
		mousedown : function(e){
			$(e.currentTarget).addClass('focus');
		},
		mouseup : function(e){
			$(e.currentTarget).removeClass('focus');
		}
	},
	rounded : {
		_default : {
			top : false,
			right : false,
			bottom : false,
			left : false
		},
		_current : {
			id : 0
		},
		create : function(parent,attrs){
			if(!parent || is_object(parent)){
				parent = _.proximity.canvas;
			}
			
			_.lib.shapes.rounded._current.id++;
			
			var ele = document.createElement('div');
			ele.className = 'shape shape--rounded';
			ele.setAttribute('tabindex',_.lib.shapes.rounded._current.id);
			ele.setAttribute('draggable','true');
			
			ele.setAttribute('id',ele.className.replace(' ','--')+'--'+_.lib.shapes.rounded._current.id);
			
			var ele_pos=_.proximity.randomPosition(parent);
			for(var i in ele_pos){
				ele.style[i] = ele_pos[i]+"px";
			}
			
			ele.setAttribute('color-wheel',_.proximity.current.color);
			ele.style.backgroundColor = '#'+_.proximity.nextColor();
			
			if(_.ui.color.isLight(ele.style.backgroundColor)){
				ele.className+=' light';
			}
			
			if(attrs.radius && attrs.radius>0){
				ele.style.borderRadius = attrs.radius+'px';
			}
			
			
			_.lib.shapes._.life(ele);
						
			var label = document.createElement('label');
			label.innerHTML='rounded '+_.lib.shapes.rounded._current.id;
			
			ele.appendChild(label);
			
			if(jQuery){
				(function($){
					$(ele).mousedown(_.lib.shapes.rounded.mousedown);
					$(ele).mouseup(_.lib.shapes.rounded.mouseup);
					$(ele).click(_.lib.shapes._.select);
					$(ele).focusout(_.lib.shapes._.blur);					
					$(ele).css('opacity',0);
				})(jQuery);
			}
			
			if(parent){
				parent.appendChild(ele);
				if(jQuery){
					(function($){
//						$(ele).fadeIn(_.proximity.defaults.draggable.fadeTime,function(){ });
						$(ele).animate({
							opacity : 1
						},_.proximity.defaults.draggable.fadeTime);
					})(jQuery);
				}
			}else
				return ele;
		},
		mousedown : function(e){
			$(e.currentTarget).addClass('focus');
		},
		mouseup : function(e){
			$(e.currentTarget).removeClass('focus');
		}
	}
};

_.mouse = {
	e : {
		click : false,
		context : false,
		drag : false,
		move : false,
		scroll : false,
		select : false
	},
	btn : {
		left : false,
		middle : false,
		right : false,
		scroll : false,
		current : false,
		last : false
	},
	get_button : function(e){
		var w = e.which || e.button || 1;
		
	},
	monitor : function(ele){
		if(!jQuery){
			_.log(':( we unfortunately require jquery');
			return false;
		}
		
//		ele = ele || '*';
		
		_.log('* monitor mouse @ '+ele);
		
		(function($){
			if(ele){
				ele = $(ele).find('*');
			}else{
				ele = '*';
			}
		
			$(ele).mousedown(function(e){
				var btn = e.which || e.button || 1;
			
				switch(btn){
					case 2:
						_.mouse.btn.middle = _.mouse.e.click = true;
						_.mouse.btn.current = 'middle';
						break;
					case 3:
						_.mouse.btn.right = _.mouse.e.context = true;
						_.mouse.btn.current = 'right';
						break;
					default: // also tackles case 1:
						_.mouse.btn.left = _.mouse.e.click = true;
						_.mouse.btn.current = 'left';
						break;
				}
				_.log('* mouse down ['+_.mouse.btn.current+']',e.currentTarget,_.mouse.btn);
			}).mouseup(function(e){
				var btn = e.which || e.button || 1;
			
				switch(btn){
					case 2:
						_.mouse.btn.middle = _.mouse.e.click = false;
						break;
					case 3:
						_.mouse.btn.right = _.mouse.e.context = false;
						break;
					default: // also tackles case 1:
					
						if(_.mouse.btn.left===true && _.mouse.e.drag===true){ //i really hate === but just to be sure
							_.selection._ = _.selection.get(e);
							_.log('* mouse[select]',_.selection._);
							_.mouse.e.select = true;
							_.mouse.router({
								cmd : 'context',
								e : e,
								btn : btn
							});
						}
					
						_.mouse.btn.left = _.mouse.e.click = false;
						_.mouse.e.move = _.mouse.e.drag = _.mouse.e.select = false;
						break;
				}
				
				_.mouse.btn.last = _.mouse.btn.current;
				_.mouse.btn.current = false;

				_.log('* mouse up ['+_.mouse.btn.last+' / '+_.mouse.btn.current+']',e.currentTarget,_.mouse.btn);
			}).mousemove(function(e){
				_.mouse.e.move = true;
				if(_.mouse.btn.left === true){
					_.mouse.e.drag = true;
					_.log('* mouse drag',_.mouse.btn,e);
				}else{
					_.log('* mouse move',e);
				}
			});
		})(jQuery);
			
		return true;
	},
	router : function(cmd,e,btn){
		if(_.is.object(cmd) && cmd.hash!='undefined'){
			return false;
		}
		
		_.log('@ router[mouse]',_.size(_.editors),cmd,e,btn);
		
		switch(cmd){
			case 'context':
				if(_.size(_.editors) > 0){
					_.ui.editors.wysiwyg.toggle.menu.context(e);
					_.mouse.e.select=false;
				}
				break;
		}
		
		return true;
		
	},
	routers : {
//		context : function
	}
};

_.routers['mouse'] = _.mouse.router;

_.selection = {
	_ : {},
	bounds : function(range){
		range = range || _.range || _.selection.range();
		var rects = range.getClientRects(), top = right = bottom = left = width = height = -1;
		
		if(rects.length == 0){
			return false;
		}
		
		//let's assume rects are ordered vertically, so rects[0] = top and rects[last] = bottom
		top = rects[0].top;
		bottom = rects[rects.length-1].bottom;
		
		for(var i=0; i<rects.length; i++){
			if(left == -1 || (left > -1 && rects[i].left < left)){
				left = rects[i].left;
			}
			if(right == -1 || (right > -1 && rects[i].right > right)){
				right = rects[i].right;
			}
		}
				
		width = right - left;
		height = bottom - top;
		
		return {
			top : top,
			right : right,
			bottom : bottom,
			left : left,
			width : width,
			height : height,
			midpoint : {
				x : (right + left) / 2,
				y : (bottom + top) / 2,
				top : (bottom + top) / 2,
				left : (right + left) / 2
			},
			rects : rects
		};

	},
	clear : function(sel){
		sel = sel || _.selection._.sel || _.selection.get();
		_.selection.deselect(_.selection.range(sel));
	
		if(jQuery){
			
			(function($){
				
				page = $($('iframe')[0].contentDocument).find('#page')[0];
				$('._-selection--outline').remove();
				$(page).find('._-selection--outline').remove();
				
			})(jQuery);
			
		}	
	},
	deselect : function(range){
		range = range || _.range || _.selection.range();

		if(range){
			_.selection._.sel.removeRange(range);
//			range.collapse(true);
		}else{
			_.selection._.sel.removeAllRanges();
		}
		
		if(!_.selection._.isCollapsed){		
			_.selection._.range = range;
			_.selection._.isCollapsed = true;
		}
		
		_.log('* selection[deselect]',_.selection._);
	},
	get : function(e){
		if(!e){
			e = window;
		}
	
		var ele = e.currentTarget || e,
		body = id = ret = sel = text = w = false;
		
		if(!jQuery){
			return window.getSelection() || document.selection.createRange();
		}
		
		(function($){
			if(_.is.window(ele)){
				body = ele.document.body;
				w = ele;
			}else if(ele && ele.document && (ele.document.body == ele)){
				body = ele;
			}else if(ele && ele.ownerDocument && (ele.ownerDocument.body == ele)){
				body = ele;
			}else if(ele){
				body = $(ele).parents('body')[0];
			}else{
				body = document.body;
				w = window;
			}
			
			id = (body.getAttribute('id') ? parseInt(_.array.last(body.getAttribute('id')).split('--')) : 0);
			
			var frame_doc = false;
			
			if(!w && window.frames.length == 0){
				w = window;
			}else if(!w){ //account for multiple editors -> multiple iframes; each should have its own id
				for(var i=0; i<window.frames.length; i++){
					frame_doc = window.frames[i].document || window.frames[i].documentElement || window.frames[i].contentDocument;
					
					if(id == parseInt(_.array.last($(frame_doc).find('body').attr('id').split('--')))){
						w = window.frames[i];
					}
					
					frame_doc = false;
				}
			}
			
			sel = (w.getSelection ? w.getSelection() : w.selection.createRange());
			
			if(!sel || sel.isCollapsed){
				ret = false;
			}else{			
				ret = {
					sel : sel,
					anchorNode : sel.anchorNode,
					anchorOffset : sel.anchorOffset,
					focusNode : sel.focusNode,
					focusOffset : sel.focusNode,
					isCollapsed : sel.isCollapsed,
					range : (sel.getRangeAt ? sel.getRangeAt(0) : sel.anchorNode.ownerDocument.createRange()),
					rangeCount : sel.rangeCount,
					text : sel.toString(),
					window : w
				};
			}
			
		})(jQuery);
		
		return ret;
	},
	midpoint : function(range){
		range = range || _.range || _.selection.range();
		var rects = range.getClientRects(), top = right = bottom = left = width = height = -1;
		
		return _.selection.bounds(range).midpoint;
		
	},
	outline : function(range){
		if(bounds = _.selection.bounds(range)){
			var page = false;
			
			_.log('= bounds',bounds);
			
			if(jQuery){
			
				(function($){
				
					page = $($('iframe')[0].contentDocument).find('#page')[0];
					$(page).append(
						'<div class="_-locked _-selection--outline" contenteditable="false">' +
							'<span class="_-selection--midpoint _-selection--top" style="top:'+bounds.top+'px; left:'+(bounds.midpoint.x)+'px"></span>' +
							'<span class="_-selection--midpoint _-selection--right" style="top:'+bounds.midpoint.y+'px; left:'+(bounds.right)+'px"></span>' +
							'<span class="_-selection--midpoint _-selection--bottom" style="top:'+bounds.bottom+'px; left:'+(bounds.midpoint.x)+'px"></span>' +
							'<span class="_-selection--midpoint _-selection--left" style="top:'+bounds.midpoint.y+'px; left:'+bounds.left+'px"></span>' +
							'<span class="_-selection--midpoint" style="top:'+bounds.midpoint.y+'px; left:'+bounds.midpoint.x+'px; background:red;"></span>' +
							'<span class="_-selection--midpoint _-selection--ideal" style="top:'+bounds.rects[0].bottom+'px; left:'+((bounds.rects[0].left + bounds.rects[0].right)/2)+'px; background:green;"></span>' +
						'</div>'
					);
					
				})(jQuery);
				
			}
		}else{
			return false;
		}
			
	},
	range : function(sel){
		sel = sel || _.selection._.sel || _.selection.get();
		var range = false;
		
		if(sel.getRangeAt){
			if(sel.rangeCount > 0){
				range = sel.getRangeAt(0);
			}else{
				return false;
			}	
		}else{
			range = d.createRange()
			range.setStart(sel.anchorNode,sel.anchorOffset);
			range.setEnd(sel.focusNode,sel.focusOffset);
		}
		
		return range;
	},
	reselect : function(sel){
		var d = range = false;
		
		if(sel){
			d = sel.anchorNode.ownerDocument || document;		
		}else{
			//remember, documents are different in ifrmaes
			sel =  _.selection._.sel;
			d = _.selection._.anchorNode.ownerDocument;
		}
		
		_.log('* selection[reselect]',sel,d,_.selection.range(sel));
		
		if(range = _.selection.range(sel)){
			sel.addRange(range);
			
			return range;
		}else if(_.selection._.range){
			_.selection._.sel.addRange(_.selection._.range);
			_.selection._.isCollapsed = false;
			
			return _.selection._.range;
		}
		
		return false;
	}
};

_.ui.color = {
	convert : {
		hex_rgb : function(hex){
			if(!hex)
				return false;
				
			if(hex.charAt(0)=='#'){
				hex=hex.substring(1);
			}
			
			if(hex.length==3){ //used a short hex code
				var tmp=hex.charAt(0)+hex.charAt(0)+hex.charAt(1)+hex.charAt(1)+hex.charAt(2)+hex.charAt(2);
				hex=tmp;
			}
			
			return [parseInt((hex).substring(0,2),16) , parseInt((hex).substring(2,4),16), parseInt((hex).substring(4,6),16)];
		},
		hue_rgb : function(p, q, t){
			if(arguments.length==1){
				var args=arguments[0];
				p=args[0];
				q=args[1];
				t=args[2];
			}
		
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
		hsl_rgb : function(h, s, l){
			if(arguments.length==1){
				var args=arguments[0];
				h=args[0];
				s=args[1];
				l=args[2];				
			}
		
		    var r, g, b;
		
		    if(s == 0){
		        r = g = b = l;
		    }else{
		        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		        var p = 2 * l - q;
		        r = _.ui.color.convert.hue_rgb(p, q, h + 1/3);
		        g = _.ui.color.convert.hue_rgb(p, q, h);
		        b = _.ui.color.convert.hue_rgb(p, q, h - 1/3);
		    }
		
		    return [r * 255, g * 255, b * 255];
		},
		hsv_rgb : function(h, s, v){
			if(arguments.length==1){
				var args=arguments[0];
				h=args[0];
				s=args[1];
				v=args[2];
			}
			
		    var r, g, b;
		
		    var i = Math.floor(h * 6);
		    var f = h * 6 - i;
		    var p = v * (1 - s);
		    var q = v * (1 - f * s);
		    var t = v * (1 - (1 - f) * s);
		
		    switch(i % 6){
		        case 0: r = v, g = t, b = p; break;
		        case 1: r = q, g = v, b = p; break;
		        case 2: r = p, g = v, b = t; break;
		        case 3: r = p, g = q, b = v; break;
		        case 4: r = t, g = p, b = v; break;
		        case 5: r = v, g = p, b = q; break;
		    }
		
		    return [r * 255, g * 255, b * 255];
		},
		rgb_hex : function(r,g,b){
			if(is_array(arguments[0]) && arguments.length==1){
				var args=arguments[0];
				r=args[0];
				g=args[1];
				b=args[2];
			}else if(arguments.length==1){
				color=arguments[0];

			    if (color.substr(0, 1) === '#') {
			        return color;
			    }
			    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
			    
			    r = parseInt(digits[2]);
			    g = parseInt(digits[3]);
			    b = parseInt(digits[4]);
			    
			}
			
		    var rgb = b | (g << 8) | (r << 16);
		    
		    return (digits && digits[1] ? digits[1] : '') + '#' + rgb.toString(16);
		},
		rgb_hsl : function(r,g,b){
			if(arguments.length==1){
				var args=arguments[0];
				r=args[0];
				g=args[1];
				b=args[2];
			}
			
		    r /= 255, g /= 255, b /= 255;
		    var max = Math.max(r, g, b), min = Math.min(r, g, b);
		    var h, s, l = (max + min) / 2;
		
		    if(max == min){
		        h = s = 0;
		    }else{
		        var d = max - min;
		        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		        switch(max){
		            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		            case g: h = (b - r) / d + 2; break;
		            case b: h = (r - g) / d + 4; break;
		        }
		        h /= 6;
		    }
		    
		    return [h, s, l];
		},
		rgb_hsv : function(r, g, b){
			if(arguments.length==1){
				var args=arguments[0];
				r=args[0];
				g=args[1];
				b=args[2];
			}
			
		    r = r/255, g = g/255, b = b/255;
		    var max = Math.max(r, g, b), min = Math.min(r, g, b);
		    var h, s, v = max;
		
		    var d = max - min;
		    s = max == 0 ? 0 : d / max;
		
		    if(max == min){
		        h = 0; // achromatic
		    }else{
		        switch(max){
		            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		            case g: h = (b - r) / d + 2; break;
		            case b: h = (r - g) / d + 4; break;
		        }
		        h /= 6;
		    }
		
		    return [h, s, v];
		}
	},
	isLight : function(color){
		if(!color)
			return false;
			
		switch(color.charAt(0)){
			case 'r':
				if(color.indexOf('rgb')==0){
					color=_.ui.color.convert.rgb_hex(color);
				}
			case '#':
				var hsl=_.ui.color.convert.rgb_hsl(_.ui.color.convert.hex_rgb(color));
				return hsl[2]>=_.proximity.defaults.color.l.light;
				break;
		}
	},
	isDark : function(color){
		if(!color)
			return false;
			
		switch(color.charAt(0)){
			case 'r':
				if(color.indexOf('rgb')==0){
					color=_.ui.color.convert.rgb_hex(color);	
				}
			case '#':
				var hsl=_.ui.color.convert.rgb_hsl(_.ui.color.convert.hex_rgb(color));
				return hsl[2]<=_.proximity.defaults.color.l.dark;
				break;
		}
	},
	isNeutral : function(color){
		if(!color)
			return false;
			
		switch(color.charAt(0)){
			case 'r':
				if(color.indexOf('rgb')==0){
					color=_.ui.color.convert.rgb_hex(color);	
				}
			case '#':
				var hsl=_.ui.color.convert.rgb_hsl(_.ui.color.convert.hex_rgb(color));
				return (hsl[2]<_.proximity.defaults.color.l.light && hsl[2]>_.proximity.defaults.color.l.dark);
				break;
		}
	}
}

_.ui.colorpicker = {
	type : '_UIColorPicker',
	choose :  function(color){
		this.selection.style.backgroundColor=(color.charAt(0)!='#' ? '#' : '')+color;
	},
	
	
	themes : {},
	select_sidebar : function(ele,palette){
		this.themes[palette]=ele.getAttribute('form-value');
		document.getElementById('site--sidebar--position').value=this.themes[palette];
		
		if(jQuery){
			(function($){
				$(ele).parent().parent().find('.sidebar--select .button').removeClass('selected');
				$(ele).addClass('selected');
			})(jQuery);
		}
	},
	select_theme : function(ele,palette){
		this.themes[palette]=ele.getAttribute('form-value');
		document.getElementById('site--theme--color').value=this.themes[palette];
		
		if(jQuery){
			(function($){
				$(ele).parent().parent().find('.theme .button').removeClass('selected');
				$(ele).addClass('selected');
			})(jQuery);
		}
	},
	select_template : function(ele){
		document.getElementById('site--theme--color').value= this.themes[ele.value] || 'default';

		if(jQuery){
			(function($){
				$('.img--select .template').not('.template--'+ele.value).removeClass('selected');
				$('.img--select .template.template--'+ele.value).addClass('selected');
			})(jQuery);
		}
	},
	
	css : {
		classes : {
			_ : '_-ui--colorpicker',
			palette : '_-ui--colorpicker--palette',
			selection : '_-ui--colorpicker--selection',
			selectionPreview : '_-ui--colorpicker--selection--preview'
		}
	},
	destroy : function(){
		if(jQuery){
			var t=this;
			(function($){
				$(t.wrapper).children().remove('*');
			})(jQuery);
		}
	},
	hide : {
		palette : function(data,e){
			var t = data.t;
			var palette=$(e.currentTarget).parent().children('.'+t.css.classes.palette);
			palette.css('display','none');
		}
	},
	show : {
		palette : function(data,e){
			var t = data.t;
			var palette=$(e.currentTarget).parent().children('.'+t.css.classes.palette);
			palette.css('display','block');
		}
	},
	toggle : {
		palette : function(data,e){
			var t = data.t;
			var palette=$(e.currentTarget).parent().children('.'+t.css.classes.palette);
			palette.toggle(function(){
				_.log('toggle hide',t);
				t.palette.hide({t:t},e);
			},function(){
				t.palette.show({t:t},e);
			});
			palette.toggle();
/*			if(palette.style.display!='' && palette.style.display!='none'){
				palette.style.display='block';
			}else{
				palette.style.display='none';
			}*/
		}
	},
	swatches : _.colors || [],
	colorpicker : function(wrapper){
	
		var palette = document.createElement('ul');
		palette.className=this.css.classes.palette;
		
		for(var i in this.swatches){
			if(this.swatches.hasOwnProperty(i)){
				var li = document.createElement('li');
				li.style.backgroundColor = (this.swatches[i].charAt(0)!='#' ? '#' : '')+this.swatches[i];
				palette.appendChild(li);
			}
		}
		
		this.palette=palette;
		
		var selection = document.createElement('a');
		selection.className = this.css.classes.selection;
		selection.setAttribute('href','javascript:;');
		
		var preview = document.createElement('div');
		preview.className = this.css.classes.selectionPreview;
		selection.appendChild(preview);
		
		this.selection=selection;
		this.preview=preview;	
			
		if(jQuery){
			var t=this;
			(function($){
				if($(wrapper).find('.'+t.css.classes.palette).length==0)
					wrapper.appendChild(t.palette);
				if($(wrapper).find('.'+t.css.classes.selection).length==0)
					wrapper.appendChild(t.selection);
	
				$(wrapper).addClass(t.css.classes._);
				
				$(selection).click(function(e){
					t.toggle.palette({ t: t },e);
				});
			})(jQuery);
		}
		
		this.wrapper=wrapper;
	}
}

_.ui.draggable = function(ele){
	if(!ele)
		return false;
		
	if(jQuery){
		(function($){
			$(ele).draggable(_.proximity.defaults.draggable);
		})(jQuery);
	}
};

_.ui.edit = function(ele){
	if(!ele)
		return false;
}

_.ui.img = {
	create : function(url, mode){
		if(!url){
			return false;
		}
		
		if(!mode){
			mode = 'crop';
		}
		
		_.log('@@@',typeof url);
		
		try{
	      var reader = new FileReader();
	
	      reader.onload = (function(file) {
	        return function(e) {
	          img.src=reader.result;
	        };
	      })(ele.files[0]);
	
	      reader.readAsDataURL(ele.files[0]);
		}catch(err){
			img.src=ele.value;
		}
		
		var str=img.className;
		str=str.replace('-empty','');
		
		img.className=str;
		
	//	img_info.style.height=(parent_img_wrapper.clientHeight-parseInt(img_info.style.paddingTop)-parseInt(photo_info.style.paddingBottom))+"px";
		
		show(img_info);
		
		if(last==img_field)
			img_field.parentNode.appendChild(new_field);
		
		window.location.href='#'+(!new_link ? last_link.name : new_link.name);
	},
	dataURL : function(url, success, error){
		var data, canvas, ctx;
		var img = new Image();
		img.onload = function(){
			// Create the canvas element.
		    canvas = document.createElement('canvas');
		    canvas.width = img.width;
		    canvas.height = img.height;
			// Get '2d' context and draw the image.
			ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0);
			// Get canvas data URL
			try{
				data = canvas.toDataURL();
				success({image:img, data:data});
			}catch(e){
				error(e);
			}
		}
		// Load image URL.
		try{
			img.src = url;
		}catch(e){
			error(e);
		}
	}
}

// accent folding
_.accent = {
	'á'	: 'a',
	'à'	: 'a',
	'ä'	: 'a',
	'ã'	: 'a',
}

// key bindings
_.key = {
	_blocked : false,
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
		
_.e.keydown = function(e){
	_.keys_pressed[_.get.key(e.keyCode)] = true;
	
	_.log('+ key '+_.get.key(e.keyCode),_.get.keys_pressed());
};
	
_.e.keyup = function(e){
	_.keys_pressed[_.get.key(e.keyCode)] = false;
	
	_.log('- key '+_.get.key(e.keyCode),_.get.keys_pressed());
};
	
_.keys_pressed = {};

_.ui.repel = function(ele){
	if(!ele)
		return false;
};

_.ui.resizable = function(ele){
	if(!ele)
		return false;
	if(jQuery){
		(function($){
			$(ele).resizable(_.proximity.defaults.resizable);
		})(jQuery);
	}
};

_.ui.stats = {
	_ : _.proximity && _.proximity.stats || {},
	__ : false,
	clear : function(stats){
		if(!stats)
			stats=_.ui.stats;
			
		var parent=stats._._.parentNode;
		var ret=false;
			
		if(jQuery){
			(function($){
				$(stats._._).find('*').attr('id','');
				$(stats._._).fadeOut(_.proximity.defaults.draggable.fadeTime,function(){ $(this).remove(); });
				stats._._=$(stats.__).clone(true)[0];
				parent.appendChild(stats._._);
			})(jQuery);
		}

		_.proximity.stats.colorpickers.fg.destroy();
		_.log('destroy ',_.proximity.stats.colorpickers.fg)
		_.proximity.stats.colorpickers.fg=new _.ui.colorpicker(document.getElementById('stats--fg--colorpicker'));

		_.proximity.stats.colorpickers.bg.destroy();
		_.proximity.stats.colorpickers.bg=new _.ui.colorpicker(document.getElementById('stats--bg--colorpicker'));

	},
	init : function(stats){
		if(!stats)
			stats=_.ui.stats;
		
		if(jQuery){
			(function($){
				stats.__ = $(stats._._).clone(true)[0];
			})(jQuery);
		}
	}
};

/* jquery mods { */

(function($){

	$.fn.getStyle = function(){
	    var style, curr_style,
	    el = this[0];
	
		if (window.getComputedStyle) {
		    curr_style = window.getComputedStyle(el);
		} else if (el.currentStyle) {
		    curr_style = $.extend(true, {}, el.currentStyle);
		} else {
		    throw "too old :C";
		}
				
	    // Loop through styles and get each property. Add to object.
	    var styles = {};
	    for( var i=0; i<curr_style.length; i++){
	        styles[ curr_style[i] ] = curr_style[ curr_style[i] ];
	    }
	
	    return styles;
	};
	
})(jQuery);

// Extend jQuery.fn with our new method
jQuery.extend( jQuery.fn, {
    // Name of our method & one argument (the parent selector)
    hasParent: function(p) {
        // Returns a subset of items using jQuery.filter
        return this.filter(function(){
            // Return truthy/falsey based on presence in parent
            return $(p).find(this).length;
        });
    }
});

jQuery.fn.extend({ 
    disableSelection : function() { 
        this.each(function() { 
            this.onselectstart = function() { return false; }; 
            this.unselectable = "on"; 
            jQuery(this).css('user-select', 'none'); 
            jQuery(this).css('-o-user-select', 'none'); 
            jQuery(this).css('-moz-user-select', 'none'); 
            jQuery(this).css('-khtml-user-select', 'none'); 
            jQuery(this).css('-webkit-user-select', 'none'); 
        }); 
        
        return this;
    }
}); 

/* } jquery mods */

/* ~EN: init { */

(function($){
	$(document).ready(function(){
		$('._-no--js').removeClass('_-no--js');
		$('._-js--alt').remove(); // remove elements that are for non-js pages
		$('._-js--only').show(); // show elements that are for only js pages
	});	
})(jQuery);

/* } init :EN~ */