<?php
	/* juniper/lib/model - basic model (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Vacation extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter
		var $loc = array('lat' => '', 'lng' => '');
		var $city = array();
		var $airport;
		var $rate;
		var $override = array();

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			if(!empty($this->itin) && is_string($this->itin)){
				$this->itin = unserialize($this->itin);
			}
			
			if(!empty($this->img) && is_array($this->img) && !empty($this->img['_'])){
				
				$img = new _Image(array(
					'file'	=> str_replace('/site/', $_['site']->dir['/'].'/', $this->img['_'])
				));
				
				if(!empty($this->img['thumb'])){
				
					$img->thumb = new _Image(array(
						'file'	=> str_replace('/site/', $_['site']->dir['/'].'/', $this->img['thumb'])
					));
					
				}
				
				$this->_img = $this->img;
				$this->img = $img;
				unset($img);

			}
			
			if(!empty($this->cat)){
				if(!empty($this->cat['uuid'])){
					$this->_cat = $this->cat;
					$this->cat = new _Cat(array(
						FETCH_FROM_DB	=> true,
						'uuid'	=> $this->cat['uuid']
					));
				}else if(!empty($this->cat['id'])){
					$this->_cat = $this->cat;
					$this->cat = new _Cat(array(
						FETCH_FROM_DB	=> true,
						'id'	=> $this->cat['id']
					));					
				}
			}else{
				
			}
			
			$this->remove_from_db(array('presenter','tbl','_img'));
		}

		function __get($var){
			return parent::__get($var);
		}
		
		public static function all($args=array()){
			global $_;
			
			$json = (!empty($args) && !empty($args['json']));
			$ret = array();
			$types = array();
			
			$vacs = $show_all = false;
			
			$_['http']->header('mem');

			if(!empty($args) && !empty($args['q'])){
				$show_all = true;

				$q = "select * from vacations where lower(name) like '%" . strtolower($args['q']) . "%' order by name asc";
				
				if(!($vacations = $_['db']->fetch($_['db']->q($q)))){
					return false;
				}

				$vacs = $vacations;
				
				// foreach($vacations as $lkey => $vacation) {
				// 	$vacs[] = new _Vacation($vacation);
				// }				
			}else if(!empty($args['type']) && ($args['type'] == 'active')){

				$vacs = array();
				if($tmp = $_['db']->getAll('vacations', array('hidden' => 0))){
					foreach($tmp as $vkey => &$vac){
						$vacs[$vac['uuid']] = $vac;
					}
					unset($tmp);
				}
				
				if(
					(!empty($args['station']) && is_object($args['station'])) && 
					($vacs_station = $_['db']->getAll('stations-vacations',"`station-uuid` = '" . $args['station']->uuid ."' and (`hide` is null or `hide` = '0' or `show` = '1')")) && !empty($vacs)
				){

					foreach($vacs_station as $vskey => $vac){
						$vacs[$vac['vacation']['uuid']] = new _Vacation(array(
							FETCH_FROM_DB	=> true,
							'uuid'	=> $vac['vacation']['uuid']
						));
					}

				}
				
				
			}else if(!empty($args['type']) && ($args['type'] == 'unregistered') && !empty($args['station']) && is_object($args['station'])){
				if(!($orders = $_['db']->getAll('orders',array(
					'station-uuid'	=> $args['station']->uuid,
					'registered'	=> 0
				)))){
					return false;
				}
				
				$vacs = array();
				foreach($orders as $okey => $order){
					if(!empty($order['vacation']['uuid'])){
						$vac = new _Vacation(array(
							FETCH_FROM_DB => true,
							'uuid'	=> $order['vacation']['uuid']
						));
						
						$vac->order = new _Order($order);
						
						if(!empty($args['expand'])){
							$vacs[] = $vac;
						}else{
							$vacs[$order['vacation']['uuid']] = $vac;
						}
					}
				}
			}else if(!empty($args['type']) && ($args['type'] == 'registered') && !empty($args['station']) && is_object($args['station'])){
				
				if(!($orders = $_['db']->getAll('orders',"`station-uuid` = '" . $args['station']->uuid . "' and `registered` > 0"))){
					return false;
				}
				
				$vacs = array();
				foreach($orders as $okey => $order){
					if(!empty($order['vacation']['uuid'])){
						$vac = new _Vacation(array(
							FETCH_FROM_DB => true,
							'uuid'	=> $order['vacation']['uuid']
						));
						
						$vac->order = new _Order($order);
						
						if(!empty($args['expand'])){
							$vacs[] = $vac;
						}else{
							$vacs[$order['vacation']['uuid']] = $vac;
						}
					}
				}
			}else{
			
				if(!empty($args['cat']) || !empty($args['cat-uuid'])){
					if(!empty($args['cat-uuid'])){
						$vacs = $_['db']->getAll('vacations', array('cat-uuid' => $args['cat-uuid']));
					}else if($args['cat'] == 'featured'){
						$vacs = $_['db']->getAll('vacations', array('featured' => 1));
					}else{
						if($cat = $_['db']->getSingle('cats',array('slug' => $args['cat']))){
							$vacs = $_['db']->getAll('vacations', array('cat-uuid' => $cat['uuid']));
						}
					}
				}else if(!empty($args['type'])){
					$vacs = $_['db']->getAll('vacations',array('type' => $args['type']));
				}else{
					$vacs = $_['db']->getAll('vacations');
				}
				
				$_['http']->header('mem');
				
				$extra = array(
					'cruises'	=> array(),
					'misc'	=> array()
				);
			}
			
			if(!empty($vacs)){
				
				foreach($vacs as $vkey => $vac){
					
					if(!is_object($vac) && (!$show_all && !empty($vac['hidden'])) && (empty($args) || empty($args['*']))){
						continue;
					}
					
					if(!empty($args['city']) && !is_object($vac) && !empty($vac['city']['slug'])){
						
						if($args['city'] == $vac['city']['slug']){					
#							$ret[] = ($json ? $vac : new _Vacation($vac));
							$ret[] = ($json ? $vac : new _Vacation($vac));
						}
					}else if(!empty($args['group'])){
						if($args['group'] == 'cat'){
							if($vac['type'] == 'cruise'){
								$extra['cruises'][] = new _Vacation($vac);
							}else if(!empty($vac['cat']['uuid'])){
								$cat = new _Cat(array(
									FETCH_FROM_DB	=> true,
									'uuid'		=> $vac['cat']['uuid']
								));
								
								$ret[$cat->uuid][] = new _Vacation($vac);
							}else if(!empty($vac['cat']['id'])){
								$cat = new _Cat(array(
									FETCH_FROM_DB	=> true,
									'id'		=> $vac['cat']['id']
								));		
								
								$ret[$cat->uuid][] = new _Vacation($vac);
							}else{
								$extra['misc'][] = new _Vacation($vac);
							}
						}else if($args['group'] == 'city'){
							$ret[$vac['city']['name']][] = $vac;
							
							if(!empty($vac['type'])){
								if(!isset($types[$vac['city']['name']][$vac['type']])){
									$types[$vac['city']['name']][$vac['type']] = 1;
								}else{
									$types[$vac['city']['name']][$vac['type']]++;
								}
							}

							
						}
					}else{
						$ret[$vkey] = ($json ? $vac : (is_object($vac) ? $vac : new _Vacation(array(FETCH_FROM_DB => true, 'uuid' => $vac['uuid']))));
					}
				}
				
				if(!empty($extra)){
					foreach($extra as $ekey => $e){
						if(!empty($e)){
							$ret[$ekey] = $e;
						}
					}				
				}
			}
						
			if(empty($ret)){
				return false;
			}
			
			if(!empty($args['group'])){
				
				foreach($ret as $rkey => &$rgroup){
					uasort($rgroup,'cmp_obj_alpha');
				}

				
			}else{
				uasort($ret,'cmp_obj_alpha');
			}
			
			if(!empty($args['group'])){
				foreach($ret as $rkey => &$r){
					
					if(!isset($r['_'])){
						$r['_'] = array(
							'len'	=> count($r),
							'loc'	=> (is_object($r[0]) ? $r[0]->loc : $r[0]['loc']), // all cities should have the same location
							'slug'	=> (is_object($r[0]) ? $r[0]->city['slug'] : $r[0]['city']['slug']),
							'types'	=> (!empty($types[$rkey]) ? $types[$rkey] : false)
						);
					}
				}
			}
			
			if(!empty($json)){
				return json_encode($ret);
			}
			
			return $ret;
		}
		
		public static function all_cats($args=array()){
			global $_;
			
			$json = (!empty($args) && !empty($args['json']));
			$ret = array();

			if($cats = $_['db']->getAll('cats',array('type' => 'vacation'))){
				
				if(empty($args['fill'])){
					return $cats;
				}
				
				foreach($cats as $tkey => $cat){
				
					if($vacs = $_['db']->getAll('vacations',array('cat-uuid' => $cat['uuid']))){
						
						foreach($vacs as $vkey => $vac){
							
							$ret[$cat['uuid']][$vac['uuid']] = new _Vacation($vac);

						}
						
					}			
					
				}
			}
			
			return (!empty($ret) ? $ret : false);
		}
		
		function delete(){
			global $_;
			
			if(!empty($this->img)){
				if(!empty($this->img->thumb) && !empty($this->img->thumb->src) && file_exists($this->img->thumb->src)){
					unlink($this->img->thumb->src);
					$this->img->thumb = null;
				}
				
				if(!empty($this->img->src) && file_exists($this->img->src)){
					unlink($this->img->src);
					$this->img = null;
				}
			}
			
			return parent::delete();
		}
		
		function get_city_slug(){
			if(!empty($this->city['slug'])){
				return $this->city['slug'];
			}else if(!empty($this->city['name'])){
				return $this->city_slug($this->city['name']);
			}else{
				return false;
			}
		}
	
		public static function city_slug($city=''){
			
			if(empty($city)){
				return false;
			}
			
			$strip = array(', united states');
			
			foreach($strip as $s){
				if(stripos($city,$s) !== false){
					$city = stristr($city, $s,true);
				}
			}
			
			return slug($city);

		}
		
		function get_link($rel=1){
			global $_;
			
			if(empty($this->slug)){
				return false;
			}
			
			return (
				(empty($rel) ? 'http'.(!empty($_SERVER['HTTPS']) ? 's' : '').'://'.$_['server']['http-host'] : '') . '/' .
				$_['db']->getTableName($this) . '/' .
				'view/' .
				$this->get_city_slug() . '/' .
				$this->slug
			);
			
		}
		
		# ~EN (2015): v2 linking - vacations - generate "ref" variable to pass to external server
		function ref($pack=false, $extra = array()){
			global $_;
		
			$ret = array(
				'link'	=> array(
					'id'	=> (!empty($this->link['id']) ? $this->link['id'] : ''),
					'field'	=> (!empty($this->link['field']) ? $this->link['field'] : ''),
					'url'	=> $this->link['url']
				),
				'id'	=> $this->id,
				'uuid'	=> $this->uuid,
				'name'	=> $this->name,
				'slug'	=> $this->slug,
				'rate'	=> $this->rate,
				'redir'	=> $_['const']['link']['old']['admin']['order']
			);
			
			if(!empty($extra) && is_array($extra)){
				$ret = array_merge($ret,$extra);
			}
			
			if(!empty($pack)){
				$ret = urlencode(base64_encode(serialize($ret)));
			}
			
			return $ret;
				
		}
		
		function save($args=''){
			global $_;

			$dir = $_['site']->dir['/+'].'/';			
			$dir_rel = $_['site']->dir['.+'].'/';
			
			# ~EN (2015): load up attrs to restore into object after save, since we have to mess with stuff to get it into the db
			$restore = array();

			if(!empty($this->itin) && is_array($this->itin)){
				$restore['itin'] = $this->itin;
				$this->itin = serialize($this->itin);
			}
			
			if(!empty($this->override)){
				$restore['override'] = $this->override;
				unset($this->override);
			}
			
			if(!empty($this->order)){
				$restore['order'] = $this->order;
				unset($this->order);
			}
			
			if(!empty($this->img) && is_object($this->img)){
				if(!empty($this->img->upload)){

					$img = $this->slug.strstr($this->uuid,'--');
					$thumb = '-thumb';
					$ext = '.'.$this->img->mime->ext;
									
					$files = array(
						'_'	=> $dir.$img.$ext,
						'thumb'	=> $dir.$img.$thumb.$ext,
						'rel'	=> array(
							'_'	=> $dir_rel.$img.$ext,
							'thumb'	=> $dir_rel.$img.$thumb.$ext,						
						)
					);
					
					$this->img->thumb = $this->img;
					
					$this->img->resize();
					$this->img->save($files['_']);
					$this->img->thumb->resize($this->img->cfg['pics']['thumb']['width'],$this->img->cfg['pics']['thumb']['height']);
					$this->img->thumb->save($files['thumb']);
					
					$restore['img'] = $this->img;
					
					$this->img = $files['rel'];
				}else if(!empty($this->_img)){
					$restore['img'] = $this->img;
					$this->img = $this->_img;
				}else{
					$restore['img'] = $this->img;
					unset($this->img);
				}
			}
			
			$ret = parent::save($args);
			
			foreach($restore as $rkey => $rest){
				$this->$rkey = $rest;
			}
			
			return $ret;
		}
	
	}
?>
