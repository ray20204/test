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
function setArea() {
    $.ajax({
        type: "GET",
        url: "/data.json",
        dataType: "json",
        async: true,
        success: function(data) {
            $.each(data, function(index, value){
                var listhtml = '<li class="place list-group-item">' + value.Location + '</li>';
                $('.place-list > ul').append(listhtml);
                //console.log('ret= ' + value.ret + ' lng= ' + value.lng);
                var place = new google.maps.LatLng(value.ret, value.lng);
                var populationOptions = {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.1,
                    map: map,
                    center: place,
                    radius: 100
                };
                cityCircle = new google.maps.Circle(populationOptions);
                var infoWindow = new google.maps.InfoWindow({
                    content: value.Location
                });
                google.maps.event.addListener(cityCircle, 'click', function(ev){
                    infoWindow.setPosition(ev.latLng);
                    infoWindow.open(map);
                });
            });
        }
    });
}
