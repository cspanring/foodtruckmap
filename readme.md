# foodtruckmap.co

[foodtruckmap.co](http://foodtruckmap.co)

A map showing Food Trucks based on user locations.

## Dependencies

 * [jQuery mobile (Alpha 4.1)](http://jquerymobile.com/)
 * [Google Maps API (v3)](http://code.google.com/apis/maps/documentation/javascript/)
 * [jQuery UI map (2)](http://code.google.com/p/jquery-ui-map/)
 * [foursquare Venues Project](https://developer.foursquare.com/venues/)

## Features

 * Reads user location by using browser geolocation API
 * Queries foursquare API for Food Truck category in user vicinity
 * Plots Food Truck locations on a Google Map with different icons for active (checked in people) and inactive Food Trucks. Food Trucks are moving targets, it's a workaround for visualizing the likelihood if a Food Truck is at a given location or not.
