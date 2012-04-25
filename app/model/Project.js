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

    idProperty: "name",

    fields: [
        'name',
        'configFilePath'
    ],

    hasMany: {
        model: 'Spelled.model.Zone',
        name : 'getZones',
        associationKey: 'zones'
    }
});