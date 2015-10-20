(function(_){

	// key bindings
	_.key = {
		_blocked : false,
		is : function(e,name){
			if(!name){
				return false;
			}
			
			return (_.key.keys[name] && e.keyCode && (_.key.keys[name] == e.keyCode));
	
		},
		is_meta : function(key){
			return key && (
				(key == _.key.keys.ctrl) ||
				(key == _.key.keys.shift) ||
				(key == _.key.keys.alt) ||
				(key == _.key.keys.up) ||
				(key == _.key.keys.down) ||
				(key == _.key.keys.left) ||
				(key == _.key.keys.right) ||
				(key == _.key.keys.apple) ||
				(key == _.key.keys.meta) ||
				(key == _.key.keys.win) ||
				(key == _.key.keys.fn) ||
				(key == _.key.keys.esc)
			);
		},
		keys : {
	//		strg : 17,
			ctrl : 17,
			ctrl_right : 18,
			ctrl_r : 18,
			shift : 16,
			enter : 13,
			backspace : 8,
			bcksp : 8,
			alt : 18,
			alt_r : 17,
			alt_right : 17,
			space : 32,
			apple : 224,
			cmd : 224,
			command : 224,
			mac : 224,
			meta : 224,
			win : 224,
			fn : null,
			up : 38,
			down : 40,
			left : 37,
			right : 39,
			esc : 27,
			del : 46,
			f1: 112,
			f2: 113,
			f3: 114,
			f4: 115,
			f5: 116,
			f6: 117,
			f7: 118,
			f8: 119,
			f9: 120,
			f10: 121,
			f11: 122,
			f12: 123
		}
	};
	
})(_);