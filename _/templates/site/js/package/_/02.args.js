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