﻿define(["app", "marionette", "jquery", "toastr"], function(app, Marionette, $, toastr) {

    return Marionette.Layout.extend({
        template: "layout",
        el: "body",

        initialize: function() {
            var self = this;

            app.on("read:started create:started update:started delete:started", function() {
                self.showLoader();
            });

            app.on("read:success create:success update:success delete:success", function() {
                self.hideLoader();
            });

            app.on("update:success", function(model) {
                if (model.toString() != "")
                    toastr.info(model.toString() + " was updated.");
            });

            app.on("delete:success", function(model) {
                if (model.toString() != "")
                    toastr.info(model.toString() + " was deleted.");
            });

            app.on("create:success", function(model) {
                if (model.toString() != "")
                    toastr.info(model.toString() + " was created.");
            });

            app.on("read:error create:error update:error delete:error", function(e) {
                self.hideLoader();
                $.dialog({
                    header: "Error occured when processing request",
                    content: e.name
                });
            });

            app.on("toastr:info", function(message) {
                toastr.info(message);
            });

            this.dialog.show = function(view) {
                self.trigger("dialog-opening");
                Marionette.Region.prototype.show.call(this, view);
                self.dialog.$el.modal();
                self.dialog.$el.on("hidden.bs.modal", function() {
                    self.trigger("dialog-closing");
                });
            };

            this.dialog.hide = function() {
                self.dialog.$el.modal('hide');
            };

            this.content.show = function(view) {
                Marionette.Region.prototype.show.call(this, view);
                self.toolbar.close();
            };
        },

        showLoader: function() {
            $(".loader").show();
        },

        hideLoader: function() {
            $(".loader").hide();
        },

        showToolbarViewComposition: function(contentView, toolbarView) {
            this.content.show(contentView);
            toolbarView.contentView = contentView;
            this.toolbar.show(toolbarView);
        },

        regions: {
            menu: "#menu",
            dialog: "#customModal",
            content: "#content",
            toolbar: "#toolbar"
        }
    });
});