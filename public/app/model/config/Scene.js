Ext.define('Spelled.model.config.Scene', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.direct',
		'Spelled.data.reader.Scene',
		'Spelled.data.writer.Scene'
	],
	mixins: [ 'Spelled.abstract.model.Model' ],

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
				Ext.Array.each(
					value,
					function( item ) {
						var system = store.findRecord( 'templateId', item.id )

						if( system ) {
							ids.push( system.getFullName() )
							Ext.Array.push( ids, system.getDependencies() )
						}
					}
				)
			}
		)

		return Ext.Array.clean( ids )
	},

	getCalculatedDependencies: function() {
		return this.getStaticLibraryIds()
	},

	getStaticLibraryIds: function( debug ) {
		var	result      = [],
			systems     = Ext.clone( this.get( 'systems' ) ),
			merge       = Ext.Array.merge,
			systemStore = Ext.getStore( 'template.Systems')

		systems.debug = []

		Ext.getStore( 'StaticLibraryDependencies' ).each(
			function( item ){
				var id = item.get( 'id' )

				if( debug || item.get( 'debugOnly' ) === false ) {
					result.push( id )

					var system = systemStore.findRecord( 'templateId', id )
					if( system ) systems.debug.push( { id: id } )
				}
			}
		)

		result = merge( result, this.getAssignedSystemDependencies( systems ) )

		this.getEntities().each(
			function( entity ) {
				result.push( entity.get( 'templateId' ) )
				result = merge( result, entity.getDependencies() )
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

		},
		dirty: function() {
			this.updateDependencies()
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
