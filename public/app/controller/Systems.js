Ext.define('Spelled.controller.Systems', {
	extend: 'Ext.app.Controller',

	views: [
		'system.List',
		'system.Add'
	],

	models: [
		'blueprint.System'
	],

	stores: [
		'blueprint.Systems',
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
				editclick   :   this.showZoneSystemsListContextMenu,
				itemmouseenter: this.application.showActionsOnLeaf,
				itemmouseleave: this.application.hideActions
			},
			'systemlist > treeview': {
				drop: this.updateZoneSystems
			},
		    'systemlist [action="showAddSystem"]': {
				click: this.showAddSystem
			},
			'addsystem button[action="addSystems"]': {
				click: this.addSystems
			}
		})
	},

	showZoneSystemsListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showZoneSystemsListContextMenu( e )
	},

	removeZoneSystem: function( systemId ) {
		var zone    = this.application.getActiveZone()

		var result = {}
		Ext.Object.each(
			zone.get('systems'),
			function( key, values ) {
				result[ key ] = Ext.Array.remove( values, systemId )
			}
		)

		zone.set( 'systems', result )
		this.refreshZoneSystemList( zone )
	},

	addSystems: function( button ) {
		var window  = button.up('window'),
			values  = window.down('form').getForm().getValues(),
			tree    = window.down('treepanel'),
			records = tree.getView().getChecked(),
			zone    = this.application.getActiveZone(),
			systems = zone.get('systems')

		Ext.each(
			records,
			function( record ) {
				systems[ values.type ].push( record.get('text') )
			}
		)

		zone.set( 'systems', systems )

		this.refreshZoneSystemList( zone )

		window.close()
	},

	showAddSystem: function( ) {
		var View = this.getSystemAddView(),
			view = new View(),
			availableSystemsView  = view.down( 'treepanel' ),
			blueprintSystemsStore = Ext.getStore( 'blueprint.Systems' ),
			zone    			  = this.application.getActiveZone()

		var assignedSystems = []
		Ext.Object.each(
			zone.get('systems'),
			function( key, value ) {
				assignedSystems = Ext.Array.merge( assignedSystems, value )
			}
		)

		var rootNode = availableSystemsView.getStore().setRootNode( {
				text: 'Systems',
				expanded: true
			}
		)

		blueprintSystemsStore.each(
			function( blueprint ) {
				if( !Ext.Array.contains( assignedSystems, blueprint.getFullName() ) ) {
					rootNode.appendChild(
						rootNode.createNode ( {
							text      : blueprint.getFullName(),
							id        : blueprint.getFullName(),
							expanded  : true,
							leaf      : true,
							checked   : false
						} )
					)
				}
			}
		)

		view.show()
	},

	updateZoneSystems: function( node, data, model ) {
		var getRootNode = function( node ) {
			if( node.isRoot() ) return node
			else return getRootNode( node.parentNode )
		}

		var parent = getRootNode( model ) ,
			zone   = this.application.getActiveZone()

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

		zone.set('systems', systems)
	},

	showSystemItem: function( treePanel, record ) {
		if( !record.data.leaf ) return

		this.application.getController('Blueprints').openBlueprint( treePanel, record )
		Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Blueprints') )
	},

	refreshZoneSystemList: function( zone ) {
		var contentPanel = this.getRightPanel(),
			View     = this.getSystemListView(),
			tree     = new View(),
			rootNode = tree.getStore().getRootNode(),
			me       = this

		contentPanel.add( tree )
		rootNode.removeAll()

		var systems = zone.get('systems')

		Ext.Object.each(
			zone.get('systems'),
			function( key, value ) {
				var node = rootNode.createNode( {
					text      : key,
					id        : key,
					expanded  : true,
					leaf      : false
				} )

				Ext.each(
					value,
					function( systemId ) {

						var systemBlueprint =  Ext.getStore('blueprint.Systems').getByBlueprintId( systemId )

						if( systemBlueprint ) {
							node.appendChild(
								node.createNode( {
										text         : systemBlueprint.getFullName(),
										cls		     : me.application.getController('Blueprints').BLUEPRINT_TYPE_SYSTEM,
										leaf         : true,
										id           : systemBlueprint.getId()
									}
								)
							)
						}
					}
				)

				rootNode.appendChild( node )
			}
		)
	}
});