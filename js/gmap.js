var map;
var myLatlng;
var mapOptions;
var geocoder;
var marker;
function initialize() {
    myLatlng = new google.maps.LatLng(25.0633936, 121.520279);
    mapOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    setArea();
}
google.maps.event.addDomListener(window, 'load', this.initialize);
var panorama;
var circleTimer;
var jsonData;
var placeArr = [];
function setArea() {
    $.ajax({
        type: "GET",
        url: "data.json",
        dataType: "json",
        async: true,
        success: function(data) {
            jsonData = data;
            $.each(data, function(index, value){
                var listhtml = '<a href="#"  class="place list-group-item" data-id="' + index  + '">' + value.Location + '</>';
                $('.place-list > ul').append(listhtml);
                //console.log('ret= ' + value.ret + ' lng= ' + value.lng);
                placeArr.push(new google.maps.LatLng(value.ret, value.lng));
                var populationOptions = {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.1,
                    map: map,
                    center: placeArr[index],
                    radius: 100
                };
                cityCircle = new google.maps.Circle(populationOptions);
                var infoWindow = new google.maps.InfoWindow({
                    content: value.Location
                });
                google.maps.event.addListener(cityCircle, 'click', function(ev){
                    //infowindow
                    //infoWindow.setPosition(ev.latLng);
                    //infoWindow.open(map);
                    //test street view
                    var panoramaOptions = {
                        position: ev.latLng,
                        pov: {
                          heading: 0,
                          pitch: 10
                        }
                    };
                    panorama = new google.maps.StreetViewPanorama(document.getElementById('viewstreet'), panoramaOptions);
                    map.setStreetView(panorama);
                    clearTimeout(circleTimer);
                    circleTimer = setTimeout(runCircle, 2000);
                });
            });
        }
    });
}
var around;
function randMove() {
    around = panorama.getLinks();
    var randPosition = Math.floor((Math.random() * around.length));
    console.log(randPosition);
    panorama.setPano(around[randPosition].pano);
}
var streetPov = {heading: 0, pitch: 10};
function runCircle() {
    streetPov.heading += 45;
    if (360 === streetPov.heading) {
        streetPov.heading = 0;
    }
    panorama.setPov(streetPov);
    circleTimer = setTimeout(runCircle, 2000);
}

jQuery(function() {
    $(document).on('click', '.place', function(e) {
        var placeid = $(this).data('id');
        map.setCenter(placeArr[placeid]);
        var panoramaOptions = {
            position: placeArr[placeid],
            pov: {
              heading: 0,
              pitch: 10
            }
        };
        panorama = new google.maps.StreetViewPanorama(document.getElementById('viewstreet'), panoramaOptions);
        map.setStreetView(panorama);
        clearTimeout(circleTimer);
        circleTimer = setTimeout(runCircle, 2000);
    });
});
