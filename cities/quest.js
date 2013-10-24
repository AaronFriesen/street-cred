$(function() {
    var questdata;
    var $table = $("#quests");
    var template = Mustache.compile($("#template").html());
    $.getJSON($("#quests").data("json"), function(data) {
        questdata = data;
        $table.children("tbody").html(template(questdata));
    });
    
    //Attach sort listeners to headers
    var $headers = $("th", $table);
    var sorted = -1; //The current column that is sorted;
    var direction; //true -> ascending false -> descending
    
    $headers.eq(0).click(function() {
        if (sorted === 0) {
            questdata.quests.reverse();
            $(this).removeClass("sorted-up sorted-down");
            direction = !direction;
        } else {
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
        } else {
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
        } else {
            questdata.quests.sort(req_sort);
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
        } else {
            questdata.quests.sort(rep_sort);
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
        } else {
            questdata.quests.sort(exp_sort);
            $headers.removeClass("sorted-up sorted-down");
            direction = true;
            sorted = 4;
        }
        console.log($(this));
        $(this).addClass(direction ? "sorted-up" : "sorted-down");
        $table.children("tbody").html(template(questdata));
    });
});

function name_sort(a, b) {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    else return 0;
}

function level_sort(a, b) {
    return a.level - b.level;
}

function req_sort(a, b) {
    return a.req - b.req;
}

function rep_sort(a, b) {
    return a.rep - b.rep;
}

function exp_sort(a, b) {
    return a.exp - b.exp;
}
