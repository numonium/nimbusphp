<?php
/*	if(!isset($_['get']['bg'])){ ?>
	
		<div class="_-iframe--wrapper">
			<iframe class="_-clone _-clone--main" src="<?php echo $_['url']->uri.'?bg'; ?>" allowtransparency="true" frameborder="0" width="100%" height="100%"></iframe>
		</div><?php
		
	} */
	
/*	$this->module('stopwatch',array(
		'ele' => '#stopwatch--1'
	)); */
	
	ob_start(); ?>
	
	(function($){
	
		$(document).ready(function(){
		
			_.log('ioslist[init] - TODO',$('#admin--pane ._-content._-menu'));
//			$('#admin--pane ._-content._-menu').ioslist();
			
		});
	
	})(jQuery);<?php
	
	$_['page']->add_js(array('+' => ob_get_clean()));
	
	$_['page']->module('wysiwyg'/*,array('css' => $_['page']->css)*/); ?>
	
	<div class="_-pane _-pane--main" id="admin--pane">
		<ul id="admin--pane--nav" class="_-nav">
			<li id="admin--pane--add" class="_-nav--item">
				<h2><a class="button" href="#/admin/add"><span class="_-icon"></span><span class="_-text">Add</span></a></h2>
				<div class="_-sub">
					<div class="_-sub--inner">
						<div class="_-pivot">
							<div class="_-modal _-ajax"></div>
							<div class="_-content _-menu"><?php
								if($pages = $_['site']->get_content_types()){
									$num_pages = $i = 0; ?>
		
									<div class="_-search">
										<form method="get" action="">
											<div class="q">
												<input class="input--text" type="text" name="q" value="" />
												<a class="q--clear" href="javascript:;">&bull;</a>
											</div><?php #.q ?>
										</form>
									</div><?php /*
									<div class="_-listing _-current">
										<h2>add this Page</h2> * ?>
										<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="javascript:;" loc="<?php echo $_['page']->href; ?>"><span class="icon"></span><span class="text"><?php echo $_['page']->name; ?></span></a>
									</div>*/ ?>
									<ul class="_-listing _-all"><?php /*
										<li id="admin--pane--add--<?php echo $_['page']->slug; ?>" class="_-current">
											<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="javascript:;" loc="/admin/add/<?php echo urlencode($_['page']->href); ?>"><span class="icon"></span><span class="text"><?php echo $_['page']->name; ?></span></a>
										</li><?php*/
										
										foreach($pages as $pkey=>$page){
		#									var_dump('@@@',date('Y',strtotime($page->updated)),time()+strtotime($page->updated),$page->updated);
		/*									if($page->id == $_['page']->id){
												continue;
											}*/
											
											if(!in_array($page->slug, array('admin'))){ ?>
											
												<li id="admin--pane--add--page--<?php echo $page->slug; ?>" class="<?php echo ($page->slug == 'page' ? ' _-current' : ''); ?>">
													<a class="_-page _-content_type _-content_type--<?php echo $page->slug; ?>" href="/admin/<?php echo urlencode($page->slug); ?>/add?embed" rel="lightbox">
														<span class="icon"></span>
														<span class="text _-page--name"><?php echo $page->name; ?></span>												
													</a><?php
												#	var_dump('@@@',strtotime($page->updated)); ?>
												</li><?php
												
												$num_pages++;
											}
										} ?>
										
									</ul><?php
									
		
										
								}
								#var_dump('[ page list ]','!!!',$_['site']->get_pages());
							?></div><?php #_-content ?>
							<div class="_-arrow--wrapper">
								<span class="_-arrow"></span>
							</div>
						</div><?php #._-pivot ?>
					</div><?php #._-sub--inner ?>
				</div><?php #.-sub ?>
			</li>
			<li id="admin--pane--edit" class="_-nav--item">
				<h2><a class="button" href="#/admin/edit"><span class="_-icon"></span><span class="_-text">Edit</span></a></h2>
				<div class="_-sub">
					<div class="_-sub--inner">
						<div class="_-pivot">
							<div class="_-modal _-ajax"></div>
							<div class="_-content _-menu"><?php
								$items = array();
								if($pages = $_['site']->get_pages()){
									$items['pages'] = $pages;
									unset($pages);
									
								}
								
								if($content_types = $_['site']->get_content_types()){
									$items['content-types'] = $content_types;
									unset($content_types);
								}
								
								$extra = array(
//									'look-feel' => ''
								); //extra pages
								
								
								if(!empty($items['content-types']['page'])){
									unset($items['content-types']['page']);
								}
								
								if(count($items) > 0){
									
									$num_pages = $i = 0; ?>
		
									<div class="_-search">
										<form method="get" action="">
											<div class="q">
												<input class="input--text" type="text" name="q" value="" />
												<a class="q--clear" href="javascript:;">&bull;</a>
											</div><?php #.q ?>
										</form>
									</div><?php /*
									<div class="_-listing _-current">
										<h2>Edit this Page</h2> * ?>
										<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="javascript:;" loc="<?php echo $_['page']->href; ?>"><span class="icon"></span><span class="text"><?php echo $_['page']->name; ?></span></a>
									</div>*/ ?>
									<dl class="_-listing _-all">
										<dt class="h"><h2>Current Page</h2></dt>
										<dd id="admin--pane--edit--page--<?php echo $_['page']->slug; ?>" class="_-group _-current">
											<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="#-edit"><span class="icon"></span><span class="text _-page--name"><?php echo $_['page']->name; ?></span></a>
										</dd><?php
										
										foreach($items as $ctype => $pages){ ?>
										
											<dt class="h">
												<h2><?php
													switch($ctype){
														case 'pages':
														default:
															echo ucwords(str_replace(array('-'), array(' '), $ctype));
															break;
													} ?></h2>
											</dt>
											<dd id="admin--pane--edit--page--<?php echo $_['page']->slug; ?>--<?php echo $ctype; ?>" class="_-group">
												<ul class="_-group--list"><?php
											
													foreach($pages as $pkey => $page){
													
														if($page->id == $_['page']->id || in_array($page->slug,array_keys($extra))){
															if(in_array($page->slug,array_keys($extra))){
																$extra[$page->slug] = $page;
															}
															continue;
														}
														
														if(!empty($page->nav['hidden'])){
															continue;
														}
														
														if(!in_array($page->slug, array('admin'))){ ?>
														
															<li id="admin--pane--edit--<?php echo $ctype.'--'.$page->slug; ?>" class="_-list--item _-<?php echo $ctype; ?>--item">
																<a class="_-page _-page--<?php echo $ctype.'--'.(!empty($page->_slug) ? $page->_slug : $page->slug); ?>" href="<?php echo $page->href; ?>#-edit">
																	<span class="icon"></span>
																	<span class="text _-page--name"><?php echo $page->name; ?></span><?php
					
																	if(intval(date('Y',strtotime($page->updated))) > 0){ ?>
																		
																		<span class="text updated">Last Updated: <?php echo date('d M Y @ g:i A',strtotime($page->updated)); ?></span><?php
																		
																	} ?>
																	
																</a><?php
															#	var_dump('@@@',strtotime($page->updated)); ?>
															</li><?php
															
															$num_pages++;
														}
													} ?>
													
												</ul>
											</dd><?php
											
										}
										
										if(count($extra) > 0){
											foreach($extra as $pkey => $page){
												if(empty($page) || !is_object($page)){
													continue;
												} ?>
												
													<li id="admin--pane--edit--page--<?php echo $page->slug; ?>">
														<a class="_-page _-page--<?php echo (!empty($page->_slug) ? $page->_slug : $page->slug); ?>" href="#/admin/edit/<?php echo urlencode($page->href); ?>">
															<span class="icon"></span>
															<span class="text _-page--name"><?php echo $page->name; ?></span><?php
			
															if(intval(date('Y',strtotime($page->updated))) > 0){ ?>
																
																<span class="text updated">Last Updated: <?php echo date('d M Y @ g:i A',strtotime($page->updated)); ?></span><?php
																
															} ?>
															
														</a><?php
													#	var_dump('@@@',strtotime($page->updated)); ?>
													</li><?php
												
													$num_pages++;
											}	
										}
										 ?>
										
									</dl><?php
									
		
										
								}
								#var_dump('[ page list ]','!!!',$_['site']->get_pages());
							?></div><?php #_-content ?>
							<div class="_-arrow--wrapper">
								<span class="_-arrow"></span>
							</div>
						</div><?php #.-_pivot ?>
					</div><?php #._-sub--inner ?>
				</div><?php #.-sub ?>
			</li>
			<li id="admin--pane--insert" class="_-nav--item">
				<h2><a class="button" href="#/admin/insert"><span class="_-icon"></span><span class="_-text">Insert</span></a></h2>
				<div class="_-sub">
					<div class="_-sub--inner">
						<div class="_-pivot">
							<div class="_-modal _-ajax"></div>
							<div class="_-content _-menu"><?php
								if($pages = $_['site']->get_content_types()){
									$num_pages = $i = 0; ?>
		
									<div class="_-search">
										<form method="get" action="">
											<div class="q">
												<input class="input--text" type="text" name="q" value="" />
												<a class="q--clear" href="javascript:;">&bull;</a>
											</div><?php #.q ?>
										</form>
									</div><?php /*
									<div class="_-listing _-current">
										<h2>insert this Page</h2> * ?>
										<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="javascript:;" loc="<?php echo $_['page']->href; ?>"><span class="icon"></span><span class="text"><?php echo $_['page']->name; ?></span></a>
									</div>*/ ?>
									<dl class="_-listing _-all">
										<dt class="h"><h2>Stuff</h2></dt><?php /*
										<li id="admin--pane--insert--<?php echo $_['page']->slug; ?>" class="_-current">
											<a class="_-page _-page--<?php echo (!empty($_['page']->_slug) ? $_['page']->_slug : $_['page']->slug); ?>" href="javascript:;" loc="/admin/insert/<?php echo urlencode($_['page']->href); ?>"><span class="icon"></span><span class="text"><?php echo $_['page']->name; ?></span></a>
										</li><?php*/
										
										foreach($pages as $pkey=>$page){
		#									var_dump('@@@',date('Y',strtotime($page->updated)),time()+strtotime($page->updated),$page->updated);
		/*									if($page->id == $_['page']->id){
												continue;
											}*/
											
											if(!in_array($page->slug, array('admin'))){
												if($page->slug == 'page'){
													continue; // FUTURE - embed content from another page
												} ?>
											
												<dd id="admin--pane--insert--page--<?php echo $page->slug; ?>" class="<?php echo ($page->slug == 'page' ? ' _-current' : ''); ?>">
													<a class="_-page _-content_type _-content_type--<?php echo $page->slug; ?>" href="/admin/<?php echo urlencode($page->slug); ?>/view?embed" rel="lightbox">
														<span class="icon"></span>
														<span class="text _-page--name"><?php echo $page->name; ?></span>												
													</a><?php
												#	var_dump('@@@',strtotime($page->updated)); ?>
												</dd><?php
												
												$num_pages++;
											}
										} ?>
										
									</dl><?php
									
		
										
								}
								#var_dump('[ page list ]','!!!',$_['site']->get_pages());
							?></div><?php #_-content ?>
							<div class="_-arrow--wrapper">
								<span class="_-arrow"></span>
							</div>
						</div><?php #._-pivot ?>
					</div><?php #._-sub--inner ?>
				</div><?php #.-sub ?>
			</li>
			<li id="admin--pane--admin" class="_-nav--item"><?php
				$extra = array(
					'correspondence' => new _Page(array(
						'name' => 'Correspondence',
						'title' => 'Correspondence',
						'slug'	=> 'correspondence',
						'href'	=> '/admin/admin/correspondence'
					)),
					'intelligence' => new _Page(array(
						'name' => 'Intelligence',
						'title' => 'Intelligence',
						'slug'	=> 'intel',
						'href'	=> '/admin/admin/intel'
					)),
					'seo' => new _Page(array(
						'name' => 'Search Engine Optimisation',
						'title' => 'Search Engine Optimisation',
						'slug'	=> 'seo',
						'href'	=> '/admin/admin/seo'
					))
				); ?>
				
				<h2><a class="button" href="#/admin/admin"><span class="_-icon"></span><span class="_-text">Administration</span></a></h2>
				<div class="_-sub">
					<div class="_-sub--inner">
						<div class="_-pivot">
							<div class="_-content _-menu">
								<div class="_-search">
									<form method="get" action="">
										<div class="q">
											<input class="input--text" type="text" name="q" value="" />
											<a class="q--clear" href="javascript:;">&bull;</a>
										</div><?php #.q ?>
									</form>
								</div><?php #._-search
		
								if(_is_array($extra)){ ?>
		
									<dl class="_-listing _-all"><?php
		
										foreach($extra as $pkey => $page){ ?>
			
											<li id="admin--pane--edit--page--<?php echo $page->slug; ?>">
												<a class="_-page _-page--<?php echo (!empty($page->_slug) ? $page->_slug : $page->slug); ?>" href="<?php echo $page->href; ?>?embed" rel="lightbox"><span class="icon"></span><span class="text _-page--name"><?php echo $page->name; ?></span></a>
											</li><?php
										
										} ?>
										
									</dl><?php #._-search dl
									
								} ?>
		
							</div><?php #._-content._-menu ?>
							<div class="_-arrow--wrapper">
								<span class="_-arrow"></span>
							</div><?php #._-arrow--wrapper ?>
						</div><?php #._-pivot ?>
					</div><?php #._-sub--inner ?>
				</div><?php #._-sub ?>
			</li>
			<li id="admin--pane--help" class="_-nav--item">
				<h2><a class="button" href="#/admin/help"><span class="_-icon"></span><span class="_-text">Help</span></a></h2>
			</li>
			<li id="admin--pane--log-out" class="_-nav--item">
				<h2><a class="button" href="/admin?log-out"><span class="_-icon"></span><span class="_-text">Log Out</span></a></h2>
			</li>
		</ul>
	</div>