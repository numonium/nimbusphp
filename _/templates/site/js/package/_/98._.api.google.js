// ~EN: SFM web api {

(function(_, $){

	var __class = {
		_ : 'Google',
		parents : ['API']
	};
	
	var __t = {}; // ~EN (2014): semi-global "this" identifier

	_._.add({
		_class : __class,
		base : _._.api, // remember to put apis in the api context
		constructor : function(args){
		
			_._.parentConstruct(this,arguments,__class);
		
			var _app = false;
		
			var _t = __t = this; //for scope reasons
			this._id = __class._;
			this._cmd = 'google';
			this._attr = 'data-' + this._cmd;
			this._class = '_-' + this._cmd; //css class; __class -> js class name, added in _.add
			this.uuid = '';
			
			this.cfg = this.cfg || {};
			
			this.Map = function(args){ // map subclass
				
				var _t = this;
				
				this.ele = args.ele;
				
				this.center = args.center || {
/*					lat: 41.3190,
					lng: -72.9449*/
					lat : 28.784251,
					lng : -81.357936
				};
				
				this.fullscreen = args.fullscreen || false;
				this.view_mode = args.view_mode || 'default';
				this.zoom = args.zoom || 6;
				
				if(this.fullscreen){
					this.ele.style.width = window.outerWidth + "px";
					this.ele.style.height = window.outerHeight + "px";
					this.view_mode = 'fullscreen';
				}
				
				this.options = args.options || {
					center: this.center,
					zoom: this.zoom,
					mapTypeControl : false,
					streetViewControl :false,
					styles: args.styles || __t.map.styles
				};
				
				this.map = new google.maps.Map(this.ele,this.options);
				this.places = new google.maps.places.PlacesService(this.map);
				this.markers = {};
				
				this.add_marker = function(args){
					var lat, lng, loc, marker = {};
					
					if(args.loc){
						lat = args.loc.lat || args.lat;
						lng = args.loc.lng || args.lng;
					}else{
						lat = args.lat;
						lng = args.lng;
					}
					
					loc = {
						lat : lat,
						lng : lng
					};
					
					var title = args.title || '';
					
					marker.LatLng = new google.maps.LatLng(lat,lng);
					marker._ = new google.maps.Marker({
						position : marker.LatLng,
						map : _t.map,
						title : title
					});
					
					if(!_.admin._){
					
						marker.infobox = new InfoBox({
							content : _t.infobox_content(args),
							disableAutoPan: false,
							maxWidth: 150,
							pixelOffset: new google.maps.Size(-140, -100),
							zIndex: null,
							boxStyle: {
	//							background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
	//							opacity: 0.75,
								width: "360px"
							},
							infoBoxClearance: new google.maps.Size(1, 1)
						});
						
					}
					
					google.maps.event.addListener(marker._, 'click', function() {
						
						for(var i in _t.markers){
							if(_t.markers.hasOwnProperty(i) && _t.markers[i].infobox){
								_t.markers[i].infobox.close();
							}
						}
						
						if(marker.infobox){
							marker.infobox.open(_t.map, this);
						}
						
						var zoom_thresh = 6;
						
						if(_t.map.getZoom() < zoom_thresh){
							_t.map.setZoom(zoom_thresh);
						}

						_t.map.panTo(loc);
					});
					
					_t.markers[lat + "|" + lng] = marker;
				};
				
				this.infobox_content = function(args){
					_.log(__t._id + '[map][infobox][content]',args);					
					
					var html =
//						'<a class="_-map--infobox--wrapper" href="/vacations/map/' + args.slug + '">' +
						'<a class="_-map--infobox--wrapper" href="#/sfm/map/' + args.slug + '">' +
							'<div class="_-map--infobox">' +
								'<h2 class="_-map--infobox--title">' + args.title + '</h2>' +
								'<p>' + args.len + ' Vacation' + (args.len !== 1 ? 's' : '') + ' at this Destination ' + '<span class="_-icon _-icon--arrow--right">&#9658;</span></p>' +
								'<ul class="_-map--infobox--types">' +
									'<li class="_-map--infobox--type _-map--infobox--type--land ' + (args.dests && args.dests._.types.land ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-land"></span>' +
							    			'<span class="_-text">Land</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.land ? args.dests._.types.land : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--air ' + (args.dests && args.dests._.types.air ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-air"></span>' +
							    			'<span class="_-text">Air</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.air ? args.dests._.types.air : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--vacation ' + (args.dests && args.dests._.types.vacation ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--vacations"></span>' +
							    			'<span class="_-text">Vacation</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.vacation ? args.dests._.types.vacation : 0) + '</span>' +
						    		'</li>' +
									'<li class="_-map--infobox--type _-map--infobox--type--destination-cruise ' + (args.dests && args.dests._.types.cruise ? '_-selected' : '_-hidden') + '">' +
										'<span class="_-icon--wrapper">' +
							    			'<span class="_-icon _-icon--font--destination-cruise"></span>' +
							    			'<span class="_-text">Cruise</span>' +
							    		'</span>' +
//							    		'<span class="_-sep">x</span>' +
							    		'<span class="_-num">' + (args.dests && args.dests._.types.cruise ? args.dests._.types.cruise : 0) + '</span>' +
						    		'</li>' +
						    	'</ul>' +
							'</div>' +
						'</a>';
						
					return $(html)[0];
				};
				
				this.nearby = function(args,callback){
					if(!args){
						return false;
					}
					
					callback = callback || args.callback;
					
					var loc = args.loc || _t.center;
					var radius = (args.radius ? args.radius : 5000);
					var types = args.types || args.type || [];
					
					if(_.is.string(types)){
						types = types.split('|');
					}
					
					return _t.places.nearbySearch({
						location : new google.maps.LatLng(loc.lat,loc.lng),
						radius : radius,
//						rankBy : google.maps.places.RankBy.DISTANCE,
						types : types
					},callback /*function(results,status){
						
						var ret = [];
						
						if(!results){
							return callback(results,status);
						}
						
/*						for(var i in results){
							if(results.hasOwnProperty(i)){
								// ~EN (2014): each result contains only partial place data, and we need to get more details
								_t.places.getDetails(results[i].reference, function(place, st2){
									ret.push({
										nearby : results[i],
										place : place
									});
								});
							}	
						}*
						
						callback(results,status);
					}*/);
					
				};
				
				this.nearby_airports = function(args,callback){
					callback = callback || args.callback;
					
					var loc = args.loc || _t.center;
					var radius = (args.radius ? args.radius : 250);
					
					//http://api.geonames.org/findNearby?lat=40.776902&lng=-73.968887&fcode=AIRP&radius=25&maxRows=100&username=sunfunmedia
					//http://ws.geonames.org/findNearbyJSON?lat=40&lng=9&radius=250&featureClass=S&featureCode=AIRP&username=sunfunmedia
					
//					var url = 'http://api.geonames.org/findNearby?1';
					var url = 'http://ws.geonames.org/findNearbyJSON?1';
					
					$.ajax({
						dataType : 'json',
						type : 'GET',
						url : url,
						data : {
							lat : loc.lat,
							lng : loc.lng,
							code : 'AIRP',
							radius : radius,
							featureClass : 'S',
							featureCode : 'AIRP',
							username : 'sunfunmedia'
						},
						success : function(data){
							_.log(__t._id + '[ui][nearby-airports][*get]',data);
							
						}
					});
				};
				
				this.overlays = {
					_ : {
						overlay : false,
						content : false,
						shown : false
					},
					dest : function(hash,args){
						var overlay = _t.overlays._.overlay || $('._-over--map').get(0) || $('<div class="_-over _-over--map"><span class="_-bg--noise"></span><div class="_-over--content"></div></div>').appendTo('body').get(0);
						_t.overlays._.overlay = overlay;
						
						var content = _t.overlays._.content || overlay.getElementsByClassName('_-over--content')[0];
						_t.overlays._.content = content;
						
						$(overlay).hide();
						
						if(hash.length > 1){
							
							$.ajax({
								url : '/vacations/' + args.hash,
								success : function(data){
									
									_t.overlays.show({data : data, hash : args});
									
								}
							});
							
						}else if(hash.length = 1){
							var city = hash.shift();						
							
							$.ajax({
								url : '/vacations/map/' + city,
								success : function(data){
									
									_t.overlays.show({data : data, hash : args});
									
								}
							});

						}

					},
					show : function(args){
						
						var data = args.data;
						
						$('body > ._-page').addClass('_-has--over');
						
						var data = $(data)[0];
						
						$(_t.overlays._.content).html('').append(data);
						$(_t.overlays._.overlay).show();
						
						_.log('@@@',args.hash);
						
						$(document).on('click','._-over--map ._-over--content ._-btn--back',function(e){
							e.preventDefault();
							
							window.location.href='#/sfm/map';
						});
						
						_t.overlays._.shown = true;
						
						_.log(__t._id + '[Map][overlay][show]',$('._-over--map ._-over--content ._-btn--back'),_t.overlays._.overlay);
					},
					hide : function(args){
						
						if(!_t.overlays._.shown){ // already hidden
							return false;
						}
						
						_.log(__t._id + '[Map][overlay][hide]',args,_t.overlays._.overlay);						
						
						$(_t.overlays._.content).html('');
						$(_t.overlays._.overlay).hide();
						$('body > ._-page').removeClass('_-has--over');
						_t.overlays._.shown = false;
						
						return true;
					}
				};
				
				this.recenter = function(loc){
					_t.center = loc;	
					_t.map.setCenter(_t.center);
					
					if(_t.view_mode == 'single'){
						_t.remove_markers();
						_t.add_marker({
							loc : loc
						});
					}
				};
				
				this.remove_markers = function(){
					if(!_t.markers){
						return false;
					}
					
					for(var i in _t.markers){
						if(_t.markers.hasOwnProperty(i)){
							_t.markers[i]._.setMap(null);
						}
						
						delete _t.markers[i];
					}
				};
				
				this.resize = function(e){
					_.log(__t._id + '[Map][resize]',e,_t.map);
					_t.center = _t.map.getCenter();
					google.maps.event.trigger(_t.map,'resize');
					_t.map.setCenter(_t.center);
					
					if(_t.fullscreen){
						_t.ele.style.width = window.outerWidth + "px";
						_t.ele.style.height = window.outerHeight + "px";
					}

				};
				
				var minZoomLevel = 3;
				google.maps.event.addListener(this.map, 'zoom_changed', function() {
					if (_t.map.getZoom() < minZoomLevel) _t.map.setZoom(minZoomLevel);
				});
				

				
				if(this.view_mode == 'single'){
					this.remove_markers();
					this.add_marker({
						loc : this.center
					});
				}else if(this.view_mode == 'fullscreen'){
					// ~EN: set up markers
					$.getJSON('/-/vacations',function(data){

						_.log(__t._id + '[Map][*load][markers]',data);
						
						for(var i in data){
							if(data.hasOwnProperty(i)){
								
 //								if(data[i].length === 1){
									
									var dests = data[i];
									
									_t.add_marker({
										loc : data[i]._.loc,
										len : data[i]._.len,
										title : i,
										slug : data[i]._.slug,
										dests : data[i],
									});
//								}
							}
						}

					});
				}
				
				$(window).resize(this.resize);
				
/*				google.maps.event.addDomListener(this.map, 'tilesloaded', function(){
					$('div.gmnoprint').last().parent().wrap('<div class="_-map--controls" />');
				});*/
				
			};
			
			this.init();
		},
		proto : {
			init : function(args){
				
			}
		}
	});
	
	_.api.google = _.api.google || new _._.api.Google();
	
})(_, jQuery);