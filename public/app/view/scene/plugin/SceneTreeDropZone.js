Ext.define('Spelled.view.scene.plugin.SceneTreeDropZone' ,{
    extend: 'Ext.tree.ViewDropZone',

	isValidDropPoint : function(node, position, dragZone, e, data) {
		if (!node || !data.item || !data.records) return false

		var view           = this.view,
			draggedRecords = data.records,
			targetNode     = view.getRecord(node),
			targetNodeType = targetNode.get( 'iconCls' ),
			record         = draggedRecords[0],
			recordType     = record.get( 'iconCls' ),
			valid          = false


		switch( recordType ) {
			case 'tree-system-icon':
				valid = this.checkSystemDrag( targetNode, position )
				break
			case 'tree-scene-entity-icon':
			case 'tree-scene-entity-readonly-icon':
				valid = this.checkEntityDrag(  targetNode, position  )
				break
		}
console.log( targetNode )
console.log( "dragt: " + record.get( 'iconCls' ) + " -> " +targetNode.get( 'iconCls' ) )

		if (Ext.Array.contains(draggedRecords, targetNode)) valid = false

		return ( valid ) ? view.fireEvent( 'nodedragover', targetNode, position, data, e) : false
	},

	checkSystemDrag: function( targetNode, position ) {
		var targetNodeType = targetNode.get( 'iconCls' ),
			parentNode     = targetNode.parentNode,
			parentNodeType = parentNode.get( 'iconCls' )

		if( targetNodeType === 'tree-system-icon' && parentNodeType === 'tree-system-folder-icon' ) return true
		if( targetNodeType === 'tree-system-folder-icon' && position === 'append' ) return true

		return false
	},

	checkEntityDrag: function( targetNode, position ) {
		var targetNodeType = targetNode.get( 'iconCls' ),
			parentNode     = targetNode.parentNode,
			parentNodeType = parentNode.get( 'iconCls' )

		if( targetNodeType === 'tree-scene-entity-icon' || targetNodeType === 'tree-scene-entity-readonly-icon' ) return true

		return false
	}
})
