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
			
			this.init();			
			
		},
		proto : {
			
			admin : {
				dest : {
					init : function(args){
						_.tem = _.tem || {};

						_.tem.dest_form_q = $('._-form-embed--dest ._-fieldset--dest--q').clone(true);
						$(_.tem.dest_form_q).find(':input').filter(function(){
								return this.type!="submit" && this.type!="hidden";
						}).attr('readonly',true).val('');
												
						_.tem.dest_form_add = $('._-form-embed--dest ._-fieldset--dest--add').hide().clone(true);
						$(_.tem.dest_form_add).find(':input[type!="submit"]').val('');
						
						var date_start = null;
						if(date_start = $('._-page--admin-stations [date-_-ui-date-start]').get(0)){
							date_end = $(date_start).parent().find('[date-_-ui-date-end]').get(0);

							$(date_start).datepicker({
								changeMonth : true,
								onClose : function(selectedDate){
									$(date_end).datepicker( "option", "minDate", selectedDate );
								}
							});

							$(date_end).datepicker({
								changeMonth : true,
								onClose : function(selectedDate){
									$(date_start).datepicker( "option", "maxDate", selectedDate );
								}
							});
						}

					}
				},
				leads : {
					init : function(args){
						
						_.tem = _.tem || {};

						_.tem.leads_form_q = $('._-form-embed--lead ._-fieldset--lead--q').clone(true);
						$(_.tem.leads_form_q).find(':input[type!="submit"]').attr('readonly',true).val('');
						$(_.tem.leads_form_q).find(':required').removeAttr('required');
												
						_.tem.leads_form_add = $('._-form-embed--lead ._-fieldset--lead--add').hide().clone(true);
						$(_.tem.leads_form_add).find(':input[type!="submit"]').val('');
						
						$(document).on({
							click : function(e2){
								$(this).removeClass('_-btn--dest--add').addClass('_-btn--dest--del');
								
								var fieldset = $('._-form-embed--lead ._-fieldset--lead--q').get(0),
									fieldset_add = $('._-form-embed--lead ._-fieldset--lead--add').get(0);
									

								var name = $(fieldset).find('._-input--text').attr('readonly',true).val().trim();
								
								$(fieldset).find('._-icon--font--user').removeClass('_-icon--font--user').addClass('_-icon--font--users-add');
								
								if(name != ''){
									
									name = name.split(' ');
									
									$(fieldset_add).find('[data-_-field="leads--add--name--last"]').val(name.pop());
									
									if(name.length){
										$(fieldset_add).find('[data-_-field="leads--add--name--first"]').val(name.join(' '));										
									}
								}
								
								$(fieldset_add).show();
								
							}
						},'._-form-embed--lead ._-fieldset--lead--q ._-btn._-btn--dest--add');

						$(document).on({
							click : function(e){
								$(this).parents('fieldset').remove();
							}
						},'._-fieldset--lead--q._-filled ._-btn._-btn--dest--add, ._-fieldset--dest--q._-filled ._-btn._-btn--dest--add');
						
						$(document).on({
							click : function(e2){
								
								var fieldset = $('._-form-embed--lead ._-fieldset--lead--q').get(0),
									fieldset_add = $('._-form-embed--lead ._-fieldset--lead--add').get(0);
								
								$(this).removeClass('_-btn--dest--del').addClass('_-btn--dest--add');
								$(fieldset).find('._-icon--font--users-add').removeClass('_-icon--font--users-add').addClass('_-icon--font--user');
								$('._-form-embed--lead ._-fieldset--lead--add').hide();	
								$('._-form-embed--lead ._-fieldset--lead--q ._-input--text').attr('readonly',false);
							}
						},'._-form-embed--lead ._-fieldset--lead--q ._-btn._-btn--dest--del');
						
						$('._-form-embed--lead ._-input--submit').click(__t.admin.leads.submit);

						var date_start = null;
						if(date_start = $('._-page--admin-leads ._-widget--filter [data-_-ui-date-start]').get(0)){

							$('._-page--admin-leads ._-widget--filter [data-_-ui-date-start]').datepicker({
								changeMonth : true,
								onClose : function(selectedDate){
									$('._-page--admin-leads ._-listing--filter #_-listing--filter--date--end').datepicker( "option", "minDate", selectedDate );
								}
							});

							$('._-page--admin-leads ._-listing--filter #_-listing--filter--date--end').datepicker({
								changeMonth : true,
								onClose : function(selectedDate){
									$('._-page--admin-leads ._-listing--filter #_-listing--filter--date--start').datepicker( "option", "maxDate", selectedDate );
								}
							});
						}
						
					},
					submit : function(e){
						e.preventDefault();
						
						var ele = e.currentTarget;
						
						var fieldset = $('._-form-embed--lead ._-fieldset--lead--q').get(0),
							fieldset_add = $('._-form-embed--lead ._-fieldset--lead--add').get(0);
							
						var form = $('<form method="post" action="/admin/leads/submit"></form>');
						
						$(fieldset_add).find(':input').each(function(i,field){
							
							var clone = $(field).clone(true);
							$(clone).attr('name', $(clone).attr('name').replace('reservation[lead][new]','lead'));
							
							$(form).append(clone);
							
						});
						
						_.field.submit({
							form : form,
							success : function(data){
								var clone = $(_.tem.leads_form_q).clone(true);
								
	// 							data-_-field="leads--uuid"
								
								$(clone).addClass('_-filled').find('[data-_-field="leads--q"]').val(data.name._ + (data.email ? ' <' + data.email + '>' : ''));
								$(clone).find('[data-_-field="leads--uuid"]').val(data.uuid);
								$(clone).find('[data-_-field="leads--id"]').val(data.id);
								
								$(clone).find('._-btn._-btn--dest--add').click(function(e2){
									$(this).parents('fieldset').remove();
								});
								
								var fieldset_parent = $('._-fieldset--contact--sel').parent().get(0);
								
								if(!$(fieldset_parent).find('[data-_-field="leads--uuid"]').filter(function(i){ return $(this).val() == data.uuid;}).length){
									$(fieldset_parent).append(clone);
								}
								
								$(fieldset_add).hide().find(':input[type!="submit"]').val('');
								$(fieldset).find('._-icon--font--users-add').removeClass('_-icon--font--users-add').addClass('_-icon--font--user');
								$(fieldset).find('[data-_-field="leads--q"]').val('').removeAttr('readonly');
								$(fieldset).find('._-btn._-btn--dest--del').removeClass('_-btn--dest--del').addClass('_-btn--dest--add');
								
								return false;
								
							}
						});
						
						console.log('## TYLER',form,ele,e);
					}	
				},
				settings : {
					init : function(args){
						
						this.admin.settings.pw_change();
						
					},
					pw : {
						strength : function(passwd, max, mult){
							
							var intScore   = 0;
							var strVerdict = "weak";
							var strLog     = "";
							mult = mult || 2;
							
							// PASSWORD LENGTH
							if(!passwd.length){
								return 0;
							}
							
							if (passwd.length<5)                         // length 4 or less
							{
								intScore = (intScore+3)
								strLog   = strLog + "3 points for length (" + passwd.length + ")\n"
							}
							else if (passwd.length>4 && passwd.length<8) // length between 5 and 7
							{
								intScore = (intScore+6)
								strLog   = strLog + "6 points for length (" + passwd.length + ")\n"
							}
							else if (passwd.length>7 && passwd.length<16)// length between 8 and 15
							{
								intScore = (intScore+12)
								strLog   = strLog + "12 points for length (" + passwd.length + ")\n"
							}
							else if (passwd.length>15)                    // length 16 or more
							{
								intScore = (intScore+18)
								strLog   = strLog + "18 point for length (" + passwd.length + ")\n"
							}
							
							
							// LETTERS (Not exactly implemented as dictacted above because of my limited understanding of Regex)
							if (passwd.match(/[a-z]/))                              // [verified] at least one lower case letter
							{
								intScore = (intScore+1)
								strLog   = strLog + "1 point for at least one lower case char\n"
							}
							
							if (passwd.match(/[A-Z]/))                              // [verified] at least one upper case letter
							{
								intScore = (intScore+5)
								strLog   = strLog + "5 points for at least one upper case char\n"
							}
							
							// NUMBERS
							if (passwd.match(/\d+/))                                 // [verified] at least one number
							{
								intScore = (intScore+5)
								strLog   = strLog + "5 points for at least one number\n"
							}
							
							if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/))             // [verified] at least three numbers
							{
								intScore = (intScore+5)
								strLog   = strLog + "5 points for at least three numbers\n"
							}
							
							
							// SPECIAL CHAR
							if (passwd.match(/.[!,@,#,$,%,^,&,*,?,_,~]/))            // [verified] at least one special character
							{
								intScore = (intScore+5)
								strLog   = strLog + "5 points for at least one special char\n"
							}
							
														 // [verified] at least two special characters
							if (passwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/))
							{
								intScore = (intScore+5)
								strLog   = strLog + "5 points for at least two special chars\n"
							}
						
							
							// COMBOS
							if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))        // [verified] both upper and lower case
							{
								intScore = (intScore+2)
								strLog   = strLog + "2 combo points for upper and lower letters\n"
							}
					
							if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) // [verified] both letters and numbers
							{
								intScore = (intScore+2)
								strLog   = strLog + "2 combo points for letters and numbers\n"
							}
					 
														// [verified] letters, numbers, and special characters
							if (passwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/))
							{
								intScore = (intScore+2)
								strLog   = strLog + "2 combo points for letters, numbers and special chars\n"
							}
							
							if(intScore < 16)
							{
							   strVerdict = "very weak"
							}
							else if (intScore > 15 && intScore < 25)
							{
							   strVerdict = "weak"
							}
							else if (intScore > 24 && intScore < 35)
							{
							   strVerdict = "mediocre"
							}
							else if (intScore > 34 && intScore < 45)
							{
							   strVerdict = "strong"
							}
							else
							{
							   strVerdict = "stronger"
							}
							
							if(mult){
								intScore *= mult;
							}
							
							return {
								val : (max && (intScore > max) ? max : intScore),
								str : strVerdict
							};

						}
					},
					pw_change : function(args){
						
						var _sel = ':input[data-ui-pw]';
						
						$(document).on({
							keyup : __t.admin.settings.pw_change_change
						}, _sel);
						
						var tem_meter = 
							'<div class="_-input--password--meter--wrapper">' +
								'<span class="_-input--password--meter--text" data-ui-pw-meter-text></span>' +
								'<div class="_-input--password--meter--wrapper--inner">' +
									'<span class="_-input--password--meter" data-ui-pw-meter></span>' +
								'</div>' +
							'</div>';
						
						$(_sel).each(function(i,ele){
							var meter = false;
							var id = ele.getAttribute('data-ui-pw');
							
							if(!(meter = $(ele).siblings('[data-ui-pw-meter]').get(0))){
								$(ele).parent().append(tem_meter);
							}
							__t.admin.settings.pw_change_change(ele);
							
							if(confirm = $(ele).parents('form').find('[data-ui-pw-confirm="' + id + '"]').get(0)){
								$(confirm).keyup(__t.admin.settings.pw_change_confirm);
							}
						});
						
						$('._-form--admin--settings--pw-change').submit(__t.admin.settings.pw_change_submit);
						
						_.log('!!$$',$(':input[data-ui-pw], ._-input--password'));
						
					},
					pw_change_change : function(e){
						var ele = e.currentTarget || e;
						var meter = $(ele).parent().find('[data-ui-pw-meter]').get(0);
						var id = ele.getAttribute('data-ui-pw');
						
						if($(ele).val() == ''){
							$(meter).parents('._-input--password--meter--wrapper').hide();
							return false;
						}
						
						$(meter).parents('._-input--password--meter--wrapper').show();
						
						var strength = __t.admin.settings.pw.strength(ele.value,100);
						
						$(ele).attr({
							'data-ui-pw-strength' : strength.str.replace(' ','-'),
							'data-ui-pw-strength-num' : strength.val
						}).parent().find('[data-ui-pw-meter-text]').text(strength.str)

						$(meter).attr({
							'data-ui-pw-strength' : strength.str.replace(' ','-'),
							'data-ui-pw-strength-num' : strength.val
						}).css('width',strength.val + '%').parents('._-input--password--meter--wrapper').attr({
							'data-ui-pw-strength' : strength.str.replace(' ','-'),
							'data-ui-pw-strength-num' : strength.val
						});
						
						if(confirm = $(ele).parents('form').find('[data-ui-pw-confirm="' + id + '"]').get(0)){
							$(confirm).keyup();
						}
						
					},
					pw_change_confirm : function(e){
						var ele = e.currentTarget || e;
						var id = ele.getAttribute('data-ui-pw-confirm');	
						var field_pw = false;
						
						_.log('###',$(ele).parents('form').find('[data-ui-pw="' + id + '"]').get(0));

						if(!(field_pw = $(ele).parents('form').find('[data-ui-pw="' + id + '"]').get(0))){
							return false;
						}
						
						if(ele.value != '' && field_pw.value != ''){
							if(ele.value == field_pw.value){
								$(ele).removeClass('_-error').addClass('_-success');
							}else{
								$(ele).removeClass('_-success').addClass('_-error');
							}
						}
					},
					pw_change_submit : function(e){
						var form = e.currentTarget || e;
						var ele = $(form).find('[data-ui-pw-confirm]').get(0);
						var id = ele.getAttribute('data-ui-pw-confirm');	
						var field_pw = false;
						
						if(!(field_pw = $(ele).parents('form').find('[data-ui-pw="' + id + '"]').get(0))){
							return false;
						}
						
						if(ele.value != '' && field_pw.value != ''){
							if(ele.value == field_pw.value){
								return true;
							}
						}
						
						return false;
	
					}
				},
				users : {
					init : function(args){
						var field = null;
						if(field = $('._-fieldset--pw-reset').length){
							__t.admin.settings.pw_change();					
							$(field).parents('form').submit(function(e){
								
								if($('#_-input--pw--new').val() != ''){
									return __t.admin.settings.pw_change_submit(e);
								}
								
								return true;

							});
						}
					}
				},
				vacations : {
					_ : {
						itin : {
							days : 0,
							nights : 0,
							day : [],
							night : []
						}	
					},
					ac : {
						cities_select : function (event, ui) {
							var selectedObj = ui.item,
								loc = false;
								
							// ~EN (2015): there's a chance BAD GEO code may be here...
								
							// ~EN (2015): strip off "united states" where applicable
							var city = ui.item.value.split(', ');
							
							if(city[city.length-1].toLowerCase().indexOf('united states')>=0){
								city.pop();
							}else if(city.length > 2){ // ~EN (2015): if outside the US, strip out province abbreviation
								city.splice(city.length-2,1);
							}
							
							// ~EN (2015): TODO FIX!
							
							//if(city.length > 2)
							
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
											'src' : '/-/proxy/' + Base64.encode('http://old.sunfunmedia.com' + img_src).toString(),
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
						
						$('[data-ui-cost-qty]').each(function(i,ele){
							var uuid = $(ele).attr('data-ui-cost-qty');
							var parent = $(ele).parents('form').get(0);
							var rateField = $(parent).find('[data-ui-cost-rate="' + uuid + '"]').get(0);
							var totalField = $(parent).find('[data-ui-cost-val="' + uuid + '"]').get(0);
							var totalFields = $(parent).find('[data-ui-cost-val]');
							var grandTotalFields = $(parent).find('[data-ui-total-val]');
							var qtyTotalFields = $(parent).find('[data-ui-total-qty]');
							var qtyFields = $(parent).find('[data-ui-cost-qty]');
							var qtyUnitFields = $(parent).find('[data-ui-total-qty-unit]');
							var vac_uuids = [];
							
							var calc = function(e){
								
								totalVal = ($(ele).val() != '' ? parseInt($(ele).val()) : 0) * parseInt($(rateField).val() );
								totalVal = (isNaN(totalVal) ? 0 : totalVal);
								
								$(totalField).val(totalVal);
								
								var sum = 0;
								$(totalFields).each(function(i,field){
									sum += (field.value != '' ? parseInt(field.value) : 0);
								});
								
								sum = (isNaN(sum) ? 0 : sum);
								$(grandTotalFields).val(sum);
								var numCerts = $(qtyFields).filter(function(i){
									if($(this).prop('value') != '' && parseInt($(this).prop('value')) > 0){
										vac_uuids.push($(this).attr('data-ui-cost-qty'));
										return true;
									}
									
									return false;
								}).length;
								
								$(qtyTotalFields).text(numCerts);
								$(qtyUnitFields).text('Certificate' + (numCerts !== 1 ? 's' : ''));
								
								if(!numCerts){
									$(parent).find('._-button._-button--book').hide();
								}else{

									var numStr = numCerts, uuid = '';
									
									console.log('!@@',vac_uuids,$(parent).find('[name="_\[uuid\]"]').val());
									
									if(
										(numCerts === 1) &&
										(uuid = $(parent).find('[name="_\[uuid\]"]').val()) &&
										vac_uuids[0] && (vac_uuids[0] == uuid)
									){
										numStr = 'this';
									}
									
									$(parent).find('._-vacation._-expand ._-vacation--itin ._-button--book ._-text ._-text--inner').text('Order ' + numStr + ' Certificate' + (numCerts !== 1 ? 's' : ''));
									$(parent).find('._-button._-button--book').show();
								}
							};
							
							$(this).keyup(calc).change(calc);
							calc();
						});
						
						$(document).on({
							click : function(e){
								var form = $(e.currentTarget).parents('form').get(0);
								
								if(!form){
									return false;
								}
								
								if(this.getAttribute('data-ui-form-input-submit') == 'reset'){
									if($(form).is('[data-action-reset]') && !$(form).is('[data-action-submit]')){
										$(form).attr('data-action-submit',$(form).attr('action'));
										form.action = $(form).attr('data-action-reset');
									}
								}
								
								console.log('ui[form][*submit]',form.action,form);
								form.submit();
								
								return false;
							}
						},'[data-ui-form-input-submit]');
						
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
			
				var _t = this;
			
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
						play : 5000,
//						play : 0,
						animation : 'slide'
					};
					
					_.field.init();
					
					$('._-page ._-admin--view--listing').stupidtable();
					
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
						
					}else if($('._-page--admin-settings').get(0)){
						__t.admin.settings.init.call(__t);
					}else if($('._-page--admin-users').get(0)){
						__t.admin.users.init.call(__t);
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
							slide_args.play = 7000;
							$('._-page ._-gallery--sub--wrapper').superslides(slide_args);
						}
					}
					
					if($('._-form-embed--lead, ._-page--admin-leads').get(0)){
						_t.admin.leads.init();
					}

					if($('._-form-embed--dest, ._-page--admin-dest').get(0)){
						_t.admin.dest.init();
					}

					
