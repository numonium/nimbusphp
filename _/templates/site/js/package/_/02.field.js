(function(_,$){

	_.field = {
		init : function(){
			$(document).ready(function(){

				$('body').on('click', '[data-_-ui-field-check]', function(e){

					var ele = e.currentTarget || e;
					var target = $(ele).parent().find('[data-_-ui-field-check-target]').get(0);

					if(!target){
						alert('no target fields!');
					}

					if(ele.checked){
						target.value = 1;
					}else{
						target.value = -1;
					}

				});
				
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
					var ac_type = ele.getAttribute(attr),
						wrapper = $(ele).parents('[' + attr + '-wrapper]')[0];
					var target = $(wrapper).find('[' + attr + '-target]')[0];
					var f_select = f_source = f_render_item = f_render_menu = null;
					
					if(ac_type == 'cities'){
						f_select = _.api.sfm.admin.vacations.ac.cities_select;
						f_source = function (request, response) {
							jQuery.getJSON(
								"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
								function (data) {
									response(data);
								}
							);
						};
					}else if(ac_type == 'vacations'){
						f_source = function(req, res){
							jQuery.getJSON(
								"/-/vacations?q="+req.term,
								function (data){
									// should probably take id/label/value
									console.log('###',data);
									var ret = [], item = {};
									
									for(var i in data){
										if(data.hasOwnProperty(i)){
											ret.push({
												id : data[i].id,
												value : data[i].name,
												name : data[i].uuid,
												data : data[i]
											});
										}
									}
									
									res(ret);
								}
							);
						};

						f_select = function(e, ui){
							
							var clone = $(_.tem.dest_form_q).clone(true);
							
							$(clone).addClass('_-filled').find('[data-_-field="dest--q"]').replaceWith('<h5 data-_-field="dest--q">' + ui.item.label + '</h5>');
							$(clone).find('[data-_-field="dest--uuid"]').val(ui.item.data.uuid);
							$(clone).find('[data-_-field="dest--id"]').val(ui.item.data.id);
							$(clone).find('[data-_-field="dest--rate"]').val(ui.item.data.rate).removeAttr('readonly');

							if(ui.item.data.type !== 'vacation'){
								$(clone).find('._-icon--wrapper ._-icon').removeClass('_-icon--font--vacation').addClass('_-icon--font--destination-' + ui.item.data.type);
							}
							
							$(clone).find('._-btn._-btn--dest--add').click(function(e2){
								$(this).parents('fieldset').remove();
							});
							
							var fieldset_parent = $('._-fieldset--dest--sel').parent().get(0);
							
							if(!$(fieldset_parent).find('[data-_-field="dest--uuid"]').filter(function(i){ return $(this).val() == ui.item.data.uuid;}).length){
								$(fieldset_parent).append(clone);
							}
							
							$(wrapper).find('[data-_-field="dest--q"]').val('');

							if(ui.item.data.hidden){
								$(clone).removeClass('_-dest--show').addClass('_-dest--hide');
								// $(clone).find('._-btn--dest--hide').hide();
								// $(clone).find('._-btn--dest--show').show();
							}else{
								$(clone).removeClass('_-dest--hide').addClass('_-dest--show');
								// $(clone).find('._-btn--dest--hide').show();
								// $(clone).find('._-btn--dest--show').hide();								
							}

							$(clone).find(':required').removeAttr('required');
							
							console.log('##$$',e,$(fieldset_parent).find('[data-_-field="dest--uuid"]').filter(function(i){ return $(this).val() == ui.item.data.uuid;}).length,_.tem.dest_form_q,ui);
							
							return false;
						};

						f_render_item = function(ul, item){
							
							console.log('ui[autocomplete][render][item]',item);

							item.data.type = item.data.type || 'vacation';

							var tem =
								'<div class="ui-menu-item-icon">' +
									'<div class="_-icon--wrapper"><span class="_-icon _-icon--font--' + (item.data.type != 'vacation' ? 'destination-' : '') + item.data.type + '"></span></div>' +
								'</div>' +
								'<div class="ui-menu-item-content">' +
									'<h3 class="_-item--name">' + item.data.name + '</h3>'
									// (item.data.email ? '<p class="_-item--email">' + item.data.email + '</p>' : '') +
									// (item.data.phone ? '<p class="_-item--phone">' + item.data.phone + '</p>' : '') +
								'</div>'
							;
								
							
							return $('<li>')
								.data('item.ui-autocomplete',item)
								.append(tem)
								.appendTo(ul);
						};


					}else if(ac_type == 'leads'){
						f_source = function(req, res){
							jQuery.getJSON(
								"/-/leads?q="+req.term,
								function (data){
									// should probably take id/label/value
									
									var ret = [], item = {};
									
									for(var i in data){
										if(data.hasOwnProperty(i)){
											ret.push({
												id : data[i].id,
												value : data[i].name._ + ' <' + data[i].email + '>',
												name : data[i].uuid,
												data : data[i]
											});
										}
									}
									
									res(ret);
								}
							);						
						}
						
						f_select = function(e, ui){
							
							var clone = $(_.tem.leads_form_q).clone(true);
							
// 							data-_-field="leads--uuid"
							
							$(clone).addClass('_-filled').find('[data-_-field="leads--q"]').val(ui.item.label);
							$(clone).find('[data-_-field="leads--uuid"]').val(ui.item.data.uuid);
							$(clone).find('[data-_-field="leads--id"]').val(ui.item.data.id);

							$(clone).find('._-btn._-btn--dest--add').click(function(e2){
								$(this).parents('fieldset').remove();
							});
							
							var fieldset_parent = $('._-fieldset--contact--sel').parent().get(0);
							
							if(!$(fieldset_parent).find('[data-_-field="leads--uuid"]').filter(function(i){ return $(this).val() == ui.item.data.uuid;}).length){
								$(fieldset_parent).append(clone);
							}
							
							$(wrapper).find('[data-_-field="leads--q"]').val('');

							$(clone).find(':required').removeAttr('required');
							
							console.log('##$$',e,$(fieldset_parent).find('[data-_-field="leads--uuid"]').filter(function(i){ return $(this).val() == ui.item.data.uuid;}).length,_.tem.leads_form_q,ui);
							
							return false;
						};
						
						f_render_item = function(ul, item){
							
							console.log('ui[autocomplete][render][item]',item);
							
							var tem =
								'<div class="ui-menu-item-icon">' +
									'<div class="_-icon--wrapper"><span class="_-icon _-icon--font--user"></span></div>' +
								'</div>' +
								'<div class="ui-menu-item-content">' +
									'<h3 class="_-item--name">' + item.data.name._ + '</h3>' +
									(item.data.email ? '<p class="_-item--email">' + item.data.email + '</p>' : '') +
									(item.data.phone ? '<p class="_-item--phone">' + item.data.phone + '</p>' : '') +
								'</div>'
							;
								
							
							return $('<li>')
								.data('item.ui-autocomplete',item)
								.append(tem)
								.appendTo(ul);
						};
						
						f_render_menu = function(ul, items){
							var _t = this;
							
							console.log('ui[autocomplete][render][menu]',ul, items);
							
							$.each( items, function( index, item ) {
							    _t._renderItemData( ul, item );
							});
							
							var tem = 
								'<li id="ui-id-last" class="ui-menu-item" tabindex="9999">' +
									'<div class="ui-menu-item-icon">' +
										'<div class="_-icon--wrapper"><span class="_-icon _-icon--font--users-add"></span></div>' +
									'</div>' +
									'<div class="ui-menu-item-content">' +
										'<h3 class="_-item--name"> Add New Lead &#9658;</h3>' +
									'</div>' +
								'</li>'
							;
							
							var tem_ele = $(tem)[0];
							
							$(tem_ele).click(function(e2){
								$('._-form-embed--lead ._-fieldset--lead--q ._-btn').click();
								$(ele).data('ui-autocomplete').close();
							});
							
							//'._-form-embed--lead ._-fieldset--lead--q ._-btn._-btn--dest--del'
								
							
							$(ul).append(tem_ele);
						};
						
					}
					
					var ac_args = {
						source: f_source,
						appendTo: wrapper,
						minLength: 2,
						position: {
							my : 'center top-10px',
							at : 'center bottom'
						}
					};

					if(f_select){
						ac_args.select = f_select;
					}
					
					if(ele.value){
						f_select(false,{item : { value : ele.value }});
					}
					
					$(ele).autocomplete(ac_args);
					
					if(f_render_item){
						$(ele).data('ui-autocomplete')._renderItem = f_render_item;
					}
					
					if(f_render_menu){
						$(ele).data('ui-autocomplete')._renderMenu = f_render_menu;
					}

					$(ele).data('ui-autocomplete')._resizeMenu = function(){
				        var ul = this.menu.element;
				        ul.outerWidth(this.element.outerWidth());
					}
					
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
		},
		submit : function(args){
			
			if(!args || !args.form){
				return false;
			}
			
			args.type = args.type || $(args.form).attr('method');
			args.url = args.url || args.action || $(args.form).attr('action');
			args.data = args.data || $(args.form).serialize();
			args.success = args.success || args.callback || function(data){ alert(data); };
			
			$.ajax(args);
			
			return true;
/*			
		    $.ajax({
	           type: "POST",
	           url: url,
	           data: $("#idForm").serialize(), // serializes the form's elements.
	           success: function(data)
	           {
	               alert(data); // show response from the php script.
	           }
	         });*/
			
		}
	};
	
})(_,jQuery);
