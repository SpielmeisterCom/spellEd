Ext.define('Spelled.model.blueprint.Entity', {
    extend: 'Ext.data.Model',

    BLUEPRINT_TYPE: 'entityBlueprint',

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

    getFullName: function() {
        var namespace = this.get('namespace')
        return ( namespace.length > 0 ) ? namespace +"/"+ this.get('name') : this.get('name')
    },

    requires: ['Spelled.writer.JsonWriter'],

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