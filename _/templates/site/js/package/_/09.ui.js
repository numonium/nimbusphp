(function($,_){

	var __t = _.ui = {
		_id : 'ui',
		init : function(args){
			$('form ._-ui--file-upload').each(function(i,ele){
				_.ui.forms.upload.init({ele : ele});
			});
			
			__t.img.load();	
			__t.font.load();		
			__t.font.size();
			__t.scroll.init();
			__t.accordion.init();
			
			if(_.e.load){
			
				__t.eq.height();
				
			}else{
			
				$(window).load(function(){
	
					__t.eq.height();
					
				});

				$(window).resize(function(){
					
					setTimeout(__t.eq.height,500);
				});
			}
		},	
		accordion: {
			init : function(){
				var _attr = 'data-_-ui-accordion';
				
				$(document).on({
					click : function(e){
						var ele = e.currentTarget || e;
						var parent = ($(ele).attr(_attr) ? ele : $(ele).parents('[' + _attr + ']').get(0));
						
						if(!parent){
							return false;
						}
						
						$(parent).find('[' + _attr + '-content]').toggleClass('_-expand');
					}
				}, '[' + _attr + '] [' + _attr + '-toggle]');
			}	
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
		eq : {
			height : function(){
				var _attr = 'data-_-ui-eq-height';
				
				var h = 0, vary = false;
				var eles = $('[' + _attr + ']').children();
				
				$(eles).each(function(i,ele){
					
					var ch = false;
					if(ch = $(ele).find('[' + _attr + '-vary]').get(0)){
						$(ch).height('');

						var ch_h = $(ch).height();
						$(ch).height(ch_h);

						if($(ch).height() > vary){
							vary = $(ch).height();
						}
					}else if($(ele).height() > h){
						h = $(ele).height();
					}
				}).each(function(i,ele){

					var ch = false;
					if(vary && (ch = $(ele).find('[' + _attr + '-vary]').get(0))){
						$(ch).height(vary);
					}else{
						$(ele).height(h);
					}
					
				});
			}	
		},
		fancybox : {
			close : function(args){
				
				if(args.after){
					
					setTimeout(args.after, 250);
					
				}
				
				return $.fancybox.close();
			}	
		},
		font : {
			_ : {
				WebFontConfig : {
					custom : {
						families : ['sfm-icons']
					},
					fontloading : function(family,fvd){
						console.log('***[ui][font][load]',family,fvd,$('[class^="_-icon--font--"]'));
						$('[class^="_-icon--font--"]').show();
					}
				}
			},
			family : function(ele, prop){
				return window.getComputedStyle(ele, null).getPropertyValue(prop);
			},
			load : function(args){
				
				(function() {
				    var wf = document.createElement('script');
				    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
				              '://ajax.googleapis.com/ajax/libs/webfont/1.5.6/webfont.js';
				    wf.type = 'text/javascript';
				    wf.async = 'true';
				    var s = document.getElementsByTagName('script')[0];
				    s.parentNode.insertBefore(wf, s);
				 })();
				
				
				$('[class^="_-icon--font--"]').hide();
				
/*				var ele = document.createElement('span');
				ele.style.fontFamily = "sfm-icons, 'comic sans', sans-serif";
				ele.style.visibility = 'hidden';
				
				document.getElementsByTagName('body')[0].appendChild(ele);
				
				var i = 0;
				var interval = setInterval(function(){
					
					_.log('###',i,ele,_.ui.font.family(ele,'font-family'),ele.style.fontFamily);
					
					i++;
					
					if(i === 100){
						clearInterval(interval);
					}
					
				}, 100);*/
			},
			size : function(){
					
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
		img : {
			load : function(args){
				
				args = args || {};
				
				$('._-page [data-_-img-load]').each(function(i, ele){
					
					var img = ele.getAttribute('data-_-img-load');
					
					$(ele).addClass('_-loading').css({
						'background-image' : "",
					});
					
					$('<img src="' + img + '" />').load(function(e){
						_.log('ui[img][load]',img,ele,e);
						$(ele).removeClass('_-loading').css({
							'background-image' : "url('" + img +"')"
						});
					});
					
/*					$.ajax({
						url : img,
					}).done(function(args){
						_.log('###',img,args);
					})*/
					
				});

				
//				if(args.eles)
				
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
		},
		scroll : {
			init : function(args){
				
/*				$('[data-_-ui-scroll]').each(function(i,ele){
					
					$(ele).jScrollPane({
						addTo : $(ele).parent().get(0),
						animateScroll : true,
						autoReinitialise : true,
						showArrows : false
					});
					
					var api = $(ele).data('jsp');
					var throttleTimeout;
					
					$(window).resize(function(e){
					
						if (!throttleTimeout){
							throttleTimeout = setTimeout(
								function(){
									api.reinitialise();
									throttleTimeout = null;
								},50
							);
						}

					});
				});*/
				
			}
		}
	};
	
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
		_.e.ready = true;
	});
	
	$(window).load(function(){
		_.e.load = true;
	});
	
})(jQuery,_);

var WebFontConfig = _.ui.font._.WebFontConfig;