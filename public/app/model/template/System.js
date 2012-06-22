Ext.define('Spelled.model.template.System', {
    extend: 'Spelled.abstract.model.Template',

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
        model: 'Spelled.model.template.SystemInputDefinition',
        associationKey: 'input',
        name :  'getInput'
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.SystemTemplateActions.create,
            read:    Spelled.SystemTemplateActions.read,
            update:  Spelled.SystemTemplateActions.update,
            destroy: Spelled.SystemTemplateActions.destroy
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
					text      : input.get('templateId'),
					id        : input.get('templateId'),
					expanded  : true,
					leaf      : true
				} )
			)

            node.appendChild( children )
        })

        return node
    }
});
