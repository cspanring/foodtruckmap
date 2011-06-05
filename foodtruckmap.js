$(document).ready(function() {
	
	fixContentHeight = function () { // fix map height
		var header = $("div[data-role='header']:visible"),
		content = $("div[data-role='content']:visible:visible"),
		viewHeight = $(window).height(),
		contentHeight = viewHeight - header.outerHeight();
		if ((content.outerHeight() + header.outerHeight()) !== viewHeight) {
			contentHeight -= (content.outerHeight() - content.height());
			content.height(contentHeight);
		}
	}
	$(window).bind("orientationchange resize pageshow", fixContentHeight);

	addFoodTruckMarker = function (location, icon, content) {
		$('#map_canvas').gmap('addMarker', { 
			'position': location,
			'icon': icon
		},
		function(map, marker){
			$('#map_canvas').gmap('addInfoWindow', { 
				'position': $.userloc, 
				'content': content
				}, 
				function(iw) {
					$(marker).click(function() {
						iw.open(map, marker);
						map.panTo(marker.getPosition());
					});                                                                                                                                                                                                                               
				}
			);
		});
	}

	loadFoodTrucks = function (param) {
		$.mobile.pageLoading();
		var mapBounds = new google.maps.LatLngBounds();
		if (param.userloc) mapBounds.extend(param.userloc);
		$.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + param.lat + ',' + param.lng + '&categoryId=4bf58dd8d48988d1cb941735&client_id=MZPYKG1K3WKFMVR1GQYBHJC30D1GTMEIVHTMK3W1QN5FV2TP&client_secret=SSVS3SPTBEL3U4551F3VYKWSXLFIBF1LBZUMTPUUMYCJ4XEL&limit=20', function(data) {
			if (data.response.groups[0].items.length > 0) {
				$(data.response.groups).each(function(index) { // groups: nearby, trending
					$(this.items).each(function(index) {
						var foodtruck = this;
						var foodtruckPosition = new google.maps.LatLng(foodtruck.location.lat, foodtruck.location.lng);
						var foodtruckIcon = (foodtruck.hereNow.count > 0) ? 'foodtruck_active.png' : 'foodtruck_inactive.png';
						var foodtruckStreet = (foodtruck.location.address) ? '<br>' + foodtruck.location.address : '';
						var foodtruckContent = '<a href="https://foursquare.com/venue/' + foodtruck.id + '"><strong>' + foodtruck.name + '</strong></a>' + foodtruckStreet + '<br>(' + foodtruck.hereNow.count + ' people checked in)';
						mapBounds.extend(foodtruckPosition);
						addFoodTruckMarker(foodtruckPosition, foodtruckIcon, foodtruckContent);
					});
					if (param.zoomtotrucks) $('#map_canvas').gmap('getMap').fitBounds(mapBounds);
				});
			} else {
				alert("Sorry, couldn't find any Food Trucks near you.");
				$.mobile.pageLoading( true );
			}
		})
		.error( function() { 
			loadFoodTrucks(param); //try again
		})
		.complete( function() { 
			$.mobile.pageLoading( true ); 
		});
	}

	$('#refreshtrucks').bind('click', function() {
		$('#refreshtrucks').removeClass("ui-btn-active"); //jqm button bug workaround
		$('#map_canvas').gmap('clearMarkers');
		addFoodTruckMarker($.userloc, 'userloc.png', 'That\'s you.');
		var mapCenter = $('#map_canvas').gmap('getMap');
		loadFoodTrucks({lat: mapCenter.center.lat(), lng: mapCenter.center.lng()});
		return false;
	});

	$('#start-page').live('pageshow', function() {
		$('#map_canvas').gmap( { 
			'center': new google.maps.LatLng(39.828175, -98.5795), 
			'zoom': 4,  
			'streetViewControl': false, 
			'mapTypeControl': false,
			'mapTypeId': google.maps.MapTypeId.ROADMAP,
			'callback': function (map) {
				if ( navigator.geolocation ) {
					navigator.geolocation.getCurrentPosition ( 
						function( position ) {
							$.userloc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							addFoodTruckMarker($.userloc, 'userloc.png', 'That\'s you.');
							map.panTo($.userloc);
							loadFoodTrucks({lat: position.coords.latitude, lng: position.coords.longitude, userloc: $.userloc, zoomtotrucks: true});
						},
						function( error ) {
							$.mobile.pageLoading( true );
							alert("Sorry, couldn't find your location.");
						},
						{
							enableHighAccuracy: true, 
							maximumAge: (1000 * 60 * 10), 
							timeout: (1000 * 20)
						}
					);
				}
			}
		});	
	});
	
});
