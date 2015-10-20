/* nimbus/lib/js - core javascript functions/libraries required for framework
	nimbus (c) 2009+ numonium //c - all rights reserved */

function hide(id){
	var ele;
	if(typeof id === 'string'){
		if(document.getElementById(id))
			ele=document.getElementById(id);
//	alert("id: "+ele.id);
	}else if(id){ //passed an element
		ele=id;
	}
	if(ele)
		ele.style.display="none";
}

function show(id){
	var ele;
	if(typeof id === 'string'){
		if(document.getElementById(id))
			ele=document.getElementById(id);
	}else if(id){ //passed an element
		ele=id;
	}
	
	if(ele)
		ele.style.display="block";
}

function invisible(id){
	if(document.getElementById(id))
		document.getElementById(id).style.visibility="hidden";
}

function visible(id){
	if(document.getElementById(id))
		document.getElementById(id).style.visibility="visible";
}

function link(loc){
	window.location.href=loc;
}

function clearField(ele){
	if(ele.value)
		ele.value='';
}

function getSelectIndex(ele,val){
	//gets index from HTML select by its value. returns first finding
	for(var i=0; i<ele.length; i++){
		if(ele.options[i].value==val)
			return i;
	}
	return -1; //not found
}

function newOption(text,val){
	var newOpt=document.createElement("option");
	newOpt.text=text;
	newOpt.value=val;
	return newOpt;
}

function appendOption(select,newOpt){
	try{
		select.add(newOpt,null); //standards compliant; no IE :(
	}catch(ex){
		select.add(newOpt); //screw you, IE!
	}
}

function containsOption(options,obj,attr){
	if(!attr)
		attr="text";
	var i=options.length;
	while(i--){
		if(attr=="text" && options[i].text===obj){
			return true;
		}else if(attr=="value" && options[i].value===obj){
			return true;
		}
	}
	return false;
}

function getClickedLink(e){
	if(!e)
		var e=window.event;
//	alert(window.event);
	var targ=e.target || e.srcElement;
	if(targ.nodeType==3)
		targ=targ.parentNode;
	return targ;
}

function addBefore(new_node,sibling){
	sibling.parentNode.insertBefore(new_node,sibling);
}

function addAfter(new_node,sibling){
	sibling.parentNode.insertBefore(new_node,sibling.nextSibling);
}

function encodeLocation(loc){
	loc=loc.split(',');
	var rtn="";
	for(var i=loc.length-1; i>=0; i--){
//			alert(rtn+"\n"+loc[i]);
		if(loc[i]!=""){
			rtn+=urlencode(trim(loc[i]).toLowerCase())+(i>0 ? "|" : '');
		}
	}
	return rtn;
}

function changeTitle(newTitle){
	var title=document.title.toString().split(TITLE_SEP);
	
	if(newTitle)
		newTitle=[newTitle,title[title.length-2],title[title.length-1]];
	else
		newTitle=[title[title.length-2],title[title.length-1]];
	setTitle(newTitle.join(TITLE_SEP));
}

function setTitle(title,doc){
	if(!doc)
		doc=document;
	doc.title=title;
}

function getTitle(doc){
	if(!doc)
		doc=document;
	return doc.title;
}

function removeChildren(ele){
	while (ele.hasChildNodes()){
		ele.removeChild(ele.lastChild);
	}
}

function close(ele,time,callback){
	if(!callback){
		callback=function(){
			ele.close();
		}
	}
	
	//$time is given in seconds, will be *=1000 to get msec
	setTimeout(callback,time*1000);
}

//removes all null/empty elements from array
function trim_ary(ary,rekey){
	if(!rekey){
		var ret=ary;
		for(var i in ret){
			if(ret[i]=='' || !ret[i])
				ret.splice(i,1);
		}
	}else{ //rekeys the elements to be stored sequentially
		var ret=[];
		for(var i in ary){
			if(ary[i]!='' && ary[i]!==null && ary[i])
				ret.push(ary[i])
		}
	}
	
	return ret;
}

function dump(){
	var separator="\n";
	var str=implode(separator,toArray(arguments));
	alert(str);
}

function dumpAry(){
	var str="";
	for(arg in arguments){
		str+=arg+"\n";
		for(a in arg){
			str+="\t"+a+"\n";
		}
	}
	alert(str);
}

