<?php 
	/* juniper/lib/lang: global language functions, required for framework.
		* functions must be language-agnostic *
		juniper + nimbus (c) 2010+ numonium //c - all rights reserved */
		
	if(!empty($_['env']['lang'])){
		require_once('lang.'.$_['env']['lang'].'.php');
	}
?>