Ext.define('Spelled.model.blueprint.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        "type",
        "namespace",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    getFullName: function() {
        return this.get('namespace') +"/"+ this.get('name')
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.EntityBlueprintActions.create,
            read:    Spelled.EntityBlueprintActions.read,
            update:  Spelled.EntityBlueprintActions.update,
            destroy: Spelled.EntityBlueprintActions.destroy
        }
    }
});