(function(_){
	_.array = {
		count : function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		 
		    return size;
		},
		del : function(ary,val,key){
			if(!ary){
				return false;
			}
			
			for(var i in ary){
				if(ary.hasOwnProperty(i)){
					if(
						(key && (i == val)) ||
						(!key && (ary[i] == val))
					){
						ary.splice(i,1);
					}
				}
			}
			
			return ary;
		}
	};
})(_);