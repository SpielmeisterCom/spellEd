Ext.define('Spelled.model.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
        'entities',
        'project_id'
    ],

    hasMany: {
        model: 'Spelled.model.Entity',
        name :  "entities"
    },

    constructor: function() {
        this.callParent(arguments);
        this.data.entities = this.parseEntities()
    },

    parseEntities: function() {
        var result = []

        var entities = this.get('entities')

        for( var key in entities ) {
            var components = entities[ key ].components

            result.push(
                Ext.create( 'Spelled.model.Entity',
                    {
                        name       : entities[ key ].name,
                        components : components,
                        zone_id    : this.id
                    }
                )
            )
        }

        return result
    }
});