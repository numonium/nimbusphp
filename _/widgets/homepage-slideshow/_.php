<?php
	/* juniper/lib/widget/homepage-slideshow - init script for widget "homepage slideshow"
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/
	
	global $_;
	
	$this->name = 'Homepage Slideshow';

	$gallery = new _Gallery(array(FETCH_FROM_DB => true, 'slug' => 'homepage-slideshow', 'site-uuid' => $_['site']->uuid));	
	$gallery->set_page(&$this);
	
	$cover_photo=$this->has_image('/site/img/cover-photo');
	$empty = ( _User::logged_in() && (
		empty($gallery->id) || !count($gallery->images)
	));;
	
/*

	<div id="homepage-slideshow" class="gallery">
		<?php
			$gallery=new Gallery('homepage-slideshow');
			$gallery->slideshow('#homepage-slideshow','lg');
		?>
	</div><?php #homepage-slideshow ?>
*/	
?>
<div id="<?php echo $gallery->uuid; ?>" class="_-gallery _-widget--homepage-slideshow"><?php
#	if(_User::logged_in() && $pane = $_['site']->template->has_view('admin-pane')){
		if($gallery->found && _is_array($gallery->images)){
			
			$gallery->slideshow('#'.$gallery->uuid,'lg');

/*			$i=0;
			foreach($gallery->images as $ikey => $image){
				echo new _HTML(array(
					'tag' => 'img',
					'attrs' => array(
						'id'	=> '_-img--gallery--'.$i,
						'class'	=> '_-img--gallery',
						'name'	=> 'img--'.($i+1),
						'src'	=> _dir('/site'.$gallery->dir['lg'].'/'.basename($image->file))
					)
				));
				
				$i++;
			}*/
			
			if(_User::logged_in()){ ?>
			
				<a class="_-button--admin _-button _-button--edit _-lightbox" rel="lightbox" href="/admin/galleries/edit/<?php echo $gallery->id; ?>/<?php echo $gallery->slug; ?>?embed"><span class="text">Edit this Gallery</span></a><?php
				
			}
		
		}else if($cover_photo){ ?>
		
			<div class="_-widget--homepage-slideshow--images<?php echo ($empty ? ' empty' : ''); ?>"<?php		
				$img=new _Image(array('file' => _dir($_['site']->dir['/'].'/img/'.$cover_photo)));
		
			 ?> style="background-image: url('/site/img/<?php echo $cover_photo; ?>'); width:<?php echo $img->width; ?>px; height:<?php echo $img->height; ?>px"></div><?php
		}

	if($empty){ ?>
		
		<p>Your slideshow contains no images. You should <a class="_-lightbox" rel="lightbox" href="/admin/galleries/edit/<?php echo $gallery->id; ?>/<?php echo $gallery->slug; ?>?embed" onclick="<?php /* some method to upload via ajax */ ?>" title="Administration &raquo; Photo Galleries &raquo; Homepage Slideshow &raquo; Edit">upload some</a>.</p><?php
		
	} ?>
		
</div><?php #.-gallery._-widget--homepage-slideshow ?>