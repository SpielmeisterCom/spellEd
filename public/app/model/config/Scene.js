Ext.define('Spelled.model.config.Scene', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.storageaction',
		'Spelled.data.reader.Scene',
		'Spelled.data.writer.Scene'
	],
	mixins: [ 'Spelled.base.model.Model' ],

	iconCls : "tree-scene-icon",

	mergeDependencies: true,

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'scene' },
        'name',
		'namespace',
		'dependencies',
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
		},
		dirty: function() {
			this.updateDependencies()
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
		this.updateDependencies()

		this.getEntities().each(
			function( entity ) {
				entity.stripRedundantData()
			}
		)

		this.callParent( arguments )
	},

	getAssignedSystemDependencies: function( systems ) {
		var ids     = [],
			store   = Ext.getStore( 'template.Systems' )

		Ext.Object.each(
			systems,
			function( key, value ) {
				for ( var j = 0, l = value.length; j < l; j++ ) {
					var system = store.findRecord( 'templateId', value[j].id )

					if( system ) {
						ids.push( system.getFullName() )
						Ext.Array.push( ids, system.getDependencies() )
					}
				}
			}
		)

		return Ext.Array.clean( ids )
	},

	getCalculatedDependencies: function() {
		return this.getStaticLibraryIds()
	},

	addDebugSystems: function( debug ) {
		var systems     = [],
			systemStore = Ext.getStore( 'template.Systems')

		Ext.getStore( 'StaticLibraryDependencies' ).each(
			function( item ){
				var id = item.get( 'id' )

				if( debug || item.get( 'debugOnly' ) === false ) {
					var system = systemStore.findRecord( 'templateId', id )
					if( system ) systems.push( { id: id } )
				}
			}
		)

		return systems
	},

	getStaticLibraryIds: function( debug ) {
		var	result  = [],
			systems = Ext.clone( this.get( 'systems' ) ),
			merge   = Ext.Array.merge,
			store   = Ext.getStore( 'template.Systems' )

		systems.debug = this.addDebugSystems( debug )

		if( debug ) {
			Ext.getStore( 'StaticLibraryDependencies' ).each(
				function( item ){ result.push( item.get( 'id' ) ) }
			)
		}

		Ext.Object.each(
			systems,
			function( key, value ) {
				for ( var j = 0, l = value.length; j < l; j++ ) {
					var system = store.findRecord( 'templateId', value[j].id )

					if( system ) {
						result.push( system.getFullName() )
						Ext.Array.push( result, system.getDependencies() )
					}
				}
			}
		)

		this.getEntities().each(
			function( entity ) {
				result.push( entity.get( 'templateId' ) )
				result = merge( result, entity.getDependencies() )
			}
		)

		return Ext.Array.clean( result )
	},

	createDependencyNode: function() {
		var children = [],
			systems  = Ext.clone( this.get( 'systems' ) ),
			node     = { libraryId: this.getFullName(), children: children },
			store    = Ext.getStore( 'template.Systems' )

		systems.debug = this.addDebugSystems()

		Ext.Object.each(
			systems,
			function( key, value ) {
				for (var j = 0, l = value.length; j < l; j++) {
					var system = store.findRecord( 'templateId', value[j].id )

					if( system ) {
						children.push( system.createDependencyNode() )
					}
				}
			}
		)

		this.getEntities().each(
			function( entity ) {
				children.push( entity.createDependencyNode() )
			}
		)

		return node
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
