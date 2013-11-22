Ext.define('Spelled.model.template.Component', {
	extend: 'Spelled.base.model.Template',

	requires: [
		'association.hasmany',
		'Spelled.data.writer.ComponentTemplate',
		'Spelled.data.reader.Component'
	],

    fields: [
        "namespace",
		{ name: 'group', type: 'string', defaultValue: 'zzz' },
		{ name: 'title', type: 'string', defaultValue: '' },
		{ name: 'icon', type: 'string', defaultValue: '' },
		"doc",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.template.ComponentAttribute',
        associationKey: 'attributes',
        name :  'getAttributes'
    },

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'component'
		},
		writer: 'componentTemplate',
		reader: 'component'
	},

	listeners: {
		loadscript: function() {
			this.readAccordingJSFile()
		}
	},

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( arguments )
	},

	constructor: function() {
		this.callParent( arguments )

		if( arguments.length > 1 ) this.fireEvent( 'loadscript' )
	},

	getCalculatedDependencies: function() {
		var cmp = Ext.create( 'Spelled.model.config.Component', { templateId: this.getFullName() } )

		cmp.store.remove( cmp )
		return cmp.getCalculatedDependencies()
	},

	createDependencyNode: function() {
		var cmp = Ext.create( 'Spelled.model.config.Component', { templateId: this.getFullName() } )

		cmp.store.remove( cmp )
		return cmp.createDependencyNode()
	},

	getAttributeByName: function( name ) {
		return this.getAttributes().findRecord( 'name', name, null, null, null, true )
	},

    appendOnTreeNode: function( node, blacklist ) {
		var group    = this.get( 'group' ),
			contains = Ext.Array.contains

		blacklist = Ext.isArray( blacklist ) ? blacklist : []

        this.getAttributes().each( function( attribute ) {
			if( contains( blacklist, attribute.get('name') ) ) return

			var newNode = node.createNode ( {
				text      : attribute.get('name'),
				id        : attribute.getId(),
				iconCls   : attribute.isEngineInternal() ? "tree-component-attribute-engine-internal-icon" : "tree-component-attribute-icon",
				leaf      : true
			} )

			newNode.set( 'group', group )
            node.appendChild( newNode )
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
