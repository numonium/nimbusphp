<?php
	
#	$this->module('xfancybox');
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<section class="_-page--content--text">
				<h1>Forgot Your Password?</h1>
				<h2>Please Wait...</h2>
			</section>
			<section class="_-page--<?php echo $this->slug; ?>--listing" data-_-map-listing="<?php #echo $_vac->city['name']; ?>">
										
				<a class="_-handoff--link _-lightbox fancybox fancybox.iframe" href="<?php echo $_['const']['link']['old']['admin']['forgot-pw'].'?embed'; ?>" style="display:none;" rel="group" title="Forgot Password" data-_-fancybox-skip>Open</a>
								
				<script type="text/javascript">
					
					(function($){
						
						$(document).ready(function(){
							
							$('.fancybox, ._-lightbox').fancybox({
								autoSize : false,
								width : '90%',
								height : '90%',
								helpers : { 
									overlay : {closeClick: false},
									title : false
								},
								/* ~EN (2015): close button control  *
								showCloseButton : false,
								closeBtn : false,*/
								afterClose : function(){
									window.location.href = '/log-in';
								}
							});
							
							$('._-handoff--link').click();
						
						});
						
					})(jQuery);
					
				</script>
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>