$(function() {
  var questdata_json;
  var questdata;
  var template = initTemplate();
  var $table = $("#quests");
  $.getJSON($("#quests").data("json"), function(data) {
    data.quests.sort(level_sort);
    questdata = data;
    questdata_json = JSON.stringify(data);
    $table.children("tbody").html(template(questdata));
  });

  //Handle errors from api call
  var $api_error = $("#api-error");
  $api_error.on("transitionend", function() {
    $api_error.hide();
  });

  $("button", $api_error).click(function(e) {
    $api_error.addClass("fade-out");
  });
  
  var $api_success = $("#api-success");
  $api_success.on("transitionend", function() {
    $api_success.hide();
  });
  
  $("button", $api_success).click(function(e) {
    $api_success.hide();
  });

  //Handle api call
  $("#submit").click(function(e) {
    e.preventDefault();
    var btn = $(this);
    btn.button('loading');
    var server = $("#server").val();
    var username = $("#username").val();

    var timeout = setTimeout(function() {
      btn.button('reset');
      $("span", $api_error).text(username + " at " + server);
      $api_error.removeClass("fade-out").show();
    }, 5000);

    $.getJSON("http://us.battle.net/api/wow/character/" + encodeURIComponent(server) + "/" + encodeURIComponent(username) + "?fields=reputation&jsonp=?", 
    function(data) {
      clearTimeout(timeout);
      btn.button('reset');
      $api_error.hide();
      $("#character-form").hide();
      var i;
      for (i = 0; i < data.reputation.length; i++) {
        if (data.reputation[i].id === $("#rep-progress").data("city-id")) break;
      }
      var standings = ["Hated", "Hostile", "Unfriendly", "Nuetral", "Friendly", "Honored", "Revered", "Exalted"];
      var rep = data.reputation[i];
      $("#standing").html(standings[rep.standing]);
      $("#level").html(data.level);
      $("#points").html(rep.value);
      $("#points-left").html(rep.max - rep.value);

      //Remove quests that are not availabe for this character
      console.log(data.class + " " + data.race);
      for (var j = 0; j < questdata.quests.length; j++) {
        var quest = questdata.quests[j];
        if (quest.req > data.level) {
          questdata.quests.splice(j--, 1);
        } else if (quest.class && !contains(data.class, quest.class)) {
          questdata.quests.splice(j--, 1);  
        } else if (quest.race && !contains(data.race, quest.race)) {
          questdata.quests.splice(j--, 1);
        }
      }
      $table.children("tbody").html(template(questdata));

      $("#rep-progress").children().removeClass("progress-bar-danger progress-bar-success progress-bar-warning");
      if (rep.standing < 3) $("#rep-progress").children().addClass("progress-bar-danger");
      else if (rep.standing > 3) $("#rep-progress").children().addClass("progress-bar-success");
      else $("#rep-progress").children().addClass("progress-bar-warning");
      
      $("#username-fill").text(username.charAt(0).toUpperCase() + username.slice(1));
      $("#character-info").show();
      
      $("#rep-progress").children().css("width", data.reputation[i].value / data.reputation[i].max * 100 + "%");
      
      setTimeout(function() {
        $api_success.addClass("fade-out");
      }, 5000);
      $api_success.removeClass("fade-out").show();
    });
  });

  //Attach panel collapse toggles
  $(".panel-collapse").click(function() {
    $(this).children("button").html(($(this).hasClass("collapsed")) ? "&minus;" : "&plus;");
  });

  //Attach sort listeners to headers
  var $headers = $("th", $table);
  var sorted = 1; //The current column that is sorted;
  var direction =  true; //true -> ascending false -> descending
  $headers.eq(0).click(function() {
    if (sorted === 0) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(name_sort);
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 0;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });

  $headers.eq(1).click(function() {
    if (sorted === 1) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(level_sort);
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 1;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });

  $headers.eq(2).click(function() {
    if (sorted === 2) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(function(a, b) {
        if (a.req === b.req) return name_sort(a,b);
        return a.req - b.req;
      });
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 2;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });

  $headers.eq(3).click(function() {
    if (sorted === 3) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(function(a, b) {
        if (a.rep === b.rep) return name_sort(a,b);
        return a.rep - b.rep;
      });
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 3;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });

  $headers.eq(4).click(function() {
    if (sorted === 4) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(function(a, b) {
        if (a.exp === b.exp) return name_sort(a,b);
        return a.exp - b.exp;
      });
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 4;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });
  
  $headers.eq(5).click(function() {
    if (sorted === 5) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(function(a, b) {
        if (a.cat < b.cat) return -1;
        else if (a.cat > b.cat) return 1;
        else return name_sort(a,b);
      });
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 5;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });
  
  //Handle reset of character form
  $("#reset").click(function(e) {
    e.preventDefault();
    $("#character-info").hide();
    questdata = JSON.parse(questdata_json);
    $headers.removeClass("sorted-up sorted-down");
    $headers.eq(1).addClass("sorted-up");
    sorted = 1;
    direction = true;
    $table.children("tbody").html(template(questdata));
    $("#character-form").show();
  });
});

function level_sort(a, b) {
  if (a.level === b.level) return name_sort(a,b);
  return a.level - b.level;
};

function name_sort(a,b) {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  else return 0;
}

function contains(id, arr) {
  for (i = 0; i < arr.length; i++)
    if (id === arr[i].id) return true;
  return false;
}

//Gets the templating function for filling in the quest table
function initTemplate() {
  return Mustache.compile(
    "{{#quests}}" +
    "<tr>" +
    "  <td>" +
    "    <a href='http://www.wowhead.com/quest={{id}}'>{{name}}</a>{{#class.length}}<br>{{/class.length}}" +
    "    <span class='pull-rgiht'>{{#class}}<small><a href='http://www.wowhead.com/class={{id}}'>{{name}}</a></small>{{/class}}</span>" +
    "    <span class='pull-right'>{{#race}}<small><a href='http://www.wowhead.com/race={{id}}'>{{name}}</a></small>{{/race}}</span>" +
    "  </td>" +
    "  <td>" +
    "    {{level}}<br><small>{{type}}</small>" +
    "  </td>" +
    "  <td>{{req}}</td>" +
    "  <td>{{rep}}</td>" +
    "  <td>{{exp}}</td>" +
    "  <td>{{cat}}</td>" +
    "</tr>" +
    "{{/quests}}"
  );
}
