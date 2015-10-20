/* juniper/widgets/pictcha/js - javascript libs for Pictcha
	(juniper + nimbus) (c) 2012+ numonium //c */

_.mod.pictcha = {
	select : function(ele){
		_.log('pictcha[select]',ele);
		
		var field = document.getElementById('_-pictcha--field--select');
		
		(function($){
			$(ele).parents('._-pictcha--select').find('a').removeClass('selected');
			$(ele).addClass('selected');

			field.value = $(ele).children('img').attr('data-src') || $(ele).children('img').attr('src');
			
			$(ele).parents('form').submit();
			
		})(jQuery);		
	}
}