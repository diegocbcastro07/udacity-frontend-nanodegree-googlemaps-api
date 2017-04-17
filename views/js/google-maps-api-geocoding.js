/**
 * Google Maps Samples Geocoding Library
 * 
 * English:
 * Sample of usage with Geocoding Library to zoom specific area in the map.
 * 
 * Portuguese: 
 * Amostra de uso da biblioteca de localização para zoom em áreas do mapa.
 * 
 */

  /**
   * Creating global variables
   * Criando variáveis globais
  */
let map;
let markers = [];
let marker = {};
let polygon = null;
let area = {};

function initMap() {

  /**
   * Creating initial map
   * Criando mapa inicial
  */

    map = new google.maps.Map (
      document.getElementById('map'), 
      {
        center: {
          lat : 40.7413549,
          lng : -73.9980244
        },
        zoom: 13,
        styles : styles,
        mapTypeControl: false
      }
    );

  /**
   * Creating array with locations
   * Criando lista com as localizações
  */

    let locations = [
      {title : 'Park Ave Penthouse', location : {lat : 40.7713024, lng : -73.9632393}},
      {title : 'Chelsea Loft', location : {lat : 40.7444883, lng : -73.9949465}},
      {title : 'Union Square Open Floor Plan', location : {lat : 40.7347062, lng : -73.9895759}},
      {title : 'East Village Hip Studio', location : {lat : 40.7281777, lng : -73.984377}},
      {title : 'Tribeca Artsy Bachelor Pad', location : {lat : 40.7195264, lng : -74.0089934}},
      {title : 'Chinatown Homey Space', location : {lat : 40.7180628, lng : -73.9961237}}
    ];

  /**
   * Creating info window
   * Criando janela de informações
  */

    let largeInfoWindow = new google.maps.InfoWindow();

  /**
   * Drawaing Manager
   * Gerenciador dos desenhos
  */

    let drawingManager = new google.maps.drawing.DrawingManager(
      {
        drawingMode : google.maps.drawing.OverlayType.POLYGON,
        drawingControl : true,

        drawingControlOptions : {
          position : google.maps.ControlPosition.TOP_LEFT,

          drawingModes : [
            google.maps.drawing.OverlayType.POLYGON
          ]
        }

      }
    );

  /**
   * Changes of the styles of the markers
   * Mundanças dos estilos dos marcadores
  */

    let defaultMarker = makeMarkerIcon('ffffff');
    let lightMarker = makeMarkerIcon('0091ff');

  /**
   * Loop to iterate in all localizations configuring the marker and push into markers array
   * Loop para iterar sobre as localizações e 
   * configurar o marcador e inserir no array de marcadores
  */

    for (let i = 0; i < locations.length; i++) {

      let position = locations[i].location;
      let title = locations[i].title;

      marker = new google.maps.Marker({
        'position' : position,
        'title' : title,
        'icon' : defaultMarker,
        'animation' : google.maps.Animation.DROP,
        'id' : i
      });
      markers.push(marker);

      marker.addListener('click', function () {
          populateInfoWindow(this, largeInfoWindow);
        }
      );

      marker.addListener('mouseover', function () {
          this.setIcon(lightMarker);
        }
      );
      marker.addListener('mouseout', function () {
          this.setIcon(defaultMarker);
        }
      );
    };  // End Loop / Fim do Loop
    
    /**
     * Event listeners
     * Eventos
     */

    document.getElementById('show').addEventListener('click', show);

    document.getElementById('hide').addEventListener('click', hide);

    document.getElementById('toggle-drawing').addEventListener('click', 
      () => {
        toggleDrawing(drawingManager);
      }
    );

    document.getElementById('zoom-search').addEventListener('click', 
      () => {
        search();
      }
    );

    drawingManager.addListener('overlaycomplete', 
      (event) => {
        if (polygon){
          polygon.setMap(null)
          hide();
        };
        drawingManager.setDrawingMode(null);
        polygon = event.overlay;
        polygon.setEditable(true);
        searchWithinPolygon();

        polygon.getPath().addListener('set_at', searchWithinPolygon());
        polygon.getPath().addListener('insert_at', searchWithinPolygon());

        area = google.maps.geometry.spherical.computeArea(polygon.getPath());
        window.alert((Math.round(area * 100) / 100) + " Square Meters");
      }
    );
};

  /**
   *  Function to populate the info window based on marker
   *  Função para popular a janela de informações baseada no marcador
  */

    function populateInfoWindow (marker, infowindow) {
      if(infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        let streetViewService = new google.maps.StreetViewService();
        let radius = 50;

        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });

        /**
         * Function to get Street View by location
         * Função para obter o street view pela localização
        */
          
          let getStreetView = (data, status) => {
            if (status == google.maps.StreetViewStatus.OK){
              let nearStreetViewLocation = data.location.latLng;
              let heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.getPosition()
              );
              infowindow.setContent('<div>' + marker.title +  '</div><div id="pano"></div>');
              let panoramaOptions = {
                position : nearStreetViewLocation,
                pov: {
                  heading : heading,
                  pitch : 30 
                }
              };
              
              let panorama = new google.maps.StreetViewPanorama (document.getElementById('pano'),panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + ' ' + marker.getPosition() + '</div>');
            }
          };

        streetViewService.getPanoramaByLocation(marker.getPosition(), radius, getStreetView);
        infowindow.open(map, marker);
      }
    };

  /**
   *  Function to show all markers
   *  Função para mostrar todos os marcadores
  */

    function show() {
      let bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    };

  /**
   * Function to hide all markers
   * Função para esconder todos os marcadores
  */
    
    function hide() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };

  /**
   * Function to hide all markers
   * Função para esconder todos os marcadores
  */
    
    function makeMarkerIcon(markerColor) {
      let markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21, 34));
      return markerImage;
    };

  /**
   * Function to toggle the drawing manager
   * Função de controle para o gerenciador de desenhos
  */
    
    function toggleDrawing (drawingManager) {
      if (drawingManager.map) {
        drawingManager.setMap(null);

        if (polygon) {
          polygon.setMap(null);
        }

      } 
      else {
        drawingManager.setMap(map);
      }
    };

  /**
   * Function to toggle the drawing manager
   * Função de controle para o gerenciador de desenhos
  */
    
    function searchWithinPolygon () {
      for (let i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].getPosition(), polygon)) {
          markers[i].setMap(map);
        } else {
          markers[i].setMap(null);
        }
      };
    };

  /**
   * Function to zoom area based on the user search
   * Função para zoom na área baseada na pesquisa do usuário
  */
    
    function search () {
      let geocoder = new google.maps.Geocoder();
      let address = document.getElementById('search').value;

      if (address == '') 
        window.alert('Please enter an area, or address.');
      else {
        geocoder.geocode(
          {
            address : address
          },
            function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
                window.alert(results[0].formatted_address);
              } else {
                window.alert('We could not find that location!');
              }
            }          
        );
      }
      
    };

