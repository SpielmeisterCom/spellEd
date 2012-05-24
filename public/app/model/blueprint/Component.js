Ext.define('Spelled.model.blueprint.Component', {
    extend: 'Ext.data.Model',

    BLUEPRINT_TYPE: 'componentBlueprint',

    fields: [
        "type",
        "namespace",
        "name",
        "from"
    ],

    hasMany: {
        model: 'Spelled.model.blueprint.ComponentAttribute',
        associationKey: 'attributes',
        name :  'getAttributes'
    },

    requires: ['Spelled.writer.JsonWriter'],

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
        },
        writer: {
            type: 'json'
        }
    },

    mergeComponentConfig: function( values ) {
        var componentConfig = {}

        //Overwrite only the submitted attribute
        Ext.each(
            this.getAttributes().data.items,
            function( attribute ) {
                //TODO: Converting types and only insert keys and changes
                if( values.default != attribute.get('default') ) {
                    componentConfig[ attribute.get('name') ] = ( attribute.get('name') === values.name ) ? values.default : attribute.get('default')
                }
            }
        )

        return componentConfig
    }



});