Ext.define('Spelled.model.Zone', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ZonesActions.create,
            read:    Spelled.ZonesActions.read,
            update:  Spelled.ZonesActions.update,
            destroy: Spelled.ZonesActions.destroy
        }
    },

    fields: [
        'name',
        'content',
        'path'
    ],

    hasMany: {
        model: 'Spelled.model.Entity',
        name :  "entities"
    },

    constructor: function()
    {
console.log( "Zone-Constructor")
        this.callParent(arguments);
        this.data.entities = this.getEntities()
    },

    getEntities: function() {
        if( !!this.entities ) {
            return this.entities

        } else {
console.log("parsing entities")
            var result = []

            var entities = this.get('content')

            for( var key in entities ) {
                var components = entities[ key ].components

                result.push(
                    Ext.create( 'Spelled.model.Entity',
                        {
                            name:       entities[ key ].name,
                            components: components
                        }
                    )
                )
            }

            return result
        }
    }
});