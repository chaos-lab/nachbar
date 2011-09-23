nachbar.views = nachbar.views || {};

nachbar.views.NavigationView = Backbone.View.extend({

  selected: ""

  ,initialize: function() {
    var self = this;
    this.$(".navigation-item").live("click", function() {
      self.select($(this).attr("key"));
    })

    this.template = _.template("<div class='navigation-item' key='<%= name%>'><span><%= name%></span></div>");
  }

  //render message box using template
  ,render: function() {
    $(this.el).html(this.template(this.options));
  }

  //add navigation item
  ,add: function(name) {
    if(!name) return this;

    $(this.el).append(this.template({name: name}));
    return this;
  }

  //select
  ,select: function(name) {
    if (this.$(".navigation-item[key='" + name + "']").length == 0) return this;
    if (this.selected == name) return this;

    this.$(".navigation-item").removeClass("selected");
    this.$(".navigation-item[key='" + name + "']").addClass("selected");

    this.selected = name;
    this.trigger("selectedChanged");
    return this;
  }

})

