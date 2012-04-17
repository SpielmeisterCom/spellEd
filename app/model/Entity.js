Ext.define('Spelled.model.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
        'components',
        'zone_id'
    ],

    belongsTo: "Spelled.model.Zone",
    hasMany: {
        model: 'Spelled.model.Component',
        name :  "components"
    },


    constructor: function() {
        this.callParent(arguments);
        this.data.components = this.parseComponents()
    },

    parseComponents: function() {
        var result = []

        var components = this.get('components')

        for( var key in components ) {

            result.push(
                Ext.create( 'Spelled.model.Component',
                    {
                        name         : components[ key ].name,
                        entity_id    : this.id
                    }
                )
            )
        }

        return result

    }
});