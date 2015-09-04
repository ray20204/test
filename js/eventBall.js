//direction
var thisPos;
var isStart = false;
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, errorHandler, {timeout:60000});
} else {
    $('.displayInfo').html('Geolocation is not supported by this browser.');
}
function errorHandler(err) {
    if(err.code == 1) {
        $('.displayInfo').html('Error: Access is denied!');
    } else if( err.code == 2) {
        $('.displayInfo').html('Error: Position is unavailable!');
    }
}
function showPosition(position) {
    thisPos = {Location: 'now', lng: position.coords.longitude, ret: position.coords.latitude};
    if (isStart) {
        gmap.onPositionChange();
    }
}
//0: start , 1:pit, 2: goal
function testCase(pos) {
    switch (pos) {
        case 0:
        thisPos = {Location: 'now', lng: 121.5552137, ret: 25.0851076};
        break;
        case 1:
        thisPos = {Location: 'now', lng: 121.5536283, ret: 25.0926443};
        break;
        case 2:
        thisPos = {Location: 'now', lng: 121.5575088, ret: 25.1077731};
        break;
    }
    gmap.onPositionChange();
}
var gmap = ({
    map: '',
    userMarker: '',
    directionsService: '',
    directionsDisplay: '',
    startpt: '',
    endpt: '',
    waypts: [],
    totalDistance: 0,
    totalDuration: 0,
    placeArr: [],
    elevator: '',
    samplePoint: 100,
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
        var ret = this.placeArr[placeid].G;
        var lng = this.placeArr[placeid].K;
        var state = distance(ret, lng);
        var image = '<img src=/test/img/ball.jpg>';
        if (1 === state) {
            switch (placeid) {
                case 0:
                alert('獲得銀龍珠');
                this.markerBall(ret, lng);
                $(e.target).append(image);
                break;
                case 1:
                alert('獲得金龍珠');
                this.markerBall(ret, lng);
                $(e.target).append(image);
                break;
                case 2:
                alert('找到湖中女神，獲得______');
                this.markerBall(ret, lng);
                $(e.target).append(image);
                break;
            }
        } else {
            alert('強烈的白色光芒');
        }
    },
    initPosition: function() {
        gmap.directionsDisplay = new google.maps.DirectionsRenderer();
        var myLatlng = new google.maps.LatLng(25.0855065, 121.553956);
        mapOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        gmap.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        gmap.directionsDisplay.setMap(gmap.map);
        gmap.initHex();
        gmap.initData();
    },
    initHex: function() {
        //left bottom to right top
        var bbox = [121.5098228, 25.0493519, 121.5866949, 25.1319599];
        var hexgrid = turf.hexGrid(bbox, 0.5, 'kilometers');
        this.map.data.setStyle(function(feature) {
            return { fillOpacity: 0.7, fillColor: 'green', strokeWeight: 1, strokeColor: '#333', strokeOpacity: 1};
        });
        this.map.data.addGeoJson(hexgrid);
    },
    onPositionChange: function () {
        if (!isStart) {
            var state = distance(25.0855065, 121.553956);
            if (1 === state) {
                isStart = true;
                $('.list-group').show();
                this.setDirectionRoute();
            }
            this.markerUserPosition();
        }
    },
    markerUserPosition: function () {
        var latlng = this.getLatLng(thisPos.ret, thisPos.lng);
        this.map.setCenter(latlng);
        if ('' === this.userMarker) {
            this.userMarker = new google.maps.Marker({
                position: latlng,
                map: this.map,
            });
        } else {
            this.userMarker.setPosition(latlng);
        }
    },
    initData: function() {
        this.initEl();
        this.placeArr = [];
        $.getJSON("eventball.json").done(
            this.bind(this, function(ret) {
                $.each(ret, this.bind(this, function(index, value) {
                    var listhtml = '<a href="#"  class="place list-group-item" data-id="' + index  + '">' + value.Location + '</>';
                    this.el.$placeList.append(listhtml);
                    var latLngObject = this.getLatLng(value.ret, value.lng);
                    this.placeArr.push(latLngObject);

                    var retLngstr = value.ret + ',' + value.lng;
                    if (0 === index) {
                        this.markerBall(value.ret, value.lng);
                        $('.displayInfo').append('龍珠');
                        this.startpt = retLngstr;
                    }
                    if (0 < index && (ret.length - 1) > index) {
                        this.waypts.push({
                            location:retLngstr,
                            stopover:true
                        });
                    }
                    if ((ret.length - 1) === index) {
                        this.endpt = retLngstr;
                    }
                }));
                this.initEl();
                this.bindEvent();
            })
        );
    },
    markerBall: function(ret, lng) {
        var latlng = this.getLatLng(ret, lng);
        var image = '/test/img/ball.jpg';
        this.map.setCenter(latlng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            icon: image
        });
    },
    getLatLng: function(ret, lng) {
        return new google.maps.LatLng(ret, lng);
    },
    init: function() {
        this.directionsService = new google.maps.DirectionsService();
        google.maps.event.addDomListener(window, 'load', this.initPosition);
        this.elevator = new google.maps.ElevationService();
    },
    setDirectionRoute: function () {
        var request = {
            origin: this.startpt,
            destination: this.endpt,
            waypoints: this.waypts,
            avoidHighways: true,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING
        };
        this.directionsService.route(request, this.bind(this, function(response, status) {
            console.log(response);
            if (status != google.maps.DirectionsStatus.OK) {
                return false;
            }
            this.directionsDisplay.setDirections(response);
            var route = response.routes[0];
            for (var i = 0; i < route.legs.length; i++) {
                this.totalDistance += route.legs[i].distance.value;
                this.totalDuration += route.legs[i].duration.value;
                var distance = '<span class="label label-primary">' + route.legs[i].distance.text  + '</span>';
                var dirtime = '<span class="label label-success">' + route.legs[i].duration.text  + '</span>';
                $('.list-group-item').eq(i + 1).append('<br>' + distance + dirtime);
            }
            this.getElevator();
            var showDistance = this.totalDistance / 1000;
            var showDuration = convertTime(this.totalDuration);
            $('.displayInfo').append('距離：' + showDistance.toFixed(2) + ' 公里 ' + '  預估時間：' + showDuration);
        }));
    },
    getElevator: function() {
        this.elevator.getElevationAlongPath({
            'path': this.placeArr,
            'samples': this.samplePoint
        }, this.plotElevation);

    },
    plotElevation: function(elevations, status) {
        if (status !== google.maps.ElevationStatus.OK) {
            // Show the error code inside the chartDiv.
            $('.displayInfo').html(status);
            return;
        }
        eventChart.init();
        var dateArr = [];
        var dataArr = [];
        for (var i = 0; i < elevations.length; i++) {
            var pa = parseInt((i / gmap.samplePoint) * 100);
            if (0 === (pa % 5)) {
                dateArr.push(pa+'%');
            } else {
                dateArr.push('');
            }
            dataArr.push(elevations[i].elevation);
         }
        eventChart.plotLineChart(dateArr, dataArr);
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
        gmap.onPositionChange();
    }, 3000);
});
function distance(ret2,lon2) {
    var state = 0;
    if (typeof thisPos === 'undefined') {
        return state;
    }
    var R = 6371; // km (change this constant to get miles)
    var dLat = (ret2- thisPos.ret) * Math.PI / 180;
    var dLon = (lon2- thisPos.lng) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(thisPos.ret * Math.PI / 180 ) * Math.cos(ret2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    if (0.2 >= d) {
        $('.displayInfo').removeClass('alert-danger');
        $('.displayInfo').addClass('alert-success');
        state = 1;
    }
    return state;
    //if (d>1) return Math.round(d)+"km";  //km
    //else if (d<=1) return Math.round(d*1000)+"m"; //m
    //return d;
}
function convertTime(dursec) {
    var hour = parseInt(dursec / 3600);
    dursec -= hour * 3600;
    var min = parseInt(dursec / 60);
    return hour + '小時' + min + '分';
}
