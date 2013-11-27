Ext.define('Spelled.model.config.Scene', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.storageaction',
		'Spelled.data.reader.Scene',
		'Spelled.data.writer.Scene'
	],
	mixins: [ 'Spelled.base.model.Model' ],

	iconCls : "tree-scene-icon",

	converterName: 'sceneConverter',

	mergeDependencies: true,

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'scene' },
        'name',
		'namespace',
		'dependencies',
		'dependencyNode',
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
		type: 'storageaction',
		extraParams: {
			type: 'scene'
		},
		reader: 'scene',
		writer: 'scene'
	},

	listeners: {
		loadscript: function() {
			this.readAccordingJSFile()
			this.unDirty()
		}
	},

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( options )
	},

	getFullName: function() {
		return this.get( 'sceneId' )
	},

	save: function() {
		this.getEntities().each(
			function( entity ) {
				entity.stripRedundantData()
			}
		)

		this.callParent( arguments )
	},

	addDebugSystems: function( debug ) {
		var systems     = [],
			systemStore = Ext.getStore( 'template.Systems')

		Ext.getStore( 'dependencies.library.Static' ).each(
			function( item ){
				var id = item.get( 'id' )

				if( debug || item.get( 'debugOnly' ) === false ) {
					var system = systemStore.findRecord( 'templateId', id, null, null, null, true )
					if( system ) systems.push( { id: id } )
				}
			}
		)

		return systems
	},

	getStaticLibraryIds: function( debug ) {
		var	result  = [],
			systems = Ext.clone( this.get( 'systems' ) )

		systems.debug = this.addDebugSystems( debug )

		Ext.getStore( 'dependencies.library.Static' ).each(
			function( item ){
				if( debug || !item.get( 'debugOnly' ) ) result.push( item.get( 'id' ) )
			}
		)

		return Ext.Array.clean( result )
	},

	checkForComponentChanges: function() {
		this.getEntities().each(
			function( entity ) {
				entity.checkForComponentChanges()
			}
		)
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

		if( arguments.length > 1 && params.id ) this.fireEvent( 'loadscript' )
	},

	setDirty: function() {
		this.getProject().setDirty()
		this.fireDirtyEvent()
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
					leaf      : false
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
