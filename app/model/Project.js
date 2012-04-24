Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ProjectActions.create,
            read:    Spelled.ProjectActions.read,
            update:  Spelled.ProjectActions.update,
            destroy: Spelled.ProjectActions.destroy
        }
    },

    fields: [
        'name',
        'configFilePath',
        'zones'
    ],

    hasMany: {
        model: 'Spelled.model.Zone'
    },

    constructor: function() {
        this.callParent(arguments);
        this.data.zones = this.parseZones()
    },

    parseZones: function() {
        var result = []

        var zones = this.get('zones')

        for( var key in zones ) {
            var zone = zones[ key ]

            result.push(
                Ext.create( 'Spelled.model.Zone',
                    {
                        name       : zone.name,
                        entities   : zone.entities,
                        project_id : this.id
                    }
                )
            )
        }

        return result
    }
});