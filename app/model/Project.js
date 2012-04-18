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
        'root'
    ],

    hasMany: {
        model: 'Spelled.model.Zone',
        name :  "zones"
    },

    constructor: function() {
        this.callParent(arguments)
    }
});