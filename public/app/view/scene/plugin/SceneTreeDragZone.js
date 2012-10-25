Ext.define('Spelled.view.scene.plugin.SceneTreeDragZone' ,{
    extend: 'Ext.tree.ViewDragZone',

	animRepair: false,

	isPreventDrag: function(e, record) {
		switch( record.get( 'iconCls' ) ) {
			case 'tree-system-icon':
				record.set( 'allowDrag', true )
				break
			case 'tree-scene-entity-icon':
			case 'tree-scene-entity-readonly-icon':
				record.set( 'allowDrag', this.checkEntityNodeIfDraggable( record ) )
				break
			default:
				record.set( 'allowDrag', false )
		}

		return (record.get('allowDrag') === false)
	},

	checkEntityNodeIfDraggable: function( node ) {
		var entity    = Ext.getStore( 'config.Entities' ).getById( node.getId() )

		return entity.isRemovable()
	}
})
