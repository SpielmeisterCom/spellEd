Ext.define('Spelled.model.blueprint.Component', {
    extend: 'Ext.data.Model',

    fields: [
        "type",
        "namespace",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.blueprint.ComponentAttribute',
        associationKey: 'attributes',
        name :  'getAttributes'
    },

    getFullName: function() {
        return this.get('namespace') +"/"+ this.get('name')
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ComponentBlueprintActions.create,
            read:    Spelled.ComponentBlueprintActions.read,
            update:  Spelled.ComponentBlueprintActions.update,
            destroy: Spelled.ComponentBlueprintActions.destroy
        }
    }
});