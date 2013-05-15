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

	canBeIgnored: true,

	listeners: {
		loadscript: function() {
			this.readAccordingJSFile()
		},
		dirty: function() {
			this.updateDependencies()
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

		return cmp.getCalculatedDependencies()
	},

	createDependencyNode: function() {
		var cmp = Ext.create( 'Spelled.model.config.Component', { templateId: this.getFullName() } )

		return cmp.createDependencyNode()
	},

	getAttributeByName: function( name ) {
		return this.getAttributes().findRecord( 'name', name )
	},

    appendOnTreeNode: function( node ) {
		var group = this.get( 'group' )

        this.getAttributes().each( function( attribute ) {
			if( attribute.isEngineInternal() ) return

			var newNode = node.createNode ( {
				text      : attribute.get('name'),
				id        : attribute.getId(),
				iconCls   : "tree-component-attribute-icon",
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
