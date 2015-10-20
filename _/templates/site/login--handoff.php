<?php
	
	# ~EN (2015): PH1 >> login handoff wrapper to old site
	
	if(isset($_GET['out'])){ ?>
	
		<script>
			
			parent._.ui.fancybox.close({
				after : function(){
					parent.location.href='/';
				}
			});
		</script><?php
			
		exit;
		
	}
	
	if(empty($_SESSION['_']['form']['login']['handoff']) || !($handoff = $_SESSION['_']['form']['login']['handoff'])){
		$_['url']->redirect('/');
	}
	
	$handoff['args']['cmd'] = 'login';
	$handoff['args']['embed'] = true;
	$url = $_['api']['sfm']->handoff_url($handoff['args']);
	
	$_['tmp']['ref'] = (!empty($this->matches) && !empty($this->matches[1]) ? new _Page(array(
		FETCH_FROM_DB	=> true,
		'slug'			=> $this->matches[1]
	)) : false);	
	
	$_['tmp']['mod'] = array('xfancybox');
	
	echo $this->header();
#	$this->module('fancybox'); ?>
	
	<div class="_-wrapper _-page _-page--sub _-page--log-in _-page--<?php echo $this->slug.(!empty($this->matches) && !empty($this->matches[1]) ? ' _-page--'.$this->matches[1].' _-page--'.$this->slug.'--'.$this->matches[1] : ''); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<h1 class="_-align--center">Please Wait...</h1>
			<a class="_-handoff--link _-lightbox fancybox fancybox.iframe" href="<?php echo $url; ?>" style="display:none;" rel="group" title="Administration Area - Sun & Fun Media" data-_-fancybox-skip>Open</a><?php
				
				
				
#				var_dump('$$@',$_SESSION['_']['form']['login']['handoff']); ?>
				
			<div class="_-gallery--wrapper _-gallery--sub--wrapper">
				
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
								showCloseButton : false,
								closeBtn : false
							});

							
							$('._-handoff--link').click();
						
						});
						
					})(jQuery);
					
				</script>				
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>