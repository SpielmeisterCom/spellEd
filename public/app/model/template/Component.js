Ext.define('Spelled.model.template.Component', {
    extend: 'Spelled.abstract.model.Template',

    fields: [
        "type",
        "namespace",
		{ name: 'title', type: 'string', defaultValue: "" },
		"doc",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.template.ComponentAttribute',
        associationKey: 'attributes',
        name :  'getAttributes'
    },

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ComponentTemplateActions.create,
            read:    Spelled.ComponentTemplateActions.read,
            update:  Spelled.ComponentTemplateActions.update,
            destroy: Spelled.ComponentTemplateActions.destroy
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

	getConfig: function() {
		var templateConfig =  {}
		this.getAttributes().each(
			function( attribute ) {
				templateConfig[ attribute.get('name') ] = attribute
			}
		)

		return templateConfig
	}
});
