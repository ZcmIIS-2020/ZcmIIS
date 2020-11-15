$(document).ready(function() {
    $("#showTime").click(function() {
        $("#settime").slideToggle("fast");
        $("#label").css({
            display: 'none'
        });
    });
    $("#showTime").hover(function(evt) {
        var xPos = $(window).width() - 165; //(evt.pageX || evt.clientX || evt.offsetX || evt.x) - 50;
        var yPos = $(window).height() - 95;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var da = date.getDate();
        var day = date.getDay();
        $("#label").css({
            left: xPos,
            top: yPos,
            display: 'block',
        });
        $("#label").html(year + "年" + month + "月" + da + "日<br/>星期" + "日一二三四五六".charAt(day));
    });
    $("#showTime").mouseleave(function(evt) {
        $("#label").css({
            display: 'none'
        });
    });

});