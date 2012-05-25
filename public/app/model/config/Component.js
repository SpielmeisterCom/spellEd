Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        { name: 'config', type: 'object', defaultValue: {} },
        { name: 'changed', type: 'boolean', defaultValue: false }
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.config.Entity',

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Components' ).add( this )
    },

    setChanged: function() {
        this.set( 'changed', true)
    },

    getConfigMergedWithBlueprintConfig: function( ) {
        var blueprintComponent = Ext.getStore( 'blueprint.Components').getByBlueprintId( this.get('blueprintId') )

        //TODO: config wird falschrum überschrieben
        var blueprintConfig =  {}
        blueprintComponent.getAttributes().each(
            function( attribute ) {
                blueprintConfig[ attribute.get('name') ] = attribute
            }
        )

        //TODO: the config from entities get overwritten if we do not mark them
        if( !Ext.isEmpty( this.get('config') ) ) this.setChanged()

        var tmp = Ext.Object.merge( blueprintConfig, this.get('config') )
        //TODO: Warum ist trim in der config durch den merge
        delete tmp.trim

        return tmp
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});