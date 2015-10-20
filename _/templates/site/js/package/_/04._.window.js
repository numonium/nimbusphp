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