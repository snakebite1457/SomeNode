$( document ).ready(function() {
    
    $("#loginform").submit( function (event) {
       $.post("/login", $("#loginform").serialize() , function(res) {
           
       });
    });
    
    $("#registerForm").submit( function (event) {
       $.post("/signup", $("#loginform").serialize() , function(res) {
           
       });
    });
    
});