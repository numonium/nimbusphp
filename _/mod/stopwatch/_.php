<?php
	/* juniper/mod/stopwatch - javascript stopwatch */
	
	$this->css = _array_merge($this->css,array(
		'/css/_.css',
		'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
#		'/js/jquery.js',
		'/js/_.js',
		'js/_.js'
	));
	
	$this->options = _array_merge($this->options,array(
		'auto-start' => false,
		'sign'	=> '+',
		'start' => 'user'
	));
	
	ob_start();
	?>
		if(jQuery){
			(function($){
				$(document).ready(function(){
					if(!_.ui.stopwatches){
						_.ui.stopwatches = {};
					}
					_.ui.stopwatches.push(new _.mod.stopwatch(__OPTIONS__));

				})
			})(jQuery);
		}
	<?php
	$this->js['+'][]=ob_get_clean();
/*	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<title>Stopwatch</title>
		<link rel="stylesheet" type="text/css" href="/css/_.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="/fonts/led/_.css" />
		<link rel="stylesheet" type="text/css" href="css/_.css" />
		<script type="text/javascript" src="/js/jquery.js"></script>
		<script type="text/javascript" src="/js/_.js"></script>
		<script type="text/javascript" src="js/_.js"></script>
		<script type="text/javascript">
			var s;
			$(document).ready(function(){
			
				s = new _.mod.stopwatch({
					ele : document.getElementById('mid--content--stopwatch'),
					auto_start : false,
					sign : '+',
					start : 'user'
				});
				
				_.log('ticker',s,typeof $('.ticker')[0]);
			});
		</script>
	</head>
	<body>
		<div id="mid--content--stopwatch"></div>
<?php /*	
		<div class="ticker">
			<span class="h">00</span>
			<span class="sep">:</span>
			<span class="m">08</span>
			<span class="sep">:</span>
			<span class="s">00</span>
			<span class="sign"></span>
		</div><?php #.ticker ?>
		* ?>
	</body>
</html>
*/ ?>