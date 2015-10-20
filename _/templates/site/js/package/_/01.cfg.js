(function($, _){


	_.cfg = {
		img : {
			preview : {
				width: 256,
				height: 456
			},
			upload : {
				width : 1920,
				height : 1080
			}
		},
		nav : {
			filter : {
				q : {
					min_length : 0
				}
			}
		},
		title : document.title,
		wysiwyg : {
			options : {
				autoresize : false,
				buttonsAdd : ['clips'],
				buttonsAdd_content : ['_save','_cancel','clips'],
				resize : false,
				imageUpload : '/admin/save?img',
				imageUploadCallback : function(obj, json){
					_.log('@ wysiwyg img[upload]',obj,json,this);
				},
				keyupCallback : function(obj, e){
					var doc = (obj.$frame ? _.frame.doc(obj.$frame[0]) : document);
					var sel = doc.getSelection();
					
					_.log('@ wysiwyg key '+_.get.key(e.keyCode),sel, sel.getRangeAt(0),e);	
					
					var ele = (sel.anchorNode.tagName ? sel.anchorNode : sel.anchorNode.parentNode);
					var tag = (sel.anchorNode.tagName ? sel.anchorNode.tagName : sel.anchorNode.parentNode.tagName);
					var previous_sibling = ele.previousElementSibling || ele.previousSibling;
					var sibling = ele.nextElementSibling || ele.nextSibling;
					
					_.page.title($(doc).find('h1').text());
					
					_.log('!!!',document.title);
				},
				keydownCallback : function(obj, e){
					
					var doc = (obj.$frame ? _.frame.doc(obj.$frame[0]) : document);
					var sel = doc.getSelection();
					
					var ele = (sel.anchorNode.tagName ? sel.anchorNode : sel.anchorNode.parentNode);
					var tag = (sel.anchorNode.tagName ? sel.anchorNode.tagName : sel.anchorNode.parentNode.tagName);
					var previous_sibling = ele.previousElementSibling || ele.previousSibling || false;
					var sibling = ele.nextElementSibling || ele.nextSibling;
					
					_.log('@ wysiwyg key '+_.get.key(e.keyCode),ele,sel.getRangeAt(0),e);
										
					switch(e.keyCode){
						case _.key.keys.backspace:						
							if(sel.anchorOffset == 0 && previous_sibling.tagName.toLowerCase() == 'h1'){
								_.log('@ wysiwyg block +');
								_.key._blocked = true;
							}
							
							break;
						
						case _.key.keys.del:
							if(sel.anchorOffset == sel.anchorNode.textContent.length && ele.tagName.toLowerCase() == 'h1'){
								var next_content = _.str.trim($(sibling).html());
								
								if(!_.array.isin(next_content,['','<br>','<br />'])){
									_.log('@ wysiwyg block +');
									_.key._blocked = true;
								}
							}
							
							break;
						
						case _.key.keys.enter:
							if(ele.tagName.toLowerCase() == 'h1'){
								_.log('@ wysiwyg block +');
								_.key._blocked = true;
							}
						

						break;
						
					}
					
				},
				plugins : ['clips']
			}
		}	
		
	};
	
})(jQuery,_);