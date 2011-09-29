nachbar.views = nachbar.views || {};

nachbar.views.ToolbarView = Backbone.View.extend({
  tagName: "div"

  ,id: "toolbar"

  ,className: "ui-widget-header ui-corner-all"

  ,events: {
    "click #range-set input": "range_changed"
  }

  ,initialize: function() {
    this.render();
  }

  //render using template
  ,render: function() {
    this.template = _.template($('#toolbar-template').html());

    $(this.el).html(this.template());
    $("#toolbar-wrap").append(this.el);
    $(this.el).buttonset();

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

    return this;
  }

  //visible
  ,isVisible: function() {
    return !$(this.el).hasClass("none");
  }

  ,range_changed: function(e) {
    var range = parseInt($(e.target).val());
    nachbar.me.set({ range: range });
  }

})

