$(function() {
  var questdata;
  var $table = $("#quests");
  var template = Mustache.compile($("#template").html());
  $.getJSON($("#quests").data("json"), function(data) {
    questdata = data;
    questdata.quests.sort(level_sort);
    $table.children("tbody").html(template(questdata));
  });

  //Handle errors from api call
  var $api_error = $("#api-error");
  $api_error.bind("transitionend", function() {
    $api_error.hide();
    $api_error.removeClass("fade-out");
  });

  $("button", $api_error).click(function(e) {
    $api_error.addClass("fade-out");
  });

  //Handle api call
  $("#submit").click(function(e) {
    var btn = $(this);
    btn.button('loading');
    e.preventDefault();
    var server = $("#server").val();
    var username = $("#username").val();

    var timeout = setTimeout(function() {
      btn.button('reset');
      $("span", $api_error).text(username + " at " + server);
      $api_error.show();
    }, 5000);

    $.getJSON("http://us.battle.net/api/wow/character/" + encodeURIComponent(server) + "/" + encodeURIComponent(username) + "?fields=reputation&jsonp=?", 
    function(data) {
      clearTimeout(timeout);
      $("#character-form").hide();
      $("#character-info").show();
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
      for (var j = 0; j < questdata.quests.length; j++) {
        if (questdata.quests[j].req > data.level) {
          questdata.quests.splice(j--, 1);
        }
      }
      $table.children("tbody").html(template(questdata));

      if (rep.standing < 3) $("#rep-progress").children().addClass("progress-bar-danger");
      else if (rep.standing > 3) $("#rep-progress").children().addClass("progress-bar-success");
      else $("#rep-progress").children().addClass("progress-bar-warning");
      $("#rep-progress").children().css("width", data.reputation[i].value / data.reputation[i].max * 100 + "%");
    });
  });

  //Attach panel collapse toggles
  $(".panel-collapse").on("click", function() {
    $(this).children("button").html(($(this).hasClass("collapsed")) ? "&minus;" : "&plus;");
  });

  //Attach sort listeners to headers
  var $headers = $("th", $table);
  var sorted = 1; //The current column that is sorted;
  var direction; //true -> ascending false -> descending
  $headers.eq(0).click(function() {
    if (sorted === 0) {
      questdata.quests.reverse();
      $(this).removeClass("sorted-up sorted-down");
      direction = !direction;
    }
    else {
      questdata.quests.sort(function(a, b) {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
      });
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
        return a.exp - b.exp;
      });
      $headers.removeClass("sorted-up sorted-down");
      direction = true;
      sorted = 4;
    }
    $(this).addClass(direction ? "sorted-up" : "sorted-down");
    $table.children("tbody").html(template(questdata));
  });
});

function level_sort(a, b) {
  return a.level - b.level;
};
