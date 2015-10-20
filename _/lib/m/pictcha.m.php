<?php
	/* juniper/lib/m/validator/pictcha - validation for data types (or form data)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/
	
	class _Pictcha extends _Validator {
		var $cfg;
		var $dir;
		var $format = 'png';
		var $img;
		var $js;
		var $keys;
		var $_pick;
		var $_pick2;
		var $size = 64;
		
		function __construct($data='',$force_init=true){
			global $_;
			
			parent::__construct($data,$force_init);
			
			if(empty($this->cfg) && !empty($_['cfg']['pictcha'])){
				$this->cfg = $_['cfg']['pictcha'];
			}
			
			if(empty($this->dir) && !empty($this->cfg['dir'])){
				$this->dir = &$this->cfg['dir'];
			}
			
			if(empty($this->dir['img']) && !empty($this->dir)){
				$this->dir['img'] = _dir($this->dir['.'].'/img');
			}
			
			if(empty($this->dir['css']) && !empty($this->dir)){
				$this->dir['css'] = _dir($this->dir['.'].'/css');
			}
			
			if(empty($this->dir['js']) && !empty($this->dir)){
				$this->dir['js'] = _dir($this->dir['.'].'/js');
			}
			
			if(empty($this->format) && !empty($this->cfg['format'])){
				$this->format = &$this->cfg['format'];
			}
			
			if(empty($this->img) && !empty($this->cfg['img'])){
				$this->img = &$this->cfg['img'];
			}
			
			if(empty($this->keys) && !empty($this->cfg['keys'])){
				$this->keys = &$this->cfg['keys'];
			}
			
			if(empty($this->size) && !empty($this->cfg['size'])){
				$this->size = &$this->cfg['size'];
			}
			
		}
		
		function attach(&$page){
			global $_;
			
			if(empty($page) || !is_object($page)){
				return false;
			}
			
			$page->add_css(array('pictcha' => _dir($this->cfg['dir']['.'].'/css/_.css')));
			$page->add_js(array('pictcha' => _dir($this->cfg['dir']['.'].'/js/_.js')));
			
			return true;
			
			// please work! :)
		}
		
		function pick(){
			global $_;

			$ary = false;
			
			do{
				$ary = array(
					'key'	=> array_rand($this->keys),
					'rand'	=> array_shuffle($this->img)
				);
			
			}while(empty($ary) || ($ary['key'] == array_first(array_keys($ary['rand']))) || ($ary['key'] == array_last(array_keys($ary['rand']))));
			
			return $ary;
			
		}
		
		function prompt(){
			global $_;
			
			if(empty($this->_pick)){
				$this->_pick = $this->pick();
				$this->_pick2 = $this->pick();
			}
			
			ob_start(); ?>
			
			<div class="_-pictcha--wrapper _-pictcha--prompt<?php echo ($this->_valid === false ? ' _-error' : ''); ?>">
				<div class="_-pictcha">
					<h4 class="<?php echo ($this->_valid === false ? ' _-error' : ''); ?>">Please select the <strong><?php echo $this->_pick['rand'][$this->_pick['key']]; ?></strong> to submit</h4>
				</div><?php #._-pictcha ?>
				<div class="_-pictcha _-pictcha--alt _-js--alt<?php echo ($this->_valid === false ? ' _-error' : ''); ?>"><?php /*
					<h4>This is a(n):</h4> */ ?>
					<h4 class="<?php echo ($this->_valid === false ? ' _-error' : ''); ?>">Anti-Spam &mdash; Please select the <strong><?php echo $this->_pick2['rand'][$this->_pick2['key']]; ?></strong></h4>
				</div><?php #._-pictcha--alt ?>
			</div><?php #._-pictcha--wrapper
				
				
			return ob_get_clean();

		}
		
		function body(){
			global $_;
			
			if(empty($this->_pick)){
				$this->_pick = $this->pick();
				$this->_pick2 = $this->pick();
			}
			
			ob_start(); ?>
						
			<div class="_-pictcha--wrapper _-pictcha--body<?php echo ($this->_valid === false ? ' _-error' : ''); ?>">
				<input type="hidden" name="pictcha[key]" value="<?php echo $this->_pick['key']; ?>" />
				<input type="hidden" name="pictcha[key2]" value="<?php echo $this->_pick2['key']; ?>" />	    				
				<div class="_-pictcha">
    				<input id="_-pictcha--field--select" type="hidden" name="pictcha[select]" value="" />
    				
    				<ul class="_-pictcha--select"><?php
    				
    					foreach($this->_pick['rand'] as $ikey => $img){ ?>
    					
    						<li class="_-pictcha--select--img"><a href="javascript:;" onclick="_.mod.pictcha.select(this)"><img data-src="<?php echo _dir('/img/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']); ?>" src="<?php echo _Image::data_uri(_dir($this->cfg['dir']['/'].'/img/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format'])); #echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']; ?>" width="80%" alt="" valign="middle" /></a></li><?php
	    					
    					} ?>
    				
    				</ul>
				</div><?php #._-pictcha ?>
				<div class="_-pictcha _-pictcha--alt _-js--alt<?php echo ($this->_valid === false ? ' _-error' : ''); ?>"><?php 
				
				/*
					<div class="_-pictcha--select--img">
						<a href="javascript:;"><img src="<?php echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$this->_pick2['key']].'.'.$this->cfg['format']; ?>" alt="" /></a><br />
						<select name="pictcha[select2]" placeholder="Please Select..." required>
							<option value=""></option><?php
						
	    					foreach($this->_pick2['rand'] as $ikey => $img){ ?>
	    					
	    						<option value="<?php echo $img; ?>"><?php echo ucwords($img); ?></option><?php
	    						
	    					} ?>
						
						</select>
					</div><?php #._-pictcha--select--img */ ?>
					
    				<ul class="_-pictcha--select"><?php
    				
    					foreach($this->_pick['rand'] as $ikey => $img){ ?>
    					
    						<li class="_-pictcha--select--img">
	    						<![if !IE]>
	    							<label>
	    								<input type="radio" name="pictcha[select]" value="<?php echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']; ?>" />
	    								<span class="a"><img src="<?php echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']; ?>" alt="" /></span>
	    							</label>
	    						<![endif]>
	    						<!--[if lte IE 8]>

	    							<label style="background-image:url('<?php echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']; ?>');">
	    								<input type="radio" name="pictcha[select]" value="<?php echo $this->cfg['dir']['img'].'/'.$this->cfg['keys'][$ikey].'.'.$this->cfg['format']; ?>" />
	    							</label>
	    							
	    						<![endif]-->

    						</li><?php
	    					
    					} ?>
    				
    				</ul>

				</div><?php #._-pictcha.._-pictcha--alt ?>
				<script type="text/javascript">
					(function($){
						$('._-pictcha--alt').remove();
					})(jQuery);
				</script>
			</div><?php #._-pictcha--wrapper
			
			return ob_get_clean();
		}
		
		function validate($data='',&$form,&$results=array()){
			global $_;
			
			$validator = 'pictcha';
			
			if(!empty($form->data)){
				$data = $form->data;
			}
			
			$ret = true;
			
			if(empty($data) || !is_array($data) || !count($data)){
				return false;
			}
			
			if(!empty($data[$validator])){
				$data = $data[$validator];
			}
			
			if(empty($data) || (empty($data['select']) && empty($data['select2']))){
				$ret = false;
			}
			
			if(!empty($data['select2'])){ // alt select -> no js
				if(
					(empty($data['key2'])) || 
					($data['select2'] != $this->cfg['img'][$data['key2']])
				){
					$ret = false;
				}
			}else{
			
				$pictcha_index = explode('.',basename($data['select']));
				unset($pictcha_index[count($pictcha_index)-1]);
				$pictcha_index = implode('.',$pictcha_index);
				
				if(
					!(is_numeric($this->cfg['keys'][$data['key']]) && (intval($pictcha_index) == $this->cfg['keys'][$data['key']])) &&
					!(!is_numeric($this->cfg['keys'][$data['key']]) && ($pictcha_index == $this->cfg['keys'][$data['key']]))
				){
					$ret = false;
				}
				
			}
			
			if(empty($ret)){
				$result = array();
				
				$this->_valid=false;
				
				$result['err'][] = $validator;			
				$result['v'][$validator] = $ret;
				$results['_err'][$validator] = &$result;
			}
			
			return $ret;
		}
	}
	
	_cfg('pictcha', array(
		'dir'	=> array(
			'.'	=> '/mod/pictcha',
			'/' => _dir($_['.'].'/mod/pictcha')
		),
		'format'	=> 'png',
		'img'	=> array(
			'jRWqhTwe7WYZR7QfDpacMdhW32uxXZ8MrDnbmBCTLizTosKbpOxXT6QKE10LOy2'	=> 'star',
			'3785F1AB6F9269E2761DAAD086D52BBEA8217B1469B9F555793B1D76E4C2055C'	=> 'square',
			'cv90K3Gp82rLUHYI72eRiI9PzJHUDWcOY0wCoXRJCSQgDEL7w2mr9Ru9TDx7qaV'	=> 'circle',
			'p7EksPnPH1l8uEG9YGHSH04X334Xp0G018X6NRxStYcaC4tWLnnWKchFuyTWH7i'	=> 'triangle',
			'8D3097779BDE9028107E653334B3F251D2DD716B6682F59026E06C7BD4AC08FF'	=> 'pentagon'
		),
		'keys'	=> array(
			'jRWqhTwe7WYZR7QfDpacMdhW32uxXZ8MrDnbmBCTLizTosKbpOxXT6QKE10LOy2' => 0,
			'3785F1AB6F9269E2761DAAD086D52BBEA8217B1469B9F555793B1D76E4C2055C' => 1,
			'cv90K3Gp82rLUHYI72eRiI9PzJHUDWcOY0wCoXRJCSQgDEL7w2mr9Ru9TDx7qaV' => 2,
			'p7EksPnPH1l8uEG9YGHSH04X334Xp0G018X6NRxStYcaC4tWLnnWKchFuyTWH7i' => 3,
			'8D3097779BDE9028107E653334B3F251D2DD716B6682F59026E06C7BD4AC08FF' => 4
		),
		'size'	=> 64
	));
	
	if(empty($_['cfg']['pictcha']['dir']['/'])){
		$_['cfg']['pictcha']['dir']['/'] = $_['doc-root'].$_['cfg']['pictcha']['dir']['.'];
	}
	
	if(!is_dir($_['cfg']['pictcha']['dir']['/']) || !($files = _scandir($_['cfg']['pictcha']['dir']['/']))){
		die('err[cfg][pictcha][dir] not found');
	}
?>