//direction
var gmap = ({
    map: '',
    directionsService: '',
    directionsDisplay: '',
    waypts: [],
    placeArr: [],
    panorama: '',
    circleTimer: '',
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
        gmap.directionsDisplay = new google.maps.DirectionsRenderer();
        var myLatlng = new google.maps.LatLng(24.909898, 121.365848);
        mapOptions = {
            zoom: 12,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        gmap.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        gmap.directionsDisplay.setMap(gmap.map);
    },
    initData: function() {
        this.initEl();
        $.getJSON("event.json").done(
            this.bind(this, function(ret) {
                $.each(ret,
                    this.bind(this, function(index, value) {
                        var listhtml = '<a href="#"  class="place list-group-item" data-id="' + index  + '">' + value.Location + '</>';
                        this.el.$placeList.append(listhtml);
                        var latLngObject = this.getLatLng(value.ret, value.lng);
                        this.placeArr.push(latLngObject);
                        this.plotCircle(latLngObject);
                        this.waypts[index] = [value.ret + ',' + value.lng];
                    })
                );
                this.setDirectionRoute();
                this.initEl();
                this.bindEvent();
            })
        );
    },
    getLatLng: function(ret, lng) {
        return new google.maps.LatLng(ret, lng);
    },
    plotCircle: function(latLngObject, location) {
        var infoWindow = new google.maps.InfoWindow({
            content: location
        });
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

        clearInterval(this.circleTimer);
        this.runCircle();
    },
    getStreetViewPanorama: function(option) {
        return new google.maps.StreetViewPanorama(document.getElementById('viewstreet'), option);
    },
    runCircle: function() {
        var pano = this.panorama;
        function _runCircle() {
            var pov = pano.getPov();
            pov.heading += 0.2;
            pano.setPov(pov);
        }
        this.circleTimer = setInterval(_runCircle, 10);
    },
    init: function() {
        this.directionsService = new google.maps.DirectionsService();
        google.maps.event.addDomListener(window, 'load', this.initPosition);
    },
    setDirectionRoute: function () {
        var start = this.waypts[0][0];
        var end = this.waypts[this.waypts.length - 1][0];
        var wayArr = [];
        for (var i = 1; i < this.waypts.length - 1; i++) {
            wayArr.push({
                location:this.waypts[i][0],
                stopover:true
            });
        }
        var request = {
            origin: start,
            destination: end,
            waypoints: wayArr,
            avoidHighways: true,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService.route(request, this.bind(this, function(response, status) {
            console.log(response);
            if (status == google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
                var route = response.routes[0];
                for (var i = 0; i < route.legs.length; i++) {
                    var distance = '<span class="label label-primary">' + route.legs[i].distance.text  + '</span>';
                    var dirtime = '<span class="label label-success">' + route.legs[i].duration.text  + '</span>';
                    $('.list-group-item').eq(i + 1).append('<br>' + distance + dirtime);
                }
            }
        }));
    },
    bind: function(obj, method) {
        return function() {
            return method.apply(obj, [].slice.call(arguments));
        };
    }
});
gmap.init();
$(function() {
    setTimeout(function() {
        gmap.initData();
    }, 2000);
});
