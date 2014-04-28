
requirejs.config({
    paths: {
        app: "main",
        slingle: "lib/slingle",
        bootstrap: "../components/bootstrap/dist/js/bootstrap",
        jquery: "../components/jquery/dist/jquery",
        requirejs: "../components/requirejs/require",
        spinjs: "../components/spinjs/jquery.spin",
        spin: "../components/spinjs/spin",
        growl: "../components/bootstrap-growl/bootstrap-growl.min",
        hasher: "../components/hasher/dist/js/hasher",
        signals: "../components/js-signals/dist/signals",
        bullseye: "../components/bullseye/jquery.bullseye-1.0"
    },
    shim: {
        bootstrap: {
            deps: [
                "jquery"
            ]
        },
        spinjs: {
            deps: [
                "spin"

            ],
            exports: 'jQuery.fn.spin'

        },
        // it seems to be the best way to make css dependencies as shim-deps...
        // i like the declerative way.. i dont want to write require(["css! ......
        app: {
            deps: [
                "css!/css/style"
            ]
        },
        hasher: {
            deps: [
                "signals"
            ]
        }
        // it seems to be the best way to make css dependencies as shim-deps...
        // i like the declerative way.. i dont want to write require(["css! ......
    },
    // this is required for require-css plugin to map css!/ routes
    map: {
        '*': {
            'css': '../components/require-css/css'
        }
    }
});

// load the loading animation which has no dependencies
// to show a spinner while loading other javascript files and other css
require(["spin"], function (Spinner) {
    // this is fucking awesome! only 15-20kB are transfered before the loading animation is shown
    // fucking nice feeling for the user
    // TODO: add a logo to show with the loading spinner but keep it small :P
    var container = document.getElementById("initialLoadingAnimation");
    var spinner = new Spinner().spin(container);
    // this timeout here is just for debug purpose!
    setTimeout(function () {
        // okay lets load our main application ;)
        require(["app"], function(app) {

        });
    }, 1);
});