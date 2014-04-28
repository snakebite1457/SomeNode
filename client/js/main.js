
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



    Slingle.on("containerRefresh", function(elem) {
        refreshDeleteButton();

        // Div's with data attribute selected row can be selected and deleted
        $('body').find("div[data-selectrow=true]").each(function (elem) {
            var target = $(this);

            $(target).on('click', function (e) {
                if ($(target).is('.row-selected')) {
                    $(this).removeClass('row-selected');
                    $(this).removeAttr('data-rowSelected');
                }
                else {
                    $(this).addClass('row-selected');
                    $(this).attr('data-rowSelected', 'true');
                }

                refreshDeleteButton();
            });
        });

        $('#btn-deleteItemsFinally').on('click', function(elem) {

            var source = $(this).data('source');
            var container = $($(this).data('container'));
            var reloadOnce = $(this).data('reload-once');
            var target = $(this);

            $('body').find("div[data-rowSelected=true]").each(function (elem) {
                var dataDeleteUrl = $(this).data('deleteurl');
                var dataDeleteId = $(this).data('deleteid');

                $.post(dataDeleteUrl, { id : dataDeleteId }, function(res) {
                    /*var parent = $(target).parent();
                    $(target).fadeOut('slow', function() {
                        $(this).remove();
                        if ($(parent).children().length == 0) {
                            $(parent).fadeOut('fast');
                        }
                    });*/
                });
            });

            container.html(null);


            if (reloadOnce == true || reloadOnce === true) {
                $(target).append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" />');
                target.data('reload-once', null);
                target.data('role', null);
                $(target).off('click');
            } else {
                container.spin();
            }


            $.get(source, { }, function (result) {
                if (result.type == "view") {
                    $(target).find(".fa-spin").remove();
                    //container.spin(false);
                    container.html(result.content);
                    //Slingle.parseMessages(result.messages);
                    Slingle.parseDataAttributes(container);
                }
            });

            $.growl("Items deleted", { type: "success" });
            //refreshDeleteButton();
        });



/*        $('#searchFurtherOptions').on('click', function(elem) {
           $('#modalAddItemForm').children().each(function(elem) {
               if ($(this).data('hide') == true){
                   $(this).data('hide', false);
                   $(this).removeClass("hide");
               } else if ($(this).data('hide') == false){
                   $(this).data('hide', true);
                   $(this).addClass("hide");
               }
           });

            $(this).text($(this).text() == 'Further search options'
                ? 'Hide further options' : 'Further search options');
        });

        $('#modalAddItem').on('hidden.bs.modal', function(elem){
           $('#seachContainer').html(null);
        });*/
    });



    function refreshDeleteButton() {
        var count = $('body').find("div[data-rowSelected=true]").size();


        if (count == 0) {
            $('#btn-deleteElement').attr('disabled', true);
            $('#btn-deleteElement').attr('title', 'Nothing Selected');
        } else {
            $('#btn-deleteElement').attr('disabled', false);
            $('#btn-deleteElement').attr('title', count > 1 ? 'Delete ' + count + ' Items' : 'Delete 1 Item');
        }
    }


});