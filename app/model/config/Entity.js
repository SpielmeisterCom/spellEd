Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        'name'
    ],

    validations: [
        {
            type: 'presence',
            field: 'blueprintId',
            message: 'A Entity Blueprint is required.'
        },
        {
            type: 'length',
            field: 'name', min: 2,
            message: 'Name is required.'
        }
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.config.Zone',
    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Entities' ).add( this )
    },

    getJSONConfig: function() {

        var result = this.data
        var components = this.getComponents()

        result.components = []
        Ext.each( components.data.items, function( component ){
            result.components.push( component.getJSONConfig() )
        })

        return result
    }
});