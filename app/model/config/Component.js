Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        'config'
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.config.Entity',

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Components' ).add( this )
    },

    mergeWithBlueprintConfig: function( ) {
        var blueprintComponent = Ext.getStore( 'blueprint.Components').getByBlueprintId( this.get('blueprintId') )

        //TODO: config wird falschrum überschrieben
        var blueprintConfig =  {}
        Ext.each( blueprintComponent.getAttributes().data.items, function( attribute ) {
            blueprintConfig[ attribute.get('name') ] = attribute.get('default')
        })

        var tmp = Ext.Object.merge( blueprintConfig, this.get('config') )
        //TODO: Warum ist trim in der config durch den merge
        delete tmp.trim
        this.set( 'config', tmp )
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});