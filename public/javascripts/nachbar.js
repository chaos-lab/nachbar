var nachbar = {
  initialize: function() {
    // put instances directly on nachbar for ease of use
    
    // create map view
    this.mapView = new nachbar.views.MapView;
    this.map = this.mapView.map;

    // create me
    this.me = new nachbar.models.Me;
    this.me.view = new nachbar.views.MeMapView({model: this.me, map: nachbar.map});
    this.me.controller = new nachbar.controllers.MeController;

    // create nearbys
    this.nearbys = new nachbar.models.UserCollection;
    this.nearbys.controller = new nachbar.controllers.NearbysController;
    
    // create message views
    this.messageBoxManager = new nachbar.controllers.MessageBoxesController;

    // socket.io specific code, remote interface
    this.socket = io.connect();
    this.socket.socketController = new nachbar.controllers.SocketController;
  }
}

$(function() {
  nachbar.initialize();
})