//					_t.init_links();
//					_t.init_page();

					_t.nav.filter.init();
					_t.nav.page.scroll.init();
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
							_t.clicked_marker = {
								marker : marker,
								map : _t.map,
								context : this
							};
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
							    			'<span class="_-text">Domestic</span>' +
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
							    			'<span class="_-icon _-icon--font--vacation"></span>' +
							    			'<span class="_-text">Intl</span>' +
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

						$(overlay).fadeOut();
						
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
						
						data = $(data)[0];
						
						
						_t.overlays.title($(data).attr('data-_-title'));
						
						$(_t.overlays._.content).html('').append(data);
						$(_t.overlays._.overlay).fadeIn();
						
						
						_.ui.init();
						
						if(_t.clicked_marker){
							_t.clicked_marker.marker.infobox.close();
						}
						
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
							
						$(_t.overlays._.overlay).fadeOut(400,function(){
							$(_t.overlays._.content).html('');
							
							_t.overlays.title();
							
							if(_t.clicked_marker){
								_t.clicked_marker.marker.infobox.open(_t.clicked_marker.map, _t.clicked_marker.context);
								_t.clicked_marker = null;
							}
						});
						
						$('body > ._-page').removeClass('_-has--over');
						_t.overlays._.shown = false;
						
						return true;
					},
					title : function(title){
						return _.title(title);
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
				filter : {
					keyup : function(e){
						var ele = e.currentTarget;
						var val = $(ele).val();
						var total = 0;
						
						var parent = $(ele).parents('._-listing--section').get(0);
						$(parent).find('._-table--listing ._-listing--item--name a').each(function(i,item){
							
							if($(item).text().toLowerCase().indexOf(val.toLowerCase()) < 0){
								$(item).parents('._-listing--item').hide();
							}else{
								$(item).parents('._-listing--item').show();
								total++;
							}
							
						});
						
						$(parent).find('._-listing--section--header > h3 > ._-num').text(total);
												
//						_.debounce(function(){
							console.log('###',total,ele);
//
					},
					init : function(args){
						
						$(document).on({
							keyup : __t.nav.filter.keyup,
//							change : __t.nav.filter.keyup
						},'._-listing--section ._-listing--main--header ._-listing--filter ._-input--text');
						
					}
				},
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
				}	,
				page : {
					scroll : {
						_ : {
							
						},
						init : function(args){				
							
							$('._-context--desktop ._-page ._-page--content').each(function(i,ele){
								
								if($(ele).find('._-gallery').length){
									return false;
								}
								
								$(ele).mCustomScrollbar({
									scrollbarPosition:"inside",
									theme : 'inset-3-dark'
								}).addClass('_-scroll');
							});
							
/*							_.log('@@@',$('._-chrome--footer[data-_-footer-scroll="1"] ._-chrome--footer--scroll'));
							
							$('._-chrome--footer[data-_-footer-scroll="1"] ._-chrome--footer--scroll').mCustomScrollbar({
								axis : 'x',
								scrollbarPosition:"inside",
								theme : 'inset-3-dark'
								
							});*/

						},
						reinit : function(){
							if($.browser.msie && parseInt($.browser.version,10)<=8){
								masks.scroll_pane=$(masks.content).jScrollPane({
									addTo : $('#content_wrapper_inner')[0],
									animateEast : portfolio_scroll_transition,
									animateScroll : true,
									showArrows : false
								});
								masks.scroll_pane_api=masks.scroll_pane.data('jsp');
							}else{
								__t.nav.page.scroll._._.reinitialise();
								if($('.jspContainer').height()>=$('._-page ._-page--content--inner').height()){
									$('.jspVerticalBar').hide();
								}else{
									$('.jspVerticalBar').show();
								}
							}
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
				mercator_bounds : function(projection,maxlat){
				    var yaw = projection.rotate()[0],
				        xymax = projection([-yaw+180-1e-6,-maxlat]),
				        xymin = projection([-yaw-180+1e-6, maxlat]);
				    
				    return [xymin,xymax];

				},
				projection : false,
				redraw : function(){},
				resize : function(e){},
				init2 : function(){}
			},
		}

	});
			
	_.e.sfm = {

		};
		
	_.api.sfm = _.api.sfm || new _._.api.SFM();
	
	// } tuner web api :EN~

})(_, jQuery, (typeof ko !== 'undefined' ? ko : {}));
