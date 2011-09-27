nachbar.views = nachbar.views || {};

nachbar.views.ChatBoxView = Backbone.View.extend({
  tagName: "div"

  // invisible initially
  ,className: "none message-box chat-box ui-dialog ui-widget ui-widget-content ui-corner-all"

  ,events: {
    "submit #message-form" :  "submit"
   ,"keyup #message"       :  "keyup"
   ,"click a.ui-dialog-titlebar-close" : "close"
   ,"hover a.ui-dialog-titlebar-close" : "hover"
   ,"dblclick .ui-dialog-titlebar" : "toggleContent"
  }

  ,initialize: function() {
    this.render();
  }

  //render message box using template
  ,render: function() {
    _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
    this.template = _.template($('#chat-box-template').html());

    $(this.el).html(this.template(this.options));
    $("body").append(this.el);

    this.$("a.ui-dialog-titlebar-close").css("cursor", "pointer");
    $(this.el).resizable({alsoResize: this.$("#lines")}).draggable({ containment: 'document', handle: '.ui-dialog-titlebar' });

    return this;
  }

  //hide
  ,hide: function() {
    $(this.el).addClass("none");

    return this;
  }

  //show
  ,show: function() {
    $(this.el).removeClass("none");
    this.$(".ui-dialog-content").removeClass("none");

    return this;
  }

  //visible
  ,isMinimized: function() {
    return this.$(".ui-dialog-content").hasClass("none");
  }

  //highlight
  ,highlight: function() {
    // if it's already alerting
    if(this.alerter) return;

    var self = this;
    this.alerter = setInterval(function() {$(self.el).effect('highlight');}, 1000);

    return this;
  }

  //close
  ,close: function() {
    this.hide();
  }

  ,hover: function() { 
    this.$("a.ui-dialog-titlebar-close").toggleClass("ui-state-hover"); 
  }

  ,resize: function() {
    var parentWidth = this.$("#message-form").width();
    this.$("#message-form textarea").css("width", parentWidth - 100 + "px");
  }

  ,toggleContent: function() {
    this.$(".ui-dialog-content").toggleClass("none");
    $(this.el).css("height", "auto");

    if (this.alerter) { 
      clearInterval(this.alerter);
      this.alerter = null;
    }
  }

  //add message
  ,add: function(from, msg, time) {
    if(!msg) return;

    time = time || new Date;
    msg = msg.replace(/\\n/g, "<br/>");
    this.$("#lines").prepend($('<p>').append(time.toLocaleTimeString(), $('<b>').text(from), msg));

    return this;
  }

  //submit message
  ,submit: function() {
    var msg = this.$('#message').val();
    if (!(/\S/).test(msg)) return false;

    this.trigger("sendmessage", msg);
    this.$('#message').val('').focus();
    return false;
  }

  // key up
  ,keyup: function(event) {
    if(event.keyCode == 13){
      this.$("#message-form button").click();
    }
  }

})

