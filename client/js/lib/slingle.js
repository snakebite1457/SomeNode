window.slingle = null;

define(["jquery", "bootstrap", "spinjs", "hasher", "growl", "bullseye"], function ($, _bootstrap, Spinner, hasher) {

    var cl = function Slingle() {
        var me = this;
        this.hasher = hasher;
        this._listeners = {};

        this.configureGrowl = function () {
            $.growl.default_options = {
                ele: "body",
                //type: "info",
                allow_dismiss: true,
                position: {
                    from: "bottom",
                    align: "right"
                },
                offset: 20,
                spacing: 10,
                z_index: 2e10,
                fade_in: 400,
                delay: 5000,
                pause_on_mouseover: true,
                onGrowlShow: null,
                onGrowlShown: null,
                onGrowlClose: null,
                onGrowlClosed: null,
                template: {
                    icon_type: 'class',
                    container: '<div class="col-xs-10 col-sm-10 col-md-3 alert">',
                    dismiss: '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>',
                    title: '<strong>',
                    title_divider: '',
                    message: ''
                }
            };

        }

        this.setGlobalAjaxAnimation = function () {
            var opts = {
                lines: 8,            // The number of lines to draw
                length: 5,            // The length of each line
                width: 3,             // The line thickness
                radius: 5,           // The radius of the inner circle
                rotate: 0,            // Rotation offset
                corners: 1,           // Roundness (0..1)
                color: '#FFF',        // #rgb or #rrggbb
                direction: 1,         // 1: clockwise, -1: counterclockwise
                speed: 1,             // Rounds per second
                trail: 100,           // Afterglow percentage
                opacity: 1 / 4,         // Opacity of the lines
                fps: 20,              // Frames per second when using setTimeout()
                zIndex: 2e9,          // Use a high z-index by default
                className: 'spinner', // CSS class to assign to the element
                top: '50%',           // center vertically
                left: '50%',          // center horizontally
                position: 'absolute'  // element position
            }

            // todo: i dont like the position of this indicator!
            $(document).ajaxStart(function () {
                //$(me.params.globalLoadingSelector).spin(opts);
            });

            $(document).ajaxComplete(function () {
                //$(me.params.globalLoadingSelector).spin(false);
            });
        }

        this.parseDataAttributes = function (container) {

            // #########################################################################################################
            // ## initialize all containers, async loading of their content
            // #########################################################################################################
            // (id="main-container", data-role='container', data-source='/home')

            $(container).find("div[data-role=container]").each(function (elem) {
                var source = $(this).attr('data-source');
                $(this).spin();
                var target = $(this);

                $.get(source, { }, function (result) {
                    if (result.type == "view") {
                        target.spin(false);
                        target.html(result.content);
                        me.parseMessages(result.messages);
                        me.parseDataAttributes(target);
                    }

                    //target.find("div[data-role=container]").each(function() {
                    //    me.parseDataAttributes($(this));
                    //});

                });
            });

            // #########################################################################################################
            // ## reload given data container with other data-source
            // #########################################################################################################

            $(container).find("a[data-role=container-reload]").each(function (elem) {

                var form = $(this).attr('data-form');
                var source = $(this).data('source');
                var container = $($(this).data('container'));
                var reloadOnce = $(this).data('reload-once');
                var target = $(this);


                $(target).on('click', function (e) {
                    //me.fire({ type: "beforeContainerReloadRefresh" });
                    //container.html(null);
                    container.data('role', null);

                    if (reloadOnce == true || reloadOnce === true) {
                        target.append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" />');
                        target.data('reload-once', null);
                        target.data('role', null);
                        target.off('click');
                    } else {
                        container.spin();
                    }

                    var formData;
                    if (form != 'undefined') {
                        formData = $(form).serialize();
                    }

                    $.get(source, formData, function (result) {
                        if (result.type == "view") {
                            //target.find(".fa-spin").remove();

                            $(container).spin(false);
                            container.html(result.content);
                            me.parseMessages(result.messages);
                            me.parseDataAttributes(container);
                        }
                    });
                });
            });

            // #########################################################################################################
            // ## load data when target is in viewport
            // #########################################################################################################

            $(container).find("div[data-role=container-load-viewport]").each(function (elem) {
                var source = $(this).attr('data-source');
                var target = $(this);

                $(target).bind('enterviewport', function(elem){
                    target.spin();
                    target.data('role', null);

                    $.get(source, { }, function (result) {
                        if (result.type == "view") {
                            target.spin(false);
                            target.html(result.content);
                            me.parseMessages(result.messages);
                            me.parseDataAttributes(target);
                        }
                    });
                }).bullseye();
            });


            // #########################################################################################################
            // ## parse all form submits to make forms as dynamic ajax forms with submit actions
            // #########################################################################################################

            $(container).find("*[data-role=submit]").each(function (elem) {
                var form = $(this).attr('data-form');
                var targetUrl = $(this).attr('data-target');
                var container = $(this).attr('data-container');
                var style = $(this).attr('data-style');

                if (container.length < 1) {
                    container = form;
                }

                $(form).on("submit", function (e) {
                    e.preventDefault();
                    return false;
                });

                var target = $(this);

                $(target).on('click', function (e) {

                    if (style == "spinner") {
                        $(container).spin();
                    }
                    else {
                        $(target).append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" />')
                    }

                    var formData = $(form).serialize();

                    $.post(targetUrl, formData, function (result) {
                        if (style == "spinner") {
                            $(container).spin(false);
                        }
                        else {
                            $(target).find(".fa-spin").remove();
                        }

                        if (result.type == "error") {
                            //$(form).reset();
                        }
                        else if (result.type == "location") {
                            window.location = result.url;
                        }

                        /*
                         if (result.type == "view") {
                         target.spin(false);
                         target.html(result.content);
                         me.parseMessages(result.messages);
                         me.parseDataAttributes(target);
                         }*/

                        me.parseMessages(result.messages);
                    });
                });
            });

            // #########################################################################################################
            // ## simple ajax actions to redirect to another site..
            // #########################################################################################################

            $(container).find("*[data-role=action]").each(function (elem) {
                var targetUrl = $(this).attr('data-target');
                var container = $(this).attr('data-container');
                var style = $(this).attr('data-style');
                var target = $(this);
                var params = $(this).attr('data-params');

                if (container == null || container == "" && typeof container == "undefined") {
                    container = me.params.main_container;
                }

                $(target).on('click', function (e) {

                    if (style == "spinner") {
                        $(container).spin();
                    }
                    else {
                        $(target).append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" />')
                    }

                    $.post(targetUrl, params, function (result) {
                        if (style == "spinner") {
                            $(container).spin(false);
                        }
                        else {
                            $(target).find(".fa-spin").remove();
                        }

                        if (result.type == "error") {
                            //$(form).reset();
                        }
                        else if (result.type == "location") {
                            window.location = result.url;
                        }


                        if (result.type == "view") {
                            $(container).html(result.content);
                            me.parseDataAttributes(container);
                        }

                        me.parseMessages(result.messages);
                    });
                });
            });

            // #########################################################################################################
            // ## lets have some fun with hashtag navigation -.-
            // #########################################################################################################

            $(container).find("*[data-role=navigation] li").each(function (elem) {
                var targetAnchor = $(this).find('a').first();
                var targetListItem = $(this);
                var targetUrl = $(targetAnchor).attr('href');

                if (targetUrl[0] == "/")
                    targetUrl = targetUrl.substring(1);

                $(targetAnchor).on('click', function (e) {
                    //e.preventDefault();
                    $(container).find("*[data-role=navigation] li").removeClass("active");
                    $(targetListItem).addClass("active");
                    hasher.setHash(targetUrl);
                    return false;
                });
            });

            // #########################################################################################################
            // ## lets have some fun with non-hashtag navigation -.-
            // #########################################################################################################

            $(container).find("*[data-role=navigate]").each(function (elem) {
                var targetAnchor = $(this);
                var targetUrl = $(targetAnchor).attr('href');

                if (targetUrl[0] == "/")
                    targetUrl = targetUrl.substring(1);

                $(targetAnchor).on('click', function (e) {
                    //e.preventDefault();
                    me.handleChangedHash(targetUrl, "");
                    return false;
                });
            });


            // #########################################################################################################
            // ## okay lets load modules on click
            // #########################################################################################################


            //  data-html-source="/servers/addServerWizard", data-append="body", data-load='click')
            $(container).find("*[data-module]").each(function (elem) {
                var targetUrl = $(this).attr('data-module');
                var target = $(this);
                var loadMode = $(this).attr('data-load');
                var htmlSource = $(this).attr('data-html-source');
                var appendTo = $(this).attr('data-append');

                function loadHtmlSource(cb) {
                    if (htmlSource != null && htmlSource != "" && typeof htmlSource != "undefined") {

                        $.get(htmlSource, { }, function (result) {
                            $(appendTo).append(result.content);
                            target.removeAttr("data-html-source");
                            target.removeAttr("data-append");
                            me.parseDataAttributes(appendTo);
                            cb();
                        });
                    } else {
                        cb();
                    }
                }

                if (loadMode != null && loadMode != "" && typeof loadMode != "undefined") {

                    $(this).on('click', function (e) {
                        var clickTarget = $(this);
                        loadHtmlSource(function () {
                            $(target).append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" />');

                            require([ targetUrl], function (module) {
                                //module.init();
                                var mod = new module();
                                mod.init();

                                $(target).find(".fa-spin").remove();
                            });

                            return false;
                        });
                    });
                } else {
                    loadHtmlSource(function () {
                        require([ targetUrl], function (module) {
                            //module.init();
                            var mod = new module();
                            mod.init();

                            $(target).find(".fa-spin").remove();
                        });
                    });
                }


            });


            me.fire({ type: "containerRefresh" });
        }

        this.handleChangedHash = function (newHash, oldHash) {
            console.log("handleChangedHash => newHash: " + newHash + " || " + "oldHash: " + oldHash);

            var target = $(me.params.main_container);
            $(target).spin();
            var url = "/" + newHash;

            me.handleNavigation(newHash, url, target);
        }

        this.handleNavigation = function (newHash, url, target) {
            $.get(url, { }, function (result) {
                if (result.type == "view") {
                    $(target).spin(false);
                    $(target).html(result.content);
                    $(target).focus();

                    me.parseDataAttributes(target);
                }

                me.parseMessages(result.messages);
            });
        }

        this.handleInitialHash = function (hash) {
            //console.log("handleInitialHash: " + hash);

            //var event = jQuery.Event("handleInitialHash");
            //$(me).trigger(event);

            //if (event.isDefaultPrevented()) {

            if (me.params.handleInitialLoad) {
                if (hash == '') {
                    $('body').find('*[data-role=navigation] li').removeClass("active");
                    $('body').find('*[data-role=navigation] li a[href*="' + me.params.initialPage + '"]').parent('li').addClass("active");

                    hasher.replaceHash(me.params.initialPage);
                    return;
                }

                $('body').find('*[data-role=navigation] li').removeClass("active");
                $('body').find('*[data-role=navigation] li a[href*="' + hash + '"]').parent('li').addClass("active");

                me.handleNavigation(hash, '/' + hash, me.params.main_container);
            }
            //}
        }

        this.parseMessages = function (messages) {
            if (messages != null && messages !== undefined) {
                messages.forEach(function (item) {
                    $.growl(item.text, { type: item.type });
                });
            }
        }

        // initialize code
        $.ajaxSetup({
            cache: false
        });

        this.init = function (opts) {
            me.params = opts;
            console.log("init!");

            me.setGlobalAjaxAnimation();
            me.configureGrowl();
            me.parseDataAttributes("body");
            //me.parseMessages(JSON.parse($('#messages').val()));


            hasher.changed.add(me.handleChangedHash);
            hasher.initialized.add(me.handleInitialHash);
            hasher.init();
        }
    };

    cl.prototype  = {

        constructor: cl,

        on: function(type, listener){
            if (typeof this._listeners[type] == "undefined"){
                this._listeners[type] = [];
            }

            this._listeners[type].push(listener);
        },

        fire: function(event){
            if (typeof event == "string"){
                event = { type: event };
            }
            if (!event.target){
                event.target = this;
            }

            if (!event.type){  //falsy
                throw new Error("Event object missing 'type' property.");
            }

            if (this._listeners[event.type] instanceof Array){
                var listeners = this._listeners[event.type];
                for (var i=0, len=listeners.length; i < len; i++){
                    listeners[i].call(this, event);
                }
            }
        },

        off: function(type, listener){
            if (this._listeners[type] instanceof Array){
                var listeners = this._listeners[type];
                for (var i=0, len=listeners.length; i < len; i++){
                    if (listeners[i] === listener){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };


    if (window.slingle == null) {
        window.slingle = new cl();
        return window.slingle;
    }

    return window.slingle;
});