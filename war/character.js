$(function () {
  populate_servers();
  
  //Handle errors from api call
  var $api_error = $("#api-error");
  $api_error.on("transitionend", function () {
    $api_error.hide();
  });

  $("button", $api_error).click(function (e) {
    $api_error.addClass("fade-out");
  });

  //Attach listener to submit button
  $("#submit").click(function (e) {
    e.preventDefault();
    var btn = $(this);
    btn.button("loading");
    
    var username = $("#username").val();
    var server =  $("#server").val()
    api_call(username, server,
      function (data) {
        btn.button("reset");
        $api_error.hide();
        var $user_info = $("#user-info");
        $("#username-fill").text(data.name);
        
        var races = {"1":{"name":"Human","side":"Alliance"},"5":{"name":"Undead","side":"Horde"},
          "11":{"name":"Draenei","side":"Alliance"},"7":{"name":"Gnome","side":"Alliance"},
          "8":{"name":"Troll","side":"Horde"},"2":{"name":"Orc","side":"Horde"},
          "3":{"name":"Dwarf","side":"Alliance"},"4":{"name":"Night Elf","side":"Alliance"},
          "10":{"name":"Blood Elf","side":"Horde"},"22":{"name":"Worgen","side":"Alliance"},
          "6":{"name":"Tauren","side":"Horde"},"24":{"name":"Pandaren","side":"Nuetral"},
          "25":{"name":"Pandaren","side":"Alliance"},"26":{"name":"Pandaren","side":"Horde"},
          "9":{"name":"Goblin","side":"Horde"}};
          
        var race = races[data.race.toString()];
        $("#race").text(race.name);
        
        var classes = {"3":"Hunter","4":"Rogue","1":"Warrior","2":"Paladin",
                       "7":"Shaman","8":"Mage","5":"Priest","6":"Death Knight",
                       "11":"Druid","9":"Warlock","10":"Monk"};
        $("#class").text(classes[data.class.toString()]);
        
        $("#side").text(race.side);
        
        if (race.side === "Nuetral") {
          $("#side-img").attr("src","");
        } else {
          $("#side-img").attr("src","http://us.battle.net/wow/static/images/icons/" + 
            race.side.charAt(0).toLowerCase() + race.side.slice(1) + ".png");
        }
        
        $("#level").text(data.level);
        
        $user_info.show();
        
        //Fill in city reputations.
        var $progress_bars = $(".progress", $user_info);
        var ids = [];
        for (var i = 0; i < $progress_bars.length; i++) {
          ids.push($progress_bars.eq(i).data("city-id"));
        }
        console.log(ids);
        for (var i = 0; i < data.reputation.length; i++) {
          var index = ids.indexOf(data.reputation[i].id);
          if (index != -1) {
            console.log("hit");
            fill_rep_data($progress_bars.eq(index).parent("div"), data.reputation[i]);
          }
        }
      },
      function () {
        btn.button("reset");
        $("span", $api_error).text(username + " at " + server);
        $api_error.removeClass("fade-out").show();
      });
  });

});
