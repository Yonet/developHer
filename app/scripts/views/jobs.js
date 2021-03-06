/*global developHer, Backbone, JST*/

var loadMap = function(){
  var map;

  function initialize() {
    var mapOptions = {
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true
    }

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var icons = {
      agriculture: {
        icon: './markers/agriculture.png',
        sound: 'agriculture',
        position: {
          latitude: 30.7464,
          longitude: -122.27
        },
        salary: "$1000",
        description: "farmWork",
        phoneNumber: "(555)239-2903"
      },
      factory: {
        icon: './markers/factory.png',
        sound: 'factory',
        position: {
          latitude: 37.5919,
          longitude: -121.8375
        },
        salary: "$250",
        description: "factoryWork",
        phoneNumber: "(888)919-1223"
      },
      construction: {
        icon: './markers/construction.png',
        sound: 'construction',
        position: {
          latitude: 38,
          longitude: -122
        },
        salary: "$100",
        description: "constructionWork",
        phoneNumber: "(998)219-3427"
      },
      custodian: {
        icon: './markers/custodian.png',
        sound: 'custodian',
        position: {
          latitude: 39,
          longitude: -122
        },
        salary: "$10",
        description: "custodianWork",
        phoneNumber: "(192)938-2113"
      },
      government: {
        icon: './markers/government.png',
        sound: 'government',
        position: {
          latitude: 37,
          longitude: -121
        },
        salary: "$500",
        description: "govtWork",
        phoneNumber: "(290)109-1203"
      },
      childcare: {
        icon: './markers/childcare.png',
        sound: 'childcare',
        position: {
          latitude: 37.69951,
          longitude: -122.423401
        },
        salary: "$2500",
        description: "childcareWork",
        phoneNumber: "(123)312-9323"
      },
      manuallabor: {
        icon: './markers/manuallabor.png',
        sound: 'manuallabor',
        position: {
          latitude: 37.55703,
          longitude: -122.34375
        },
        salary: "$200",
        description: "manuallaborWork",
        phoneNumber: "(121)239-2982"
      }
    };

    var addMarker = function(feature) {
      var pos = new google.maps.LatLng(feature.position.latitude,
                                         feature.position.longitude);
      var marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        // icon: icons[feature.type].icon,
        icon: feature.icon,
        map: map
      });
      google.maps.event.addListener(marker, 'mouseover', function() {
        playSound(feature.sound);
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(feature.sound)
        showModal(feature)
      });

    };
    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        for (var icon in icons) {
          addMarker(icons[icon]);
        }
        
        var myLocation = new google.maps.Marker({
            position: pos,
            map: map,
            title:"My location"
        });

        google.maps.event.addListener(myLocation, 'mouseover', function() {
          playSound('location');
        });

        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  };

  window.showModal = function(feature){
    $('#newModal').modal('toggle');
    
    $('.md-title').html("<img src='"+feature.icon+"'>")
    $('.md-title').unbind( "mouseover" );
    $('.md-title').on('mouseover', function(){
      playSound(feature.sound)
    });
    
    $('.md-text').text(feature.salary)
    
    $('.md-description').html('<img src="./markers/wat.png">')
    $('.md-description').unbind( "mouseover" );
    $('.md-description').on('mouseover', function(){
      playSound(feature.description)
    });

    $('.md-phone').html('<img src="./markers/phone.png"><span>'+feature.phoneNumber+'</span>')

  };
  
  window.playSound = function(sound){
    $.each($('audio'), function () {
      if (this.paused !== true) this.pause();
    });
    document.getElementById(sound).load()
    document.getElementById(sound).play()
  }


  google.maps.event.addDomListener(window, 'load', initialize);
};

developHer.Views = developHer.Views || {};

(function () {
  'use strict';

  developHer.Views.JobsView = Backbone.View.extend({

    template: JST['app/scripts/templates/jobs.ejs'],

    render: function(){
      loadMap();
      return this.template;
    }

  });

})();
