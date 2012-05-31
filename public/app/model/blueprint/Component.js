Ext.define('Spelled.model.blueprint.Component', {
    extend: 'Spelled.abstract.model.Blueprint',

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

    appendOnTreeNode: function( node ) {

        this.getAttributes().each( function( attribute ) {
            node.appendChild(
                node.createNode ( {
                    text      : attribute.get('name'),
                    id        : attribute.getId(),
                    expanded  : true,
                    leaf      : true
                } )
            )
        })

        return node
    },

    mergeComponentConfig: function( values ) {
        var componentConfig = {}

        //Overwrite only the submitted attribute
        this.getAttributes().each(
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