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

    setBlueprintConfig: function( blueprintId ) {
        var store = Ext.getStore( 'blueprint.Components')

        //TODO: mapping von id zu jsonid der blueprint fixen
        var index = store.findBy( function( record ) {
            return ( record.getFullName() === blueprintId )
        })

        var blueprintComponent = store.getAt( index )

        var blueprintConfig =  this.get('config')
        Ext.each( blueprintComponent.getAttributes().data.items, function( attribute ) {
            blueprintConfig[ attribute.get('name') ] = attribute.get('default')
        })

        this.set( 'config', blueprintConfig )
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});