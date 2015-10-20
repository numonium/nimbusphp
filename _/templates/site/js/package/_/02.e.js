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