Ext.define('Spelled.controller.Systems', {
	extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.system.Add',

		'Spelled.model.template.System',

		'Spelled.store.template.Systems',
		'Spelled.store.system.Types'
	],

	views: [
		'system.Add'
	],

	models: [
		'template.System'
	],

	stores: [
		'template.Systems',
		'system.Types'
	],

	refs: [
		{
			ref : 'ScenesTree',
			selector: '#ScenesTree'
		},
		{
			ref : 'LibraryEditor',
			selector: '#SceneEditor'
		},
		{
			ref: 'Navigator',
			selector: '#Navigator'
		}
	],

	init: function() {
		this.control({
			'addsystem button[action="addSystems"]': {
				click: this.addSystems
			},
			'scenesystemslistcontextmenu [action="showAddSystem"]': {
				click: this.showAddSystem
			}
		})

		this.application.on({
				showsystemitem    : this.showSystemItem,
				updatescenesystem : this.sendSystemUpdateFromSceneToEngine,
				movescenesystem   : this.moveSystem,
				scope: this
			}
		)
	},

	moveSystem: function( node ) {
		this.updateSceneSystems( node )
	},

	moveSystemNodeDown: function( node ) {
		if( node.nextSibling ) {
			node.parentNode.insertBefore( node.nextSibling, node )
			this.updateSceneSystems( node )
		}
	},

	moveSystemNodeUp: function( node ) {
		if( node.previousSibling ) {
			node.parentNode.insertBefore( node, node.previousSibling )
			this.updateSceneSystems( node )
		}
	},

	showSceneSystemsItemListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showSceneSystemsItemListContextMenu( e )
	},

	showSceneSystemsListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showSceneSystemsListContextMenu( e )
	},

	removeSceneSystem: function( systemId, folder ) {
		var scene    = this.application.getActiveScene(),
			systems  = scene.get('systems')[ folder ]

		Ext.Array.each(
			systems,
			function( item ) {
				if( item.id === systemId ) {
					Ext.Array.remove( systems, item )
					this.sendSystemRemoveFromSceneToEngine( item.id, folder )
					return false
				}
			},
			this
		)

		scene.setDirty()
		this.refreshSceneSystemList( scene )
	},

	sendSystemAddToSceneToEngine: function( system, executionGroupId, index ) {
		this.application.fireEvent( "sendToEngine",
			"system.add",
			{
				executionGroupId: executionGroupId,
				systemConfig: system.config,
				index: index,
				systemId: system.id
			}
		)
	},

	sendSystemUpdateFromSceneToEngine: function( executionGroupId, system, systemConfig ) {
		this.application.fireEvent( "sendToEngine",
			"system.update",
			{
				executionGroupId: executionGroupId,
				definition: Ext.amdModules.systemConverter.toEngineFormat( system.getData( true ), { includeNamespace: true } ),
				systemConfig: systemConfig,
				systemId: system.getFullName()
			}
		)
	},

	sendSystemRemoveFromSceneToEngine: function( id, executionGroupId ) {
		this.application.fireEvent( "sendToEngine",
			"system.remove",
			{
				executionGroupId: executionGroupId,
				systemId: id
			}
		)
	},

	addSystems: function( button ) {
		var window  = button.up('window'),
			values  = window.down('form').getForm().getValues(),
			tree    = window.down('treepanel'),
			records = tree.getView().getChecked(),
			scene   = this.application.getActiveScene(),
			systems = scene.get('systems'),
			store   = this.getTemplateSystemsStore()

		Ext.each(
			records,
			function( record ) {
				var system       = store.findRecord( 'templateId', record.get('text') ),
					systemConfig = { id: record.get('text'), config: system.getConfigForScene() }

				systems[ values.type ].push( systemConfig )
				this.sendSystemAddToSceneToEngine( systemConfig, values.type, systems[ values.type ].length - 1 )
			},
			this
		)

		scene.set( 'systems', systems )
		scene.setDirty()

		this.refreshSceneSystemList( scene )

		window.close()
	},

	showAddSystem: function( ) {
		var View = this.getSystemAddView(),
			view = new View(),
			availableSystemsView = view.down( 'treepanel' ),
			templateSystemsStore = Ext.getStore( 'template.Systems' ),
			scene    			 = this.application.getActiveScene()

		var assignedSystems = []
		Ext.Object.each(
			scene.get('systems'),
			function( key, value ) {
				Ext.Array.each(
					value,
					function( item ) {
						assignedSystems.push( item.id )
					}
				)
			}
		)

		var rootNode = availableSystemsView.getStore().setRootNode( {
				text: 'Systems',
				expanded: true
			}
		)

		templateSystemsStore.each(
			function( template ) {
				if( !template.get( 'engineInternal' ) && !Ext.Array.contains( assignedSystems, template.getFullName() ) ) {
					rootNode.appendChild(
						rootNode.createNode ( {
							text      : template.getFullName(),
							id        : template.getFullName(),
							expanded  : true,
							cls		  : this.application.getController('Templates').TEMPLATE_TYPE_SYSTEM,
							iconCls   : "tree-system-icon",
							leaf      : true,
							checked   : false
						} )
					)
				}
			},
			this
		)

		view.show()
	},

	updateSceneSystems: function( node ) {
		var getRootNode = function( node ) {
			if( node.get( 'text' ) === "Systems" ) return node
			else return getRootNode( node.parentNode )
		}

		var parent   = getRootNode( node ),
			scene    = this.application.getActiveScene()

		var systems = {}
		parent.eachChild(
			function( folder ) {
				systems[ folder.get('text') ] = []
				folder.eachChild(
					function( leaf ){
						systems[ folder.get('text') ].push( { id: leaf.get('text'), config: leaf.systemConfig } )
					}
				)
			}
		)

		scene.set('systems', systems)
		scene.setDirty()
	},

	showSystemItem: function( treePanel, record ) {
		if( !record.data.leaf ) return

		this.getNavigator().setActiveTab( this.getLibraryEditor() )
		this.application.getController('Templates').openTemplate( treePanel, record )
	},

	refreshSceneSystemList: function( scene ) {
		var tree     = this.getScenesTree(),
			rootNode = tree.getStore().getRootNode().findChild( 'id', scene.getId() ).findChild( 'text', 'Systems' ),
			me       = this

		rootNode.removeAll()
		rootNode.set( 'allowDrop', false )

		Ext.Object.each(
			scene.get('systems'),
			function( key, value ) {
				var node = rootNode.createNode( {
					text      : key,
					id        : key,
					leaf      : false,
					allowDrop : true,
					allowDrag : false,
					iconCls   : "tree-system-folder-icon"
				} )

				rootNode.appendChild( node )

				Ext.each(
					value,
					function( system ) {
						var systemTemplate =  Ext.getStore('template.Systems').getByTemplateId( system.id )
						if( systemTemplate ) {
							var config = Ext.Object.merge( {}, systemTemplate.getConfigForScene(), system.config )

							var newNode = node.createNode( {
									text         : systemTemplate.getFullName(),
									cls		     : me.application.getController('Templates').TEMPLATE_TYPE_SYSTEM,
									config       : config,
									leaf         : true,
									allowDrop    : false,
									allowDrag    : true,
									id           : systemTemplate.getId(),
									iconCls      : "tree-system-icon"
								}
							)

							system.config = config
							newNode.systemConfig = system.config
							node.appendChild( newNode )
						}
					}
				)
			}
		)
	}
});
