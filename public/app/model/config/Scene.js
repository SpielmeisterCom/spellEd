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

		this.getEntities().each(
			function( entity ) {
				entity.stripRedundantData()
			}
		)

		this.callParent( arguments )
	},

	mergeStoreIds: function( result, store ) {
		var	contains = Ext.Array.contains

		store.each(
			function( asset ) {
				var name = asset.getFullName()
				if( !contains( result, name ) ) result.push( asset.getFullName() )
			},
			this
		)
	},

	syncLibraryIds: function() {
		var result = []

		if( Ext.isArray( this.get( 'libraryIds' ) ) ) {
			result = this.get( 'libraryIds' )
		} else {
			this.set( 'libraryIds', result )
		}

		var stores = [
				'template.Components',
				'template.Entities',
				'template.Systems',
				'asset.Assets'
			],
			getStore = Ext.getStore,
			merge    = this.mergeStoreIds

		Ext.Array.each(
			stores,
			function( item ) {
				var store = getStore( item )
				store.clearFilter( true )
				merge( result, store )
			}
		)
	},

	checkForComponentChanges: function() {
		this.getEntities().each(
			function( entity ) {
				entity.checkForComponentChanges()
			}
		)
	},

	listeners: {
		idchanged: function() {
			Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
				function( result ) {
					this.data.path = this.getAccordingJSFileName()
					this.data.content = result
					this.unDirty()
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
					text      : this.getFullName(),
					id        : this.getId(),
					iconCls   : "tree-scene-icon",
					leaf      : true
				}
			)
		)

		var entitiesNode = sceneNode.appendChild(
			node.createNode( {
					text      : "Entities",
					id        : this.getId() + "_entities",
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
					id        : this.getId() + "_showSystems",
					iconCls   : "tree-scene-system-icon",
					leaf      : false
				}
			)
		)

		sceneNode.appendChild(
			node.createNode( {
					text      : "Script",
					id        : this.getId() + "_showScript",
					iconCls   : "tree-scene-script-icon",
					leaf      : true
				}
			)
		)

		return sceneNode
	}
});
