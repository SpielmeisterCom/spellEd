Ext.define('Spelled.model.config.Scene', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.direct',
		'Spelled.data.reader.Scene',
		'Spelled.data.writer.Scene'
	],
	mixins: [ 'Spelled.abstract.model.Model' ],

	iconCls : "tree-scene-icon",

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'scene' },
        'name',
		'namespace',
		'libraryIds',
		{ name: 'systems', type: 'object', defaultValue: { update: [], render: [] } }
    ],

	associations: [{
		model:"Spelled.model.Project",
		type:"belongsTo",
		getterName: 'getProject',
		setterName: 'setProject'
	}],

    hasMany: {
        model: 'Spelled.model.config.Entity',
        associationKey: 'entities',
        name :  'getEntities'
    },

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'scene'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		reader: 'scene',
		writer: 'scene'
	},

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( options )
	},

	getFullName: function() {
		return this.get( 'sceneId' )
	},

	save: function() {
		this.syncLibraryIds()

		this.callParent( arguments )
	},

	getStoreIds: function( store ) {
		var array = []
		store.each(
			function( asset ) {
				array.push( asset.getFullName() )
			},
			this
		)

		return array
	},

	syncLibraryIds: function() {
		var result = []

		this.set( 'libraryIds', result.concat(
			this.getStoreIds( Ext.getStore( 'template.Components' ) ),
			this.getStoreIds( Ext.getStore( 'template.Entities' ) ),
			this.getStoreIds( Ext.getStore( 'template.Systems' ) ),
			this.getStoreIds( Ext.getStore( 'asset.Assets' ) )
		))
	},

	listeners: {
		idchanged: function() {
			Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
				function( result ) {
					this.data.path = this.getAccordingJSFileName()
					this.data.content = result
				},
				this
			)

		}
	},

	revertScript: function() {
		Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
			function( result ) {
				this.data.content = result
			},
			this
		)
	},

	constructor: function() {
		var params = arguments[0] || arguments[2]
		this.callParent( arguments )
		this.set( 'sceneId', this.generateIdentifier( params ))
		this.setId( params.id )
	},

	setDirty: function() {
		this.getProject().setDirty()

		this.callParent()
	},

	unDirty: function() {
		this.dirty = false
		this.getEntities().each( function( entity ){ entity.unDirty() } )
	},

	getRenderTabTitle: function() {
		return "Scene"
	},

	appendOnTreeNode: function( node ) {
		var sceneNode = node.appendChild(
			node.createNode( {
					text      : 'Scene "' + this.getFullName() + '"',
					id        : this.getId(),
					iconCls   : "tree-scene-icon",
					leaf      : false
				}
			)
		)

		var entitiesNode = sceneNode.appendChild(
			node.createNode( {
					text      : "Entities",
					id        : "entities",
					iconCls   : "tree-entities-folder-icon",
					leaf      : false
				}
			)
		)

		this.getEntities().each( function( entity ) {
			entitiesNode.appendChild(
				entity.createTreeNode( entitiesNode )
			)
		})

		sceneNode.appendChild(
			node.createNode( {
					text      : "Systems",
					id        : "showSystems",
					iconCls   : "tree-scene-system-icon",
					leaf      : false
				}
			)
		)

		sceneNode.appendChild(
			node.createNode( {
					text      : "Script",
					id        : "showScript",
					iconCls   : "tree-scene-script-icon",
					leaf      : true
				}
			)
		)

		return sceneNode
	}
});
