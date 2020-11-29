$(document).ready(function() {
    $("#showTime").click(function() {
        // $("#settime").slideToggle("fast");
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


    $("#attack_insp").hover(function(evt) {
        var xPos = 0; //(evt.pageX || evt.clientX || evt.offsetX || evt.x) - 50;
        var yPos = $(window).height() - 80;
        $("#label").css({
            left: xPos,
            top: yPos,
            display: 'block',
        });
        $("#label").html("入侵动态监测");
    });
    $("#attack_insp").mouseleave(function(evt) {
        $("#label").css({
            display: 'none'
        });
    });

    $("#rail_insp").hover(function(evt) {
        var xPos = 20; //(evt.pageX || evt.clientX || evt.offsetX || evt.x) - 50;
        var yPos = $(window).height() - 80;
        $("#label").css({
            left: xPos,
            top: yPos,
            display: 'block',
        });
        $("#label").html("轨道结构安全动态监测");
    });
    $("#rail_insp").mouseleave(function(evt) {
        $("#label").css({
            display: 'none'
        });
    });

    $("#tunnel_insp").hover(function(evt) {
        var xPos = 70; //(evt.pageX || evt.clientX || evt.offsetX || evt.x) - 50;
        var yPos = $(window).height() - 80;
        $("#label").css({
            left: xPos,
            top: yPos,
            display: 'block',
        });
        $("#label").html("隧道结构安全动态监测");
    });
    $("#tunnel_insp").mouseleave(function(evt) {
        $("#label").css({
            display: 'none'
        });
    });

});