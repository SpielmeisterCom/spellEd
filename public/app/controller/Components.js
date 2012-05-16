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

    convertValueForGrid: function( value ) {
        if( Ext.isArray( value ) === true ) {
            return "[" + value.toString() + "]"
        } else {
            try{
                return eval(value)
            } catch( e ) {
                return value
            }
        }
    },

    showConfig: function( component ) {
        var config = {}
        Ext.iterate(
            component.getConfigMergedWithBlueprintConfig(),
            function( key, value ) {
                if( Ext.isObject( value ) && !!value.isModel ) {
                    config[ key ] = this.convertValueForGrid( value.get('default') )
                } else {
                    config[ key ] = this.convertValueForGrid( value )
                }
            },
            this
        )

        var propertyGrid = Ext.getCmp('ComponentProperty')

        propertyGrid.setSource( config )
        propertyGrid.componentConfigId = component.getId()
    }
});