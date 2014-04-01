/*$( document ).ready(function() {
    
    $("#loginform").submit( function (event) {
       $.post("/login", $("#loginform").serialize() , function(res) {
           
       });
    });
    
    $("#registerForm").submit( function (event) {
       $.post("/signup", $("#loginform").serialize() , function(res) {
           
       });
    });

    $.growl();
    
});*/


require(["jquery", "slingle"], function($, Slingle) {
    // okay the main application is loaded now

    // disable the loading animation
    var container = document.getElementById("initialLoadingAnimation");
    $(container).remove();

    // show the main content of the page
    $("#dynamic-content").slideDown(function() {
        Slingle.init({
            globalLoadingSelector: "#topNavigation",
            initialPage: "",
            main_container: "#main-container",
            handleInitialLoad: true
        });
    });
});