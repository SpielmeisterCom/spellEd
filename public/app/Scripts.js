Ext.define('Spelled.controller.Scripts', {
    extend: 'Ext.app.Controller',

    views: [
        'script.Editor'
    ],

    stores: [
        'Scripts'
    ],

    models: [
        'Script'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({

        })
    },

    refreshStores: function() {
        var projectName = this.application.getActiveProject().get('name')

        this.getScriptsStore().load( {
            params: {
                projectName: projectName
            }
        } )
    }
});