(function(_){

	_.str = {
		css : {
			_ : {
				prefix : '_-',
				sep : '--'
			},
			input : {
				prefix : 'input'
			},
			selected : 'selected',
			wrapper : 'wrapper',
		},
		html : {
			decode : function(string, quote_style){
			  var hash_map = {},
			    symbol = '',
			    tmp_str = '',
			    entity = '';
			  tmp_str = string.toString();
			
			  if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
			    return false;
			  }
			
			  // fix &amp; problem
			  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
			  delete(hash_map['&']);
			  hash_map['&'] = '&amp;';
			
			  for (symbol in hash_map) {
			    entity = hash_map[symbol];
			    tmp_str = tmp_str.split(entity)
			      .join(symbol);
			  }
			  tmp_str = tmp_str.split('&#039;')
			    .join("'");
			
			  return tmp_str;
			},
			encode : function(string, quote_style, charset, double_encode){
			
			  var hash_map = _.str.html.get_html_translation_table('HTML_ENTITIES', quote_style),
			    symbol = '';
			  string = string == null ? '' : string + '';
			
			  if (!hash_map) {
			    return false;
			  }
			
			  if (quote_style && quote_style === 'ENT_QUOTES') {
			    hash_map["'"] = '&#039;';
			  }
			
			  if ( !! double_encode || double_encode == null) {
			    for (symbol in hash_map) {
			      if (hash_map.hasOwnProperty(symbol)) {
			        string = string.split(symbol)
			          .join(hash_map[symbol]);
			      }
			    }
			  } else {
			    string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function(ignore, text, entity) {
			      for (symbol in hash_map) {
			        if (hash_map.hasOwnProperty(symbol)) {
			          text = text.split(symbol)
			            .join(hash_map[symbol]);
			        }
			      }
			
			      return text + entity;
			    });
			  }
			
			  return string;
			},
			get_html_translation_table : function(table, quote_style) {
			    var entities = {},
			        hash_map = {},
			        decimal;
			    var constMappingTable = {},
			        constMappingQuoteStyle = {};
			    var useTable = {},
			        useQuoteStyle = {};
			
			    // Translate arguments
			    constMappingTable[0] = 'HTML_SPECIALCHARS';
			    constMappingTable[1] = 'HTML_ENTITIES';
			    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
			    constMappingQuoteStyle[2] = 'ENT_COMPAT';
			    constMappingQuoteStyle[3] = 'ENT_QUOTES';
			
			    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
			    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
			
			    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
			        throw new Error("Table: " + useTable + ' not supported');
			        // return false;
			    }
			
			    entities['38'] = '&amp;';
			    if (useTable === 'HTML_ENTITIES') {
			        entities['160'] = '&nbsp;';
			        entities['161'] = '&iexcl;';
			        entities['162'] = '&cent;';
			        entities['163'] = '&pound;';
			        entities['164'] = '&curren;';
			        entities['165'] = '&yen;';
			        entities['166'] = '&brvbar;';
			        entities['167'] = '&sect;';
			        entities['168'] = '&uml;';
			        entities['169'] = '&copy;';
			        entities['170'] = '&ordf;';
			        entities['171'] = '&laquo;';
			        entities['172'] = '&not;';
			        entities['173'] = '&shy;';
			        entities['174'] = '&reg;';
			        entities['175'] = '&macr;';
			        entities['176'] = '&deg;';
			        entities['177'] = '&plusmn;';
			        entities['178'] = '&sup2;';
			        entities['179'] = '&sup3;';
			        entities['180'] = '&acute;';
			        entities['181'] = '&micro;';
			        entities['182'] = '&para;';
			        entities['183'] = '&middot;';
			        entities['184'] = '&cedil;';
			        entities['185'] = '&sup1;';
			        entities['186'] = '&ordm;';
			        entities['187'] = '&raquo;';
			        entities['188'] = '&frac14;';
			        entities['189'] = '&frac12;';
			        entities['190'] = '&frac34;';
			        entities['191'] = '&iquest;';
			        entities['192'] = '&Agrave;';
			        entities['193'] = '&Aacute;';
			        entities['194'] = '&Acirc;';
			        entities['195'] = '&Atilde;';
			        entities['196'] = '&Auml;';
			        entities['197'] = '&Aring;';
			        entities['198'] = '&AElig;';
			        entities['199'] = '&Ccedil;';
			        entities['200'] = '&Egrave;';
			        entities['201'] = '&Eacute;';
			        entities['202'] = '&Ecirc;';
			        entities['203'] = '&Euml;';
			        entities['204'] = '&Igrave;';
			        entities['205'] = '&Iacute;';
			        entities['206'] = '&Icirc;';
			        entities['207'] = '&Iuml;';
			        entities['208'] = '&ETH;';
			        entities['209'] = '&Ntilde;';
			        entities['210'] = '&Ograve;';
			        entities['211'] = '&Oacute;';
			        entities['212'] = '&Ocirc;';
			        entities['213'] = '&Otilde;';
			        entities['214'] = '&Ouml;';
			        entities['215'] = '&times;';
			        entities['216'] = '&Oslash;';
			        entities['217'] = '&Ugrave;';
			        entities['218'] = '&Uacute;';
			        entities['219'] = '&Ucirc;';
			        entities['220'] = '&Uuml;';
			        entities['221'] = '&Yacute;';
			        entities['222'] = '&THORN;';
			        entities['223'] = '&szlig;';
			        entities['224'] = '&agrave;';
			        entities['225'] = '&aacute;';
			        entities['226'] = '&acirc;';
			        entities['227'] = '&atilde;';
			        entities['228'] = '&auml;';
			        entities['229'] = '&aring;';
			        entities['230'] = '&aelig;';
			        entities['231'] = '&ccedil;';
			        entities['232'] = '&egrave;';
			        entities['233'] = '&eacute;';
			        entities['234'] = '&ecirc;';
			        entities['235'] = '&euml;';
			        entities['236'] = '&igrave;';
			        entities['237'] = '&iacute;';
			        entities['238'] = '&icirc;';
			        entities['239'] = '&iuml;';
			        entities['240'] = '&eth;';
			        entities['241'] = '&ntilde;';
			        entities['242'] = '&ograve;';
			        entities['243'] = '&oacute;';
			        entities['244'] = '&ocirc;';
			        entities['245'] = '&otilde;';
			        entities['246'] = '&ouml;';
			        entities['247'] = '&divide;';
			        entities['248'] = '&oslash;';
			        entities['249'] = '&ugrave;';
			        entities['250'] = '&uacute;';
			        entities['251'] = '&ucirc;';
			        entities['252'] = '&uuml;';
			        entities['253'] = '&yacute;';
			        entities['254'] = '&thorn;';
			        entities['255'] = '&yuml;';
			    }
			
			    if (useQuoteStyle !== 'ENT_NOQUOTES') {
			        entities['34'] = '&quot;';
			    }
			    if (useQuoteStyle === 'ENT_QUOTES') {
			        entities['39'] = '&#39;';
			    }
			    entities['60'] = '&lt;';
			    entities['62'] = '&gt;';
			
			
			    // ascii decimals to real symbols
			    for (decimal in entities) {
			        if (entities.hasOwnProperty(decimal)) {
			            hash_map[String.fromCharCode(decimal)] = entities[decimal];
			        }
			    }
			
			    return hash_map;
			}
		},
		ucwords : function(str){
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			    return $1.toUpperCase();
			  });
		},
		uniqid : function(prefix, more_entropy) {
		  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +    revised by: Kankrelune (http://www.webfaktory.info/)
		  // %        note 1: Uses an internal counter (in php_js global) to avoid collision
		  // *     example 1: uniqid();
		  // *     returns 1: 'a30285b160c14'
		  // *     example 2: uniqid('foo');
		  // *     returns 2: 'fooa30285b1cd361'
		  // *     example 3: uniqid('bar', true);
		  // *     returns 3: 'bara20285b23dfd1.31879087'
		  if (typeof prefix === 'undefined') {
		    prefix = "";
		  }
		
		  var retId;
		  var formatSeed = function (seed, reqWidth) {
		    seed = parseInt(seed, 10).toString(16); // to hex str
		    if (reqWidth < seed.length) { // so long we split
		      return seed.slice(seed.length - reqWidth);
		    }
		    if (reqWidth > seed.length) { // so short we pad
		      return Array(1 + (reqWidth - seed.length)).join('0') + seed;
		    }
		    return seed;
		  };
		
		  // BEGIN REDUNDANT
		  if (!this.php_js) {
		    this.php_js = {};
		  }
		  // END REDUNDANT
		  if (!this.php_js.uniqidSeed) { // init seed with big random int
		    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
		  }
		  this.php_js.uniqidSeed++;
		
		  retId = prefix; // start with prefix, add current milliseconds hex string
		  retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
		  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
		  if (more_entropy) {
		    // for more entropy we add a float lower to 10
		    retId += (Math.random() * 10).toFixed(8).toString();
		  }
		
		  return retId;
		}
	};
	
})(_);

/* prototype mods { */

if (typeof String.prototype.startsWith != 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function (str){
		return this.indexOf(str) == 0;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}
/* } prototype mods */
