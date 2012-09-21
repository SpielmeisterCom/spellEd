Ext.define('Spelled.model.template.System', {
    extend: 'Spelled.abstract.model.Template',

	iconCls : "tree-system-icon",

    fields: [
        "type",
        "namespace",
        "name"
    ],

    hasOne: {
        model: 'Spelled.model.Script',
        foreignKey: 'templateId'
    },

    hasMany: {
        model: 'Spelled.model.template.SystemInputDefinition',
        associationKey: 'input',
        name :  'getInput'
    },

    proxy: {
        type: 'direct',
		extraParams: {
			type: 'systemTemplate'
		},
        api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
        },
        writer: {
            type: 'systemTemplate'
        }
    },

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( options )
	},

	listeners: {
		idchanged: function() {
			Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
				function( result ) {
					this.set( 'path', this.getAccordingJSFileName() )
					this.set( 'content', result )
					this.dirty = false
				},
				this
			)

		}
	},

	constructor: function() {
		var params = arguments[0] || arguments[2]
		this.callParent( arguments )
		this.setId( params.id )
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