function var_dump() {
    // Dumps a string representation of variable to output  
    // 
    // version: 906.801
    // discuss at: http://phpjs.org/functions/var_dump
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: echo
    // *     example 1: var_dump(1);
    // *     returns 1: 'int(1)'

    var output = "", pad_char = " ", pad_val = 4, lgth = 0, i = 0, d = this.window.document;
    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if(!name) {
            return '(Anonymous)';
        }
        return name[1];
    }

    var repeat_char = function (len, pad_char) {
        var str = "";
        for(var i=0; i < len; i++) {
            str += pad_char;
        }
        return str;
    }
    var getScalarVal = function (val) {
        var ret = '';
        if (val === null) {
            ret = 'NULL';
        }
        else if (typeof val === 'boolean') {
            ret = 'bool('+val+')';
        }
        else if (typeof val === 'string') {
            ret = 'string('+val.length+') "'+val+'"';
        }
        else if (typeof val === 'number') {
            if (parseFloat(val) == parseInt(val, 10)) {
                ret = 'int('+val+')';
            }
            else {
                ret = 'float('+val+')';
            }
        }
        else if (val === undefined) {
            ret = 'UNDEFINED'; // Not PHP behavior, but neither is undefined as value
        }
        else if (typeof val === 'function') {
//            ret = 'FUNCTION'; // Not PHP behavior, but neither is function as value
			ret = val.toString();
        }
        return ret;
    }

    var formatArray = function (obj, cur_depth, pad_val, pad_char) {
        var someProp = '';
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = repeat_char(pad_val*(cur_depth-1), pad_char);
        var thick_pad = repeat_char(pad_val*(cur_depth+1), pad_char);
        var str = "";
        var val='';

        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && getFuncName(obj.constructor) === 'PHPJS_Resource') {
                return obj.var_dump();
            }
            lgth = 0;
            for (someProp in obj) {
                lgth++;
            }
            str += "array("+lgth+") {\n";
            for (var key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    str += thick_pad + "["+key+"] =>\n"+thick_pad+formatArray(obj[key], cur_depth+1, pad_val, pad_char);
                } else {
                    val = getScalarVal(obj[key]);
                    str += thick_pad + "["+key+"] =>\n"+thick_pad + val + "\n";
                }
            }
            str += base_pad + "}\n";
        } else {
            str = getScalarVal(obj);
        }
        return str;
    }

    output = formatArray(arguments[0], 0, pad_val, pad_char);
    for (i=1; i < arguments.length; i++) {
        output += '\n'+formatArray(arguments[i], 0, pad_val, pad_char);
    }
    
    /*~EN: Revised to return string rather than printing */
    return output;

/*    if (d.body) {
        this.echo(output);
    }
    else {
        try {
            d = XULDocument; // We're in XUL, so appending as plain text won't work
            this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">'+output+'</pre>');
        }
        catch(e) {
            this.echo(output); // Outputting as plain text may work in some plain XML
        }
    }*/
}

function implode(glue, pieces){
	return ((pieces instanceof Array) ? pieces.join(glue) : pieces);
}

function add_json(varName,data){
	return eval('('+data+')');
}

function toArray(args){
	return Array.prototype.slice.call(args);
}

function is_array(ary){
	return (typeof(ary)==='object' && ary!== null);
}

function is_object(o){
	return (typeof(o)==='object' && o!== null);
}

function is_int(num){
	return (typeof(num)=='number' && parseInt(num)==num);
}

function includeCSS(src){
	var d=document.createElement("link");
	d.setAttribute("rel","stylesheet");
	d.setAttribute("type","text/css");
	d.setAttribute("href",src);

	var e=document.getElementsByTagName("head")[0];
	if(!e)
		return;
	e.appendChild(d);
}

function isShowing(ele){
	return (ele && ((ele.style.display.toString()!="" && ele.style.display.toString()!="none") || (ele.style.visibility.toString()!="" && ele.style.visibility.toString()!="hidden")));
}

function includeJS(src){
	var d=document.createElement("script");
	d.setAttribute("type","text/javascript");
	d.setAttribute("src",src);

	var e=document.getElementsByTagName("head")[0];
	if(!e)
		return;
	e.appendChild(d);
	
/*	window.setTimeout(function(){
			e.setTimeout(d);
	},0);*/
}

function trim(s){
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}

function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
                             
    var histogram = {}, tmp_arr = [];
    var ret = (str+'').toString();
    
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };
    
    // The histogram is identical to the one in urldecode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
    
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);
    
    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret) // Custom replace. No regexing
    }
    
    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
    
    return ret;
}


function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
                             
    var histogram = {}, tmp_arr = [];
    var ret = (str+'').toString();
    
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    }
    
    // The histogram is identical to the one in urldecode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
    
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);
    
    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret) // Custom replace. No regexing
    }
    
    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
    
    return ret;
}

function getElementsByClassName(classname,node){
	if(!node)
		node=document.getElementsByTagName('body')[0];
	var a=[];
	var re=new RegExp('\\b'+classname+'\\b');
	var els=node.getElementsByTagName('*');
	var num=0;
	var classes="";
	for(var i=0,j=els.length; i<j; i++){
		if(els[i].className!='')
			classes+=els[i].className+"\n";
		if(re.test(els[i].className)){
			num++;
			a.push(els[i]);
		}
	}
	return a;
}

function addEvent(obj,event,handler){
	if(event=='ready'){
		addReadyEvent(obj,event,handler);
	}else{
		if(obj.addEventListener){
			obj.addEventListener(event,handler,false);
		}else if(obj.attachEvent){
			obj.attachEvent('on'+event,handler);
		}
	}
}

function urlL(){
	setInterval(function(){
		if(_url && (_url!=window.location.hash)){
			_e.fireEvent(null,this,'url_change',window.location.hash);
		}
	},100);
}
//urlL();

function _regE(){
	if(!_e){
		return false;
	}
	_e.addListener(this,'url_change',function(){
		var args=trim_ary(arguments,true);
		var l=(args.length>0 ? args[0] : window.location.hash);
		$_url=url(l);
		_url=l;
	});
}
//_regE();

function isSSL(l){
	if(!l)
		l=parent.location.protocol;
	return (l.indexOf("https://")!= -1);
}

function url(l){
	if(!l)
		l=window.location.hash;
	return trim_ary(l.toString().substr(1).split("/"),true);
}

//makes a URL
function makeURL(url){
	if(!url)
		url=$_url;
		
	return "#/"+url.join("/");
}

function sameURL(url,w){
	if(!w)
		w=window;
	if(url instanceof Array){
		url=makeURL(url);
	}
	return (w.location.hash==url);
}

//commits a URL to window.location
function toURL(url,w){
	if(!sameURL(url,w))
		toLoc(makeURL(url),w);
}

function toLoc(loc,w){
	if(!w)
		w=window;
	w.location=loc;
}

function hash(h){
	if(!h)
		return window.location.hash;
		
	window.location.hash=h;
}

function echo ( ) {
    // !No description available for echo. @php.js developers: Please update the function summary text file.
    // 
    // version: 906.401
    // discuss at: http://phpjs.org/functions/echo
    // +   original by: Philip Peterson
    // +   improved by: echo is bad
    // +   improved by: Nate
    // +    revised by: Der Simon (http://innerdom.sourceforge.net/)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Eugene Bulkin (http://doubleaw.com/)
    // +   input by: JB
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
    // %        note 1: we wouldn't need any such long code (even most of the code below). See
    // %        note 1: link below for a cross-browser implementation in JavaScript. HTML5 might
    // %        note 1: possibly support DOMParser, but that is not presently a standard.
    // %        note 2: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
    // %        note 2: use with a temporary holder before appending to the DOM (as is our last resort below),
    // %        note 2: since it may not work in an XML context
    // %        note 3: Using innerHTML to directly add to the BODY is very dangerous because it will
    // %        note 3: break all pre-existing references to HTMLElements.
    // *     example 1: echo('<div><p>abc</p><p>abc</p></div>');
    // *     returns 1: undefined
    var arg = '', argc = arguments.length, argv = arguments, i = 0;
    var win = this.window;
    var d = win.document;
    var ns_xhtml = 'http://www.w3.org/1999/xhtml';
    var ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'; // If we're in a XUL context

    var holder;

    var stringToDOM = function (str, parent, ns, container) {
        var extraNSs = '';
        if (ns === ns_xul) {
            extraNSs = ' xmlns:html="'+ns_xhtml+'"';
        }
        var stringContainer = '<'+container+' xmlns="'+ns+'"'+extraNSs+'>'+str+'</'+container+'>';
        if (win.DOMImplementationLS &&
            win.DOMImplementationLS.createLSInput &&
            win.DOMImplementationLS.createLSParser) { // Follows the DOM 3 Load and Save standard, but not
            // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
            // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
            // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
            var lsInput = DOMImplementationLS.createLSInput();
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            lsInput.stringData = stringContainer;
            var lsParser = DOMImplementationLS.createLSParser(1, null); // synchronous, no schema type
            return lsParser.parse(lsInput).firstChild;
        }
        else if (win.DOMParser) {
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            return new DOMParser().parseFromString(stringContainer, 'text/xml').documentElement.firstChild;
        }
        else if (win.ActiveXObject) { // We don't bother with a holder in Explorer as it doesn't support namespaces
            var d = new ActiveXObject('MSXML2.DOMDocument');
            d.loadXML(str);
            return d.documentElement;
        }
        /*else if (win.XMLHttpRequest) { // Supposed to work in older Safari
            var req = new win.XMLHttpRequest;
            req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
            if (req.overrideMimeType) {
                req.overrideMimeType('application/xml');
            }
            req.send(null);
            return req.responseXML;
        }*/
        else { // Document fragment did not work with innerHTML, so we create a temporary element holder
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
            if (d.createElementNS &&  // Browser supports the method
                d.documentElement.namespaceURI && (d.documentElement.namespaceURI !== null || // We can use if the document is using a namespace
                d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
                (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
            )) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
                holder = d.createElementNS(ns, container);
            }
            else {
                holder = d.createElement(container); // Document fragment did not work with innerHTML
            }
            holder.innerHTML = str;
            while (holder.firstChild) {
                parent.appendChild(holder.firstChild);
            }
            return false;
        }
        // throw 'Your browser does not support DOM parsing as required by echo()';
    }


    var ieFix = function (node) {
        if (node.nodeType === 1) {
            var newNode = d.createElement(node.nodeName);
            var i, len;
            if (node.attributes && node.attributes.length > 0) {
                for (i = 0, len = node.attributes.length; i < len; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    newNode.appendChild(ieFix(node.childNodes[i]));
                }
            }
            return newNode;
        }
        else {
            return d.createTextNode(node.nodeValue);
        }
    }

    for (i = 0; i < argc; i++ ) {
        arg = argv[i];
        if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.echo_embedded_vars']) {
            arg = arg.replace(/(.?)\{\$(.*?)\}/g, function (s, m1, m2) { 
                // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
                // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
                if (m1 !== '\\') {
                    return m1+eval(m2);
                }
                else {
                    return s;
                }
            });
        }
        if (d.appendChild) {
            if (d.body) {
                if (win.navigator.appName == 'Microsoft Internet Explorer') { // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
                    d.body.appendChild(ieFix(stringToDOM(arg)));
                }
                else {
                    var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div').cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
                    if (unappendedLeft) {
                        d.body.appendChild(unappendedLeft);
                    }
                }
            } else {
                d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description')); // We will not actually append the description tag (just using for providing XUL namespace by default)
            }
        } else if (d.write) {
            d.write(arg);
        }/* else { // This could recurse if we ever add print!
            print(arg);
        }*/
    }
}

/*function $(id){
	return document.getElementById(id);
}*/

function getIndex(needle,haystack){
	for(var i=0; i<haystack.length; i++){
		if(haystack[i]==needle)
			return i;
	}
	return -1;
}

function array_map(callback) {
    var argc = arguments.length, argv = arguments;
    var j = argv[1].length, i = 0, k = 1, m = 0;
    var tmp = [], tmp_ar = [];

    while (i < j) {
        while (k < argc){
            tmp[m++] = argv[k++][i];
        }

        m = 0;
        k = 1;

        if (callback){
            if (typeof callback === 'string') {
                callback = this.window[callback];
            }
            tmp_ar[i++] = callback.apply(null, tmp);
        } else {
            tmp_ar[i++] = tmp;
        }

        tmp = [];
    }

    return tmp_ar;
}

function in_array(needle, haystack, argStrict){
	//argStrict ~ strict comparison between elements
 
    var key = '', strict = !!argStrict;
 
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
 
    return false;
}

function defined(obj){
	return (typeof(obj)!="undefined" && obj!="undefined");
}

/*
//Array.contains() ? true : false
Array.prototype.contains=function(obj){
	var i=this.length;
	while(i--){
		if(this[i]===obj)
			return true;
	}
	return false;
} */