Ext.define('Spelled.model.blueprint.System', {
    extend: 'Spelled.abstract.model.Blueprint',

    fields: [
        "type",
        "namespace",
        "name",
        "scriptId"
    ],

    hasOne: {
        model: 'Spelled.model.Script',
        foreignKey: 'scriptId'
    },

    hasMany: {
        model: 'Spelled.model.blueprint.SystemInputDefinition',
        associationKey: 'input',
        name :  'getInput'
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.SystemBlueprintActions.create,
            read:    Spelled.SystemBlueprintActions.read,
            update:  Spelled.SystemBlueprintActions.update,
            destroy: Spelled.SystemBlueprintActions.destroy
        },
        writer: {
            type: 'json'
        }
    },

    appendOnTreeNode: function( node ) {

        this.getInput().each( function( input ) {

            var children = node.createNode ( {
                text      : input.get('name'),
                id        : input.getId(),
                expanded  : true,
                leaf      : false
            } )


			children.appendChild(
				node.createNode ( {
					text      : input.get('blueprintId'),
					id        : input.get('blueprintId'),
					expanded  : true,
					leaf      : true
				} )
			)

            node.appendChild( children )
        })

        return node
    }
});