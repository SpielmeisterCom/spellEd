Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',

    views: [
        'component.Properties'
    ],

    models: [
        'config.Component'
    ],

    stores: [
       'config.Components'
    ],

    formatConfiguration: function( component ) {

    },

    showConfig: function( component ) {
        //TODO: getting Configuration from SpellJS

        var config = {}

        Ext.iterate( component.get('config'), function( key, value ) {
            config[ key ] =  value.toString()
        })

        var propertyGrid = Ext.getCmp('ComponentProperty')

        propertyGrid.setSource( config )
        propertyGrid.componentConfigId = component.getId()
    }
});