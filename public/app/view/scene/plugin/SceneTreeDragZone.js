Ext.define('Spelled.view.scene.plugin.SceneTreeDragZone' ,{
    extend: 'Spelled.abstract.plugin.ViewDragZone',

	isPreventDrag: function(e, record) {
console.log( record.get( 'id') + ": " + record.get( 'iconCls' ) )
		switch( record.get( 'iconCls' ) ) {
			case 'tree-scene-script-icon': return true
			case 'tree-scene-entity-icon':
			case 'tree-scene-entity-readonly-icon':

		}

		return this.callParent(arguments)
	}
})
