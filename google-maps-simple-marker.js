let map;
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
   * JSON Object with location
   * Objeto JSON com a localização
  */

  let markerLocation = {
    lat : 40.719526, 
    lng : -74.0089934
  };

  /**
   * Creating a new Marker inside the map
   * Criando um novo marcador dentro do mapa
  */

  let marker = new google.maps.Marker (
    {
      position : markerLocation,
      map : map,
      title : 'First Marker Google Maps API =)',
    }
  );

  /**
   * Creating a info window
   * Criando janela de informação
  */

  let infoWindow = new google.maps.InfoWindow(
    {
      content : "Info Window"
    }
  );

  /**
   * Adding Event Listener to a marker
   * Adicionando Leitor de Evento ao marcador
  */

  marker.addListener(
    'click',
    () => {
      infoWindow.open(map, marker); 
    }
  );
}