
define(["jquery", "bootstrap"], function($) {
    var instance = null;

    var module = function VideoDetails() {
        var me = instance;

        if (me == null) {
            instance = this;
            me = this;
        }

        this.init = function() {
            //me.querySystemDetails("http://127.0.0.1:9600", { });
        }

        this.createServerUrl = function(target) {

        }

        this.showDetailsPageForServer = function (server) {


        }

        this.querySystemDetails = function(targetServer, cb) {
            $.ajax({
                type: "get",
                url: "",
                headers: { "x-target-server": targetServer },
                success: function (data) {
                    cb(null, data);
                },
                fail: function (err) {
                    cb(err, null);
                },
                error: function (err) {
                    cb(err, null);
                }
            });
        }
    }

    return module;
});