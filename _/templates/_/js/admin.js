/* juniper/lib/js/admin - scripts for administration area
	(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
*/

_.admin = {
	editing : false,
	fn : {
		_submit : function(e){
			alert('asd');
			
			return false;
		},
		hide_controls : function(){
			_.log('admin[menu][hide]',arguments,_.admin.pane);
			$(_.admin.pane).children('._-nav').children('._-nav--item').children('._-sub').removeClass('_-transition');
//						setTimeout(function(){
			
				$(_.admin.pane).children('._-nav').children('._-nav--item').removeClass('selected');
				
//						},1000);
//						$(_.admin.pane).children('._-nav').children('._-nav--item').removeClass('selected');
			window.location.hash = '#';
		},
		init : 	function(){
			if(jQuery){
				(function($){
				
/*					$(_.admin.pane).find('.button').each(function(i){
						var href = $(this).attr('href');
						$(this).attr('loc',href);
						$(this).attr('href','javascript:;')
						href='';
					});
					
*/

					/* enable list filtering */
					$('#admin--pane ._-nav ._-nav--item ._-search .q input').on(_.ui.nav.e.filter.q);
					$('#admin--pane ._-nav ._-nav--item ._-search .q .q--clear').on(_.ui.nav.e.filter.clear);

					/* editable ares -> wysiwyg */
					$('._-editable').each(function(i){
					
						_.log('> wysiwyg[init]',this);
						_.ui.editors.wysiwyg.fn.init(this);
					
					});
					
					
					if($(_.canvas.parentNode).find('._-admin--header').length == 0){ // don't edit admin pages, only content pages
	
						/* ~EN: master form to hold all data from different widgets before submit */
						var form = $('<form id="_-form--admin" method="post" action="/admin/save" onsubmit="return false;"></form>')[0],
						 form_uuid = $('<input type="hidden" name="uuid" value="FtBrmeqi9t9xg8XTOt9KoUsQeiwuHmWZrpzoAy1uAj9K74iYcx1CkIQjiQs0MsB" />')[0],
						 form_submit = $('<ihput type="hidden" name="_submit" value="Submit" />')[0];
						 
						form.appendChild(form_uuid);
						form.appendChild(form_submit);
						
						/*
						form.onsubmit = function(e){
							return _.admin.fn._submit(e);
						}*/
						
						_.canvas.appendChild(form);
						
						$(_.canvas.parentNode).click(_.admin.fn.hide_controls);
						
						
						
						$(_.canvas.parentNode).on('dblclick',function(){
							window.location.href='#-edit';
						});
						
					}
					
					// rewrite links
					$(_.canvas).find('a').each(function(i){
						var href = $(this).attr('href');
						if(href && href.charAt(0)=='#'){
							return;
						}else if(href && href.charAt(0)=='/'){
							href = href.substring(1);
						}
						
						if(
							($(this).attr('rel') && ($(this).attr('rel') == 'lightbox')) || // is lightbox?
							($(this).attr('href') && ($(this).attr('href').startsWith('javacript:'))) || // is javascript function?
							($(this).parents('.redactor_box').length > 0) // is redactor button?
						){
							// do nothing, i guess?
						}else{						
							$(this).attr('href','#/admin/leave/'+href);
							$(this).attr('loc','/'+href);
						}
						
						href='';
					});
					
					$(window).hashchange(_.router);
					
					_.router({hash : window.location.hash});
				
				})(jQuery);
			}
		}
	},
	has : {
		menu : function(item){
			if(!jQuery)
				return false;
				
			var ret = false;	
			
			(function($){
			
				ret = ( $('#admin--pane--'+item)[0] && $('#admin--pane--'+item).children('._-sub').length > 0);
			
			})(jQuery);
			
			return ret;
		}	
	},
	menu : {
		deselect : function(item){
			if(!item || !jQuery){
				return false;
			}
			
			var ret = false;
			
			(function($){
				if(_.is.array(item)){
					ret = [];

					for(var i in item){
						if(item.hasOwnProperty(i)){
							ret.push(_.admin.menu.deselect(item[i]));
						}
					}
					
					return;
				}else{
					$(item).removeClass('selected').children('._-sub').removeClass('_-transition');
					
/*					setTimeout(function(){
						$(item).children('._-sub').hide();
						_.log('--',$(item).children('._-sub'));
					
					},100); */
					
					ret = true;
				}				
				
			})(jQuery);
			
			return ret;

		},
		select : function(item){
			if(!item || !jQuery)
				return false;
				
			var ret=false;
				
			(function($){
				if(_.admin.has.menu(item)){
					//set
					
					//deselect other options
					_.admin.menu.deselect($.makeArray($(_.admin.pane).children('._-nav').children('._-nav--item')));
					
					//select current option
					$('#admin--pane--'+item).addClass('selected');
					_.log('admin[menu][select]',item,$('#admin--pane--'+item));
/*					$('#admin--pane--'+item+' > ._-sub').show().addClass('_-transition'); */
					$('#admin--pane--'+item+' > ._-sub').addClass('_-transition');
					
					ret = true;
				}
				
			})(jQuery);
				
			if(ret)
				return ret;
				
			switch(item){
				case 'add':
				case 'edit':
			alert('unset');
					$(_.admin.pane).children('._-nav ._-nav--item').removeClass('selected');
					$('#admin--pane--'+item).addClass('selected').children('._-sub').addClass('_-transition');
					break;
			}
		}
	},
	modal : {
		close : function(){
			if(_.admin.editing)
				return;

			var _shadow = (Shadowbox == top.Shadowbox ? Shadowbox : top.Shadowbox);
			_shadow.close();
			
			if(jQuery){
				(function($){
	
				})(jQuery);
			}

		},
		save : function(){
			var form = false;
			
			if(jQuery){
				(function($){
	
					form = $('._-form--admin')[0];
	
				})(jQuery);
			}
			
			form.submit();
		}
	},
	nav : function(ele){
		if(jQuery){
			(function($){
			
				var current = $('._-admin ._-nav ._-nav--item.selected ._-menu');
				current.hide();
				_.log('** current',current,ele);
			
			})(jQuery);
		}
	},
	pane : '',
	router : function(){
		var hash = arguments.hash || window.location.hash;
		if(hash.indexOf('#')==0){
			hash = hash.substring(1);
		}
		
		if(!hash || hash==''){
			return false;
		}
		
		var pieces = _.array.values(_.array.diff(hash.split('/'),['']));
		
		_.log('### router',hash,pieces);
		
		if(pieces.length > 0 && !_.array.isin(pieces[0],['admin']) &&  pieces[0].charAt(0)=='-'){
			var control = pieces[0].substring(1);
		
			if(_.admin.state == control){
				return;
			}else{
				_.admin.setState(control);
			}
				
			switch(control){
				case 'edit':
					if(_.admin.editing)
						return;
					
					
					if(jQuery){
						(function($){
					
							$('#content #content--main').addClass('_-editable');
							_.ui.editors.wysiwyg.fn.init($('#content #content--main')[0]);
							
							$(_.canvas).click();
						
						})(jQuery);
					}
					
					_.admin.editing = true;

					break;
				case 'close':
					_.admin.modal.close();
					break;
				case 'save':
					_.admin.modal.save();
					break;				
			}
			
			window.location.href='#';
		
		}else if(pieces[0] == 'admin'){
		
			_.log('admin[route]',pieces[1]);
			if(pieces.length >= 2 && _.admin.has.menu(pieces[1])){
			
				if(pieces.length == 2){
					_.admin.menu.select(pieces[1]);
				}else if(pieces.length == 3){
					
					if(jQuery){
						(function($){
		
							$('#admin--pane--'+pieces[1]+' ._-sub ._-modal').load(hash, function(){
								$(this).removeClass('_-ajax');
								_.admin.nav(this);
							});
						
						})(jQuery);
						
//						alert('you want to '+pieces[1]+': '+pieces[2]);
					}
					
				}else{
					return false;
				}
				
			}else{		
				switch(pieces[1]){
					// handle things like /admin/leave
					
					case 'leave':
						if(_.admin.editing){
							alert('Please save your work before leaving.');
							
							return false;
						}
						
						// if pieces have [ admin , leave , contact-us, submit], we want to go to /contact-us/submit
						href = pieces.slice(2).join('/');
						
						if(href.indexOf('//') < 0){
							
							href = '/' + href;
							
						}
						
						if(_.url.get.embed){
							href+= (href.indexOf('?') >= 0 ? '&' : '?') + 'embed';
						}
												
						window.location.href = href;
						
						return true;

					
				}
			}
		
		}/*else if(pieces.length == 2 && pieces[0] == 'admin' && _.admin.has.menu(pieces[1])){
			_.admin.menu.select(pieces[1]);
		}else if(pieces.length >= 3 && pieces[0] == 'admin' && _.admin.has.menu(pieces[1])){
			if(jQuery){
				(function($){

					$('#admin--pane--'+pieces[1]+' ._-sub ._-modal').load(hash, function(){
						$(this).removeClass('_-ajax');
						_.admin.nav(this);
					});
				
				})(jQuery);
			}
//			alert('you want to '+pieces[1]+': '+pieces[2]);
		}*/
		
	},
	setState : function(state){
		_.admin.state=state;
		
		if(!state){
			_.log('- state (normal)',state,_.admin.state);
		}else{
			_.log('+ state',state,_.admin.state);
		}

	},
	state : false
}

_.routers.admin = _.admin.router;
_.url.digest();

if(jQuery){
	
	(function($){
		$(document).ready(function(){
			_.admin.pane = $('._-pane--main')[0];
			_.canvas = $('._-canvas')[0];
			_.admin.fn.init();
			
			// TODO - move to global init
			_.ui.forms.ac();
			_.ui.forms.infinite();
		});
		
	})(jQuery);
	
}else{
	alert(':C');
}