Ext.define('Spelled.model.Script', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ScriptsActions.create,
            read:    Spelled.ScriptsActions.read,
            update:  Spelled.ScriptsActions.update,
            destroy: Spelled.ScriptsActions.destroy
        }
    },

    fields: [
        'name',
        'content'
    ]
});