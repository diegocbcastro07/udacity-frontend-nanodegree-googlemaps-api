/**
 * Google Maps Samples Multiple Markers
 * 
 * English:
 * Sample of usage with multiple markers inside the map.
 * 
 * Portuguese: 
 * Exemplo de uso com multiplos marcadores dentro do mapa.
 * 
 */

  /**
   * Creating global variables
   * Criando variáveis globais
  */

let map;
let markers = [];
let marker = {};

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
        zoom: 13
      }
    );

  /**
   * Creating array with locations
   * Criando lista com as localizações
  */

    let locations = [
      {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
      {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
      {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
      {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
      {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
      {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
      ];

  /**
   * Creating info window
   * Criando janela de informações
  */

    let largeInfoWindow = new google.maps.InfoWindow();

  /**
   * Creating variable to zooming the map to show all the markers
   * Criando uma variável para ampliar o mapa para mostrar todos os marcadores
  */

    let bounds = new google.maps.LatLngBounds();

  /**
   * Loop to iterate in all localizations configuring the marker and push into markers array
   * Loop para iterar sobre as localizações e 
   * configurar o marcador e inserir no array de marcadores
  */

    for (let i = 0; i < locations.length; i++) {

      let position = locations[i].location;
      let title = locations[i].title;

      marker = new google.maps.Marker({
        'map' : map,
        'position' : position,
        'title' : title,
        'animation' : google.maps.Animation.DROP,
        'id' : i
      });
      markers.push(marker);

      bounds.extend(marker.position);

      marker.addListener('click', function () {
          populateInfoWindow(this, largeInfoWindow);
        }
      );
    };  // End Loop / Fim do Loop

  /**
   *  Function to populate the info window based on marker
   *  Função para popular a janela de informações baseada no marcador
  */

    function populateInfoWindow (marker, infowindow) {
      if(infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
      }
    };

  /**
   * Zooming the map to show all the markers based on markers created
   * Ampliar o mapa para mostrar todos os marcadores com base nos marcadores criados
  */

    map.fitBounds(bounds);
};
