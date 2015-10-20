/* juniper/mod/stopwatch/js - stopwatch js helper functions
	(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */

_.mod.stopwatch = function(ele){
	this._class = ' _-mod--stopwatch';
	this._attr = 'data-_-mod-stopwatch';

	this.options = {
		sign : '+'
	};
	
	if(_.is.string(ele) && ele.charAt(0)=='#'){
		ele=document.getElementById(ele.substr(1));
	}
	
	if(_.is.object(ele)){
		for(var i in ele){
			if(ele.hasOwnProperty(i)){
				if(i=='ele'){
					if(_.is.string(ele[i]) && ele[i].charAt(0)=='#'){
						ele[i]=document.getElementById(ele[i].substr(1));
					}				
					this.ele=ele[i];
				}else{
					this.options[i]=ele[i];
				}
			}
		}
	}else{
		this.ele = ele;
	}
	
	this.blank = function(){
		this.time.h.innerHTML = this.time.m.innerHTML = this.time.s.innerHTML = '00';
		this.time.sign.innerHTML = this.options.sign;
		this.started=false;
	}
	
	this.context = function(_this){
		if(_this){
			for(var i in _this){
				if(_this.hasOwnProperty(i))
					this[i]=_this[i];
			}
		}
	}
	
	this.init = function(){
		if(!this.unpacked && jQuery){
			var _this=this;
			(function($){
				
				_this.time.h = $(_this.ele).find('.h')[0];
				_this.time.m = $(_this.ele).find('.m')[0];
				_this.time.s = $(_this.ele).find('.s')[0];
				_this.time.sep = $(_this.ele).find('.sep');
				_this.time.sign = $(_this.ele).find('.sign')[0];
				
			})(jQuery);

/*			for(var i in _this){
				if(_this.hasOwnProperty(i)){
					this[i]=_this[i];
				}
			}*/
			this.context(_this);
		}
		
		this.blank();
	}
	
	this.interval=0;
	
	this.pause = function(){
		if(!this.paused){
			clearInterval(this.interval);
			this.interval=false;
			this.paused=true;
		}else{
			this.start(true);
			this.paused=false;
		}
	}
	
	this.paused=false;
	
	this.set = function(time){
		var _this=this;
		
		if(time.h !==false){
			this.time.h.innerHTML= (time.h < 10 ? '0' : '') + time.h;
		}
		if(time.m !==false){
			this.time.m.innerHTML= (time.m < 10 ? '0' : '') + time.m;
		}
		if(time.s !==false){
			this.time.s.innerHTML= (time.s < 10 ? '0' : '') + time.s;
		}
		if(time.sign){
			this.time.sign.innerHTML = time.sign;
		}
	}
	
	this.start = function(resume){
		if(this.started)
			return;
			
		if(!resume){
			this.time.seconds=0;
		}
			
		this.interval=setInterval(this.tick,1000);
	}
	
	this.stop = function(){
		this.pause();
		this.blank();
	}
	
	var _this=this;
	
	this.tick = function(){
		
		if(_this.options.sign=='-')
			_this.time.seconds--;
		else
			_this.time.seconds++;
			
//		_.log('tick',_this.time,(new Date()));
		
		var t = {
			h : Math.floor(Math.abs(_this.time.seconds / 3600)),
			m : Math.floor(Math.abs((_this.time.seconds / 60) % 60)),
			s : Math.floor(Math.abs(_this.time.seconds % 60)),
		}
		
		if(_this.options.sign=='+' && _this.time.seconds==0){
			t.sign=_this.options.sign='-';
		}else if(_this.options.sign=='-' && _this.time.seconds==0){
			t.sign=_this.options.sign='+';
		}
		
		_this.set(t);
	}
	
	this.time = {
		h : '00',
		m : '00',
		s : '00',
		sign : '+',
		start : 0,
		seconds : 0,
	};
	
	this.unpack = function(){
		if(!this.ele){
			var ele=document.createElement('div');
			ele.className=this._class;
			this.ele=ele;
		}else{
			this.ele.className+=this._class;
		}
		
		var ticker=document.createElement('div');
		ticker.className='ticker';
		
		var h = document.createElement('span');
		h.className="h";
		h.innerHTML = this.time.h;
		ticker.appendChild(h);
		this.time.h=h;
		
		var sep=document.createElement('span');
		sep.className='sep';
		sep.innerHTML=':';
		ticker.appendChild(sep);
		
		var m = document.createElement('span');
		m.className="m";
		m.innerHTML = this.time.m;
		ticker.appendChild(m);
		this.time.m=m;
		
		var sep2=sep.cloneNode(true);
		ticker.appendChild(sep2);
		
		var s = document.createElement('span');
		s.className="s";
		s.innerHTML = this.time.s;
		ticker.appendChild(s);
		this.time.s=s;
		
		var sign = document.createElement('span');
		sign.className="sign";
		sign.innerHTML = this.time.sign;
		ticker.appendChild(sign);
		this.time.sign=sign;
		
		this.ele.appendChild(ticker);
		
		this.unpacked=true;
	}
	
	this.unpacked=false;
	
	this.unpack();
	this.init();
	
	if(this.options.start=='user'){
		if(jQuery){
			_this=this;
			
			(function($){
				$(window).on(_.str.events.user.join(' '),function(){
					if(!_this.started){
						_this.start();
						$(_this.ele).fadeIn('slow');
						_this.started=true;
						
						//remove yourself
						$(this).unbind(_.str.events.user.join(' '));
					}
				});	
			
			})(jQuery);
			
			this.context(_this);
		}
	}else if(this.options.auto_start){
		this.start();
	}
	
}

if(!_.ui.stopwatches){
	_.ui.stopwatches = {};
}

if(jQuery){
	
	(function($, _){
	
		$(document).ready(function(){

			$('[data-_-mod-stopwatch]').each(function(i,ele){
				
				var id = ele.getAttribute('data-_-mod-stopwatch');
				
				var watch = false;
				
				if(id && _.ui.stopwatches[id]){
					watch = _.ui.stopwatches[id];
				}else{
					id = _.str.uniqid('_-mod--stopwatch--');
					watch = _.ui.stopwatches[id] = new _.mod.stopwatch({
						ele 			: ele,
						'auto-start'	: false,
						sign 			: '+',
						start 			: 'user'
					});
				}
				
				_.log('mod[stopwatch][init]',id,watch,ele);
				
			});

		});
		
	})(jQuery, _);
	
}