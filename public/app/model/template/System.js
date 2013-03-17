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

	mergeDependencies: true,

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
        type: 'storageaction',
		extraParams: {
			type: 'system'
		},
        writer: {
            type: 'systemTemplate'
        }
    },

	getCalculatedDependencies: function() {
		var ids   = [],
			store = Ext.getStore( 'template.Components')

		this.getInput().each(
			function( input ) {
				var cmp = store.getByTemplateId( input.get( 'componentId' ) )
				ids.push( input.get( 'componentId' ) )
				Ext.Array.push( ids, cmp.getDependencies() )
			}
		)

		return Ext.Array.clean( ids )
	},

	createDependencyNode: function() {
		var children = [],
			node     = { libraryId: this.getFullName(), children: children },
			store    = Ext.getStore( 'template.Components' ),
			range    = this.getInput().getRange()

		for ( var j = 0, l = range.length; j < l; j++ ) {
			var input = range[j],
				cmp   = store.getByTemplateId( input.get( 'componentId' ) )

			children.push( cmp.createDependencyNode() )
		}

		return node
	},

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( arguments )
	},

	listeners: {
		loadscript: function() {
			Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
				function( result ) {
					this.set( 'path', this.getAccordingJSFileName() )
					this.set( 'content', result )
					this.dirty = false
				},
				this
			)

		},
		dirty: function() {
			this.updateDependencies()
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
		this.callParent( arguments )
		this.fireEvent( 'loadscript' )
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
