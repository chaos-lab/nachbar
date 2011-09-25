nachbar.views = nachbar.views || {};

nachbar.views.NavigationView = Backbone.View.extend({

  selected: "-1"

  ,initialize: function() {
    var self = this;
    this.$(".navigation-item").live("click", function() {
      self.select($(this).attr("key"));
    })

    this.template = _.template("<div class='navigation-item' key='<%= key%>'><span><%= name%></span></div>");
  }

  //render message box using template
  ,render: function() {
    $(this.el).html(this.template(this.options));
  }

  //add navigation item
  ,add: function(key, name) {
    if(!name) return this;

    $(this.el).append(this.template({key: key, name: name}));
    return this;
  }

  //select
  ,select: function(key) {
    var item = this.$(".navigation-item[key='" + key + "']");
    if (item.length == 0) return this;
    if (this.selected == key) return this;

    this.$(".navigation-item[key='" + this.selected + "']").removeClass("selected");;
    item.addClass("selected");

    this.selected = key;
    this.trigger("selectedChanged");

    if (item.data("animate")) {
      clearInterval(item.data("animate"));
      item.removeData("animate");
    }

    return this;
  }

  //remove
  ,remove: function(key) {
    var item = this.$(".navigation-item[key='" + key + "']");
    if (item.length == 0) return this;

    if (item.data("animate")) {
      clearInterval(item.data("animate"));
    }

    item.remove();
  }

  //highlight
  ,highlight: function(key) {
    var item = this.$(".navigation-item[key='" + key + "']");
    if (item.length == 0) return this;
    if (this.selected == key) return this;

    var self = this;
    var timer = setInterval(function() { item.toggleClass("selected"); }, 200);
    item.data("animate", timer);
  }

})

