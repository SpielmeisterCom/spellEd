Ext.define('Spelled.model.template.Entity', {
    extend: 'Spelled.abstract.model.Template',

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
            create:  Spelled.EntityTemplateActions.create,
            read:    Spelled.EntityTemplateActions.read,
            update:  Spelled.EntityTemplateActions.update,
            destroy: Spelled.EntityTemplateActions.destroy
        },
        writer: {
            type: 'json'
        }
    }
});
