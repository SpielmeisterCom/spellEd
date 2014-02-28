// We need to add an element with the ID 'appLoadingIndicator' because [app.js].launch() is expecting it and tries to remove it
var myDiv = document.createElement("div");
myDiv.setAttribute("id", "appLoadingIndicator");
document.getElementsByTagName("body")[0].appendChild(myDiv);

// Karma normally starts the tests right after all files specified in 'karma.config.js' have been loaded
// We only want the tests to start after Sencha Touch/ExtJS has bootstrapped the application.
// 1. We temporary override the '__karma__.loaded' function
// 2. When Ext is ready we call the '__karma__.loaded' function manually
var karmaLoadedFunction = window.__karma__.loaded;
window.__karma__.loaded = function () {};

Ext.require('Spelled.Application')

Ext.onReady(function () {

    Ext.create( 'Spelled.Application', {
            launch: function() {

                Ext.create( 'Spelled.view.ui.SpelledViewport' )

                console.info("Starting Tests ...");
                window.__karma__.loaded = karmaLoadedFunction;
                window.__karma__.loaded();
            }
        }
    )
});