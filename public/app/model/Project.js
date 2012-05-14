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
        'startZone'
    ],

    idProperty: 'name',

    hasMany: {
        model: 'Spelled.model.config.Zone',
        name : 'getZones',
        associationKey: 'zones'
    }
});