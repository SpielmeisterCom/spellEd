Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.base.view.TreeList',
    alias : 'widget.scenetreelist',

	requires: [
		'Spelled.view.scene.plugin.CellEditing',
		'Spelled.view.scene.plugin.TreeViewDragDrop'
	],

    store : 'ScenesTree',

	viewConfig: {
		plugins: {
			ptype: 'scenetreedragdrop'
		}
	},

    rootVisible: false,

    tbar: [
		{
			text: 'Create',
			icon: 'resources/images/icons/add.png',
			menu: [
				{
					text: "Add new scene",
					tooltip: Spelled.Configuration.getDemoTooltipText(),
					disabled: Spelled.Configuration.isDemoInstance(),
					action: "showCreateScene",
					icon: 'resources/images/icons/scene-add.png'
				},
				{
					text: "Add new entity",
					action: "showCreateEntity",
					icon: 'resources/images/icons/entity-add.png'
				},
				{
					text: "Add system",
					action: "showAddSystem",
					icon: 'resources/images/icons/system-add.png'
				}
			]
		}
	],

	initComponent: function() {
		var me         = this,
			cellEditor = Ext.create( 'Spelled.view.scene.plugin.CellEditing' )

		Ext.applyIf( me, {
				plugins:[ cellEditor ],
				listeners: {
					afterrender: function() {
						cellEditor.removeManagedListener( cellEditor.view, 'celldblclick' )
					},
					validateedit: function( editor, e ) {
						var name         = e.value,
							node         = e.record,
							owner        = node.parentNode,
							msg          = null,
							existingNode = owner.findChild( 'text', name )

						if( existingNode && existingNode != node ) {
							msg = "The name '"+ name +"' is already given."
						} else if( !cellEditor.isConfigEntityCompliant( name ) || !Ext.form.field.VTypes.alphanum( name ) ){
							msg = "Only alphanumaric characters allowed."
						}

						if( msg ) {
							Spelled.MessageBox.alert( 'Error', msg )
							return false
						}
					}
				}
			}
		)

		me.callParent()
	}
});
