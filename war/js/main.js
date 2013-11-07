function populate_servers() {
  $.getJSON("/servers.json", function (data) {
    var server = document.getElementById("server");
    for (var i = 0; i < data.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", data[i].slug);
      option.innerText = data[i].name;
      server.appendChild(option);
    }
  });
}

function contains(id, arr) {
  for (i = 0; i < arr.length; i++)
    if (id === arr[i].id) return true;
  return false;
}

function fill_rep_data(target, rep) {
   var standings = ["Hated", "Hostile", "Unfriendly", "Nuetral", "Friendly", "Honored", "Revered", "Exalted"];
    $("#standing", target).html(standings[rep.standing]);
    $("#points", target).html(rep.value);
    $("#points-left", target).html(rep.max - rep.value);

    var $progress = $("#rep-progress", target).children().eq(0);
    $progress.removeClass("progress-bar-danger progress-bar-success progress-bar-warning");
    if (rep.standing < 3) progress.addClass("progress-bar-danger");
    else if (rep.standing > 3) $progress.addClass("progress-bar-success");
    else $progress.addClass("progress-bar-warning");
    
    $progress.css("width", rep.value / rep.max * 100 + "%");
}

function api_call(username, server, success, error) {
  var timeout = setTimeout(error, 5000);
  $.getJSON("http://us.battle.net/api/wow/character/" + encodeURIComponent(server) + "/" + encodeURIComponent(username) + "?fields=reputation&jsonp=?", 
    function (data) {
      clearTimeout(timeout);
      success(data);
    }
  );
}
    
      
