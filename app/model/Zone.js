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
    ]
});