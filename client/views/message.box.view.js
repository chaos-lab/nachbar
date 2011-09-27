nachbar.views = nachbar.views || {};

nachbar.views.MessageBoxView = Backbone.View.extend({
  tagName: "div"

  ,className: "none"

  ,events: {
    "submit #message-form" :  "submit"
   ,"resize #message-form" :  "resize"
   ,"keyup #message"       :  "keyup"
  }

  ,initialize: function() {
    this.render();
  }

  //render message box using template
  ,render: function() {
    this.template = _.template($('#message-box-template').html());
    $(this.el).html(this.template(this.options));
    $("#message-box-wrap").append(this.el);
  }

  //hide
  ,hide: function() {
    $(this.el).addClass("none");
  }

  //show
  ,show: function() {
    $(this.el).removeClass("none");
    this.$("#message-form").trigger("resize");
  }

  ,resize: function() {
    var parentWidth = this.$("#message-form").width();
    this.$("#message-form textarea").css("width", parentWidth - 100 + "px");
  }

  //add message
  ,add: function(from, msg, time) {
    if(!msg) return;

    time = time || new Date;
    msg = msg.replace(/\\n/g, "<br/>");
    this.$("#lines").prepend($('<p>').append(time.toLocaleTimeString(), $('<b>').text(from), msg));
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

