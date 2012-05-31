Ext.define('Spelled.model.blueprint.Entity', {
    extend: 'Spelled.abstract.model.Blueprint',

    fields: [
        "type",
        "namespace",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.EntityBlueprintActions.create,
            read:    Spelled.EntityBlueprintActions.read,
            update:  Spelled.EntityBlueprintActions.update,
            destroy: Spelled.EntityBlueprintActions.destroy
        },
        writer: {
            type: 'json'
        }
    }
});