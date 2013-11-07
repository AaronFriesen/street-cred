$(function () {
  var questdata_json;
  var questdata;
  var template = init_template();
  var $table = $("#quests");
  
  populate_servers();
  
  $.getJSON($("#quests").data("json"), function (data) {
    data.quests.sort(level_sort);
    questdata = data;
    questdata_json = JSON.stringify(data);
    $table.children("tbody").html(template(questdata));
  });

  //Handle errors from api call
  var $api_error = $("#api-error");
  $api_error.on("transitionend", function () {
    $api_error.hide();
  });

  $("button", $api_error).click(function (e) {
    $api_error.addClass("fade-out");
  });
  
  //Handle successfull api call
  var $api_success = $("#api-success");
  $api_success.on("transitionend", function () {
    $api_success.hide();
  });
  
  $("button", $api_success).click(function (e) {
    $api_success.hide();
  });

  //Handle api call
  $("#submit").click(function (e) {
    e.preventDefault();
    var btn = $(this);
    btn.button('loading');
    var server = $("#server").val();
    var username = $("#username").val();
    
    api_call(username, server,  
      function (data) {
        btn.button('reset');
        $api_error.hide();
        $("#character-form").hide();
        var i;
        for (i = 0; i < data.reputation.length; i++) {
          if (data.reputation[i].id === $("#rep-progress").data("city-id")) break;
        }
        $("#level").html(data.level);

        //Remove quests that are not availabe for this character
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
      
        fill_rep_data($("#character-info"), data.reputation[i]);  
      
        $("#username-fill").text(username.charAt(0).toUpperCase() + username.slice(1));
        $("#character-info").show();
        
        $api_success.removeClass("fade-out").show();
        setTimeout(function () {
          $api_success.addClass("fade-out");
        }, 5000);
      },
      function () {
        btn.button('reset');
        $("span", $api_error).text(username + " at " + server);
        $api_error.removeClass("fade-out").show();
      }
    );
  });

  //Attach panel collapse toggles
  $(".panel-collapse").click(function () {
    $(this).children("button").html(($(this).hasClass("collapsed")) ? "&minus;" : "&plus;");
  });

  //Attach sort listeners to headers
  var $headers = $("th", $table);
  var sorted = $headers[1]; //The current column that is sorted;
  var direction = true; //true -> ascending false -> descending
  var sorts = [name_sort, level_sort, req_sort, rep_sort, exp_sort, cat_sort];
  
  for (var i = 0; i < $headers.length; i++) {
    (function (sort_func) {
      $headers.eq(i).click(function () {
        if (sorted === this) {
          questdata.quests.reverse();
          $(this).removeClass("sorted-up sorted-down");
          direction = !direction;
        }
        else {
          questdata.quests.sort(sort_func);
          $headers.removeClass("sorted-up sorted-down");
          direction = true;
          sorted = this;
        }
        $(this).addClass(direction ? "sorted-up" : "sorted-down");
        $table.children("tbody").html(template(questdata));
      });
    })(sorts[i]); //crazy closure stuff from T.S.
  }
  
  //Handle reset of character form
  $("#reset").click(function (e) {
    e.preventDefault();
    $("#character-info").hide();
    questdata = JSON.parse(questdata_json);
    $headers.removeClass("sorted-up sorted-down");
    $headers.eq(1).addClass("sorted-up");
    sorted = $headers[1];
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

function req_sort(a, b) {
  if (a.req === b.req) return name_sort(a,b);
  return a.req - b.req;
}

function rep_sort(a, b) {
  if (a.rep === b.rep) return name_sort(a,b);
  return a.rep - b.rep;
}

function exp_sort(a, b) {
  if (a.exp === b.exp) return name_sort(a,b);
  return a.exp - b.exp;
}

function cat_sort(a, b) {
  if (a.cat < b.cat) return -1;
  else if (a.cat > b.cat) return 1;
  else return name_sort(a,b);
}

//Gets the templating function for filling in the quest table
function init_template() {
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
