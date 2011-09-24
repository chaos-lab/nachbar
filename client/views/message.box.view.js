nachbar.views = nachbar.views || {};

nachbar.views.MessageBoxView = Backbone.View.extend({
  tagName: "div"

  ,className: "none"

  ,events: {
    "submit #message-form" :  "submit"
   ,"keyup #message"       :  "keyup"
  }

  ,initialize: function() {
    this.template = _.template($('#message-box-template').html());
    this.render();
    $("#message-box-wrap").append(this.el);
  }

  //render message box using template
  ,render: function() {
    $(this.el).html(this.template(this.options));
  }

  //hide
  ,hide: function() {
    $(this.el).addClass("none");
  }

  //show
  ,show: function() {
    $(this.el).removeClass("none");
  }

  //add message
  ,add: function(from, msg) {
    if(!msg) return;

    dt = new Date;
    msg = msg.replace(/\\n/g, "<br/>");
    this.$("#lines").prepend($('<p>').append(dt.toLocaleTimeString(), $('<b>').text(from), msg));
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

