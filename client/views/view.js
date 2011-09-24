nachbar.views = nachbar.views || {};

nachbar.views.showTip = function(msg, type, timeout) {
  if (!msg) return;
  type = type || "notice";
  timeout = timeout || 5000;

  if($("#information-banner").children().length > 0) {
    setTimeout( function() { nachbar.views.showTip(msg, type, timeout); }, 1000);
    return;
  }

  var tip = $("<div>").html(msg).addClass(type).appendTo($("#information-banner"));
  setTimeout(function() { tip.remove(); }, timeout);
}
