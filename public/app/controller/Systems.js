Ext.define('Spelled.controller.Systems', {
	extend: 'Ext.app.Controller',

	views: [
		'system.List',
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
			ref : 'RightPanel',
			selector: '#RightPanel'
		}
	],

	init: function() {
		this.control({
			'systemlist': {
				itemdblclick  : this.showSystemItem,
				itemcontextmenu: this.showSceneSystemsListContextMenu,
				editclick   :   this.showSceneSystemsListContextMenu,
				itemmouseenter: this.application.showActionsOnLeaf,
				itemmouseleave: this.application.hideActions
			},
			'systemlist > treeview': {
				drop: this.updateSceneSystems
			},
		    'systemlist [action="showAddSystem"]': {
				click: this.showAddSystem
			},
			'addsystem button[action="addSystems"]': {
				click: this.addSystems
			}
		})
	},

	moveSystemNodeDown: function( node ) {
		if( node.nextSibling ) {
			node.parentNode.insertBefore( node.nextSibling, node )
			this.updateSceneSystems( null, null, node )
		}
	},

	moveSystemNodeUp: function( node ) {
		if( node.previousSibling ) {
			node.parentNode.insertBefore( node, node.previousSibling )
			this.updateSceneSystems( null, null, node )
		}
	},

	showSceneSystemsListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showSceneSystemsListContextMenu( e )
	},

	removeSceneSystem: function( systemId ) {
		var scene    = this.application.getActiveScene()

		var result = {}
		Ext.Object.each(
			scene.get('systems'),
			function( key, values ) {
				result[ key ] = Ext.Array.remove( values, systemId )
			}
		)

		scene.set( 'systems', result )
		this.refreshSceneSystemList( scene )
	},

	addSystems: function( button ) {
		var window  = button.up('window'),
			values  = window.down('form').getForm().getValues(),
			tree    = window.down('treepanel'),
			records = tree.getView().getChecked(),
			scene   = this.application.getActiveScene(),
			systems = scene.get('systems')

		Ext.each(
			records,
			function( record ) {
				systems[ values.type ].push( record.get('text') )
			}
		)

		scene.set( 'systems', systems )

		this.refreshSceneSystemList( scene )

		window.close()
	},

	showAddSystem: function( ) {
		var View = this.getSystemAddView(),
			view = new View(),
			availableSystemsView  = view.down( 'treepanel' ),
			templateSystemsStore = Ext.getStore( 'template.Systems' ),
			scene    			  = this.application.getActiveScene()

		var assignedSystems = []
		Ext.Object.each(
			scene.get('systems'),
			function( key, value ) {
				assignedSystems = Ext.Array.merge( assignedSystems, value )
			}
		)

		var rootNode = availableSystemsView.getStore().setRootNode( {
				text: 'Systems',
				expanded: true
			}
		)

		templateSystemsStore.each(
			function( template ) {
				if( !Ext.Array.contains( assignedSystems, template.getFullName() ) ) {
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

	updateSceneSystems: function( node, data, model ) {
		var getRootNode = function( node ) {
			if( node.isRoot() ) return node
			else return getRootNode( node.parentNode )
		}

		var parent = getRootNode( model ) ,
			scene  = this.application.getActiveScene()

		var systems = {}
		parent.eachChild(
			function( folder ) {
				systems[ folder.get('text') ] = []
				folder.eachChild(
					function( leaf ){
						systems[ folder.get('text') ].push( leaf.get('text') )
					}
				)
			}
		)

		scene.set('systems', systems)
	},

	showSystemItem: function( treePanel, record ) {
		if( !record.data.leaf ) return

		this.application.getController('Templates').openTemplate( treePanel, record )
		Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Templates') )
	},

	refreshSceneSystemList: function( scene ) {
		var contentPanel = this.getRightPanel(),
			View     = this.getSystemListView(),
			tree     = new View(),
			rootNode = tree.getStore().getRootNode(),
			me       = this

		contentPanel.removeAll()
		rootNode.removeAll()

		rootNode.set( 'allowDrop', false )

		Ext.Object.each(
			scene.get('systems'),
			function( key, value ) {
				var node = rootNode.createNode( {
					text      : key,
					id        : key,
					expanded  : true,
					leaf      : false,
					allowDrop : true,
					allowDrag : false,
					iconCls   : "tree-system-folder-icon"
				} )

				rootNode.appendChild( node )

				Ext.each(
					value,
					function( systemId ) {

						var systemTemplate =  Ext.getStore('template.Systems').getByTemplateId( systemId )

						if( systemTemplate ) {
							node.appendChild(
								node.createNode( {
										text         : systemTemplate.getFullName(),
										cls		     : me.application.getController('Templates').TEMPLATE_TYPE_SYSTEM,
										leaf         : true,
										allowDrop    : false,
										allowDrag    : true,
										id           : systemTemplate.getId(),
										iconCls      : "tree-system-icon"
									}
								)
							)
						}
					}
				)


			}
		)

		contentPanel.add( tree )
	}
});
