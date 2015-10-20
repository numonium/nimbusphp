<?php
	/* juniper/lib/model/nav - model for navigation elements
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Nav extends _Model {
		var $items;
		var $style;
		var $ele; //wrapper element

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
		}

		function __get($var){
			return parent::__get($var);
		}
		
		function __toString(){
			global $_;
			
			ob_start();
			
			if($pages=$_['site']->get_pages('nav')){
				uasort($pages, 'cmp_order'); ?>
			
				<ul id="<?php echo (!empty($this->ele) && is_object($this->ele) && !empty($this->ele->attrs['id']) ? $this->ele->attrs['id'] : 'page'); ?>--nav" class="_-nav<?php
					echo (!empty($this->style) ? ' _-nav--style--'.$this->style : ''); ?>"><?php
					
					$i=0;
					$num_pages=count($pages);
					foreach($pages as $pkey=>$page){
						if(!empty($this->style) && $this->style=='col'){
							if($i % $this->each == 0){
								if($i>0){ ?>
	
										</ul>
									</li><?php
								} ?>

								<li class="_-nav--col col--<?php echo ceil($num_pages/$this->each); ?>">
									<ul><?php
							} ?>
						
							<li class="_-nav--item" id="<?php echo (!empty($this->ele) && is_object($this->ele) && !empty($this->ele->attrs['id']) ? $this->ele->attrs['id'] : 'page'); ?>--nav--<?php echo $page->slug; ?>">
								<a<?php echo ($_['url']->uri==$page->href ? ' class="selected"' : ''); ?> href="<?php echo ($page->href[0]!='/' ? '/' : '').$page->href; ?>"><span><?php
	
									echo $page->name;
							
								?></span></a>
							</li><?php
						
						}else{ ?>

							<li id="<?php echo (!empty($this->ele) && is_object($this->ele) && !empty($this->ele->attrs['id']) ? $this->ele->attrs['id'] : 'page'); ?>--nav--<?php echo $page->slug; ?>">
								<a<?php echo ($_['url']->uri==$page->href ? ' class="selected"' : ''); ?> href="<?php echo ($page->href[0]!='/' ? '/' : '').$page->href; ?>"><span><?php
	
									echo $page->name;
							
								?></span></a>
							</li><?php
							
						}
						$i++;
					}
					
					if(!empty($this->style) && $this->style=='col'){ ?>

							</ul>
						</li><?php #.col--$this->each
					} ?>
					
				</ul><?php #.nav
			}
			
			return ob_get_clean();
		}
	
	}
?>
