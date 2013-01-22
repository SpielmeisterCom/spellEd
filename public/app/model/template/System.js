Ext.define('Spelled.model.template.System', {
	extend: 'Spelled.abstract.model.Template',

	requires: [
		'association.hasone',
		'association.hasmany',
		'Spelled.data.writer.SystemTemplate'
	],

    fields: [
        "namespace",
        "name",
		{ name: "config", type: "object" }
    ],

	associations: [
		{
			type: 'hasOne',
			model: 'Spelled.model.Script',
			foreignKey: 'templateId'
		},{
			type: 'hasMany',
			model: 'Spelled.model.template.SystemInputDefinition',
			associationKey: 'input',
			name :  'getInput'
		},{
			type: 'hasMany',
			model: 'Spelled.model.template.SystemConfigItem',
			associationKey: 'config',
			name :  'getConfig'
		}
	],

    proxy: {
        type: 'direct',
		extraParams: {
			type: 'system'
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

	getLibraryIds: function() {
		var ids   = [ this.getFullName() ],
			store = Ext.getStore( 'template.Components')

		this.getInput().each(
			function( input ) {
				var cmp = store.getByTemplateId( input.get( 'componentId' ) )

				Ext.Array.push( ids, cmp.getLibraryIds() )
			}
		)

		return ids
	},

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( arguments )
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

	getConfigForScene: function() {
		var config = {}
		this.getConfig().each(
			function( item ) {
				config[ item.get( 'name' ) ] = item.get( 'default' )
			}
		)

		return config
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
