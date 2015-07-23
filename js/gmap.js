var gmap = ({
    map: '',
    geocoder: '',
    placeArr: [],
    panorama: '',
    circleTimer: '',
    streetPov: {
        heading: 0,
        pitch: 10
    },
    el: {
        $placeList: null,
        $placeItem: null
    },
    initEl: function() {
        this.el.$placeList = $('.place-list > ul');
        this.el.$placeItem = $('.place');
    },
    bindEvent: function() {
        this.el.$placeItem.click(this.bind(this, this.handleClick));
    },
    handleClick: function(e) {
        e.preventDefault();
        var placeid = $(e.target).data('id');
        this.map.setCenter(this.placeArr[placeid]);
        this.setStreetView(this.placeArr[placeid]);
    },
    initPosition: function() {
        var myLatlng = new google.maps.LatLng(25.0633936, 121.520279);
        mapOptions = {
            zoom: 15,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        gmap.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        //var geocoder = new google.maps.Geocoder();
    },
    initData: function() {
        this.initEl();
        $.getJSON("data.json").done(
            this.bind(this, function(ret) {
                this.zipArr = ret;
                $.each(ret,
                    this.bind(this, function(index, value) {
                        var listhtml = '<a href="#"  class="place list-group-item" data-id="' + index  + '">' + value.Location + '</>';
                        this.el.$placeList.append(listhtml);
                        var latLngObject = this.getLatLng(value.ret, value.lng);
                        this.placeArr.push(latLngObject);
                        this.plotCircle(latLngObject);

                    })
                );
                this.initEl();
                this.bindEvent();
            })
        );
    },
    getLatLng: function(ret, lng) {
        return new google.maps.LatLng(ret, lng);
    },
    plotCircle: function(latLngObject, location) {
        var populationOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.1,
            map: this.map,
            center: latLngObject,
            radius: 100
        };
        cityCircle = new google.maps.Circle(populationOptions);
        var infoWindow = new google.maps.InfoWindow({
            content: location
        });
        google.maps.event.addListener(cityCircle, 'click', this.bind(this, function(ev) {
            //infowindow
            //infoWindow.setPosition(ev.latLng);
            //infoWindow.open(map);
            //test street view
            this.setStreetView(ev.latLng);
        }));
    },
    setStreetView: function(latLng) {
        var panoramaOptions = {
            position: latLng,
            pov: {
              heading: 0,
              pitch: 10
            }
        };
        this.panorama = this.getStreetViewPanorama(panoramaOptions);
        this.map.setStreetView(this.panorama);
        clearTimeout(this.circleTimer);
        this.circleTimer = setTimeout(this.bind(this, this.runCircle), 2000);
    },
    getStreetViewPanorama: function(option) {
        return new google.maps.StreetViewPanorama(document.getElementById('viewstreet'), option);
    },
    runCircle: function() {
        this.streetPov.heading += 45;
        if (360 === this.streetPov.heading) {
            this.streetPov.heading = 0;
        }
        this.panorama.setPov(this.streetPov);
        this.circleTimer = setTimeout(this.bind(this, this.runCircle), 2000);
    },
    init: function() {
        google.maps.event.addDomListener(window, 'load', this.initPosition);
        //this.initData();
    },
    bind: function(obj, method) {
        return function() {
            return method.apply(obj, [].slice.call(arguments));
        };
    }
});
gmap.init();
var around;
function randMove() {
    around = panorama.getLinks();
    var randPosition = Math.floor((Math.random() * around.length));
    console.log(randPosition);
    panorama.setPano(around[randPosition].pano);
}

$(function() {
    gmap.initData();
});
