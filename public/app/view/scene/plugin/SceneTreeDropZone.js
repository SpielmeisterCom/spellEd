Ext.define('Spelled.view.scene.plugin.SceneTreeDropZone' ,{
    extend: 'Ext.tree.ViewDropZone',

	nodeOverCls: 'dragged-node-highlight',

	isValidDropPoint : function(node, position, dragZone, e, data) {
		if (!node || !data.item || !data.records) return false

		var view           = this.view,
			draggedRecords = data.records,
			targetNode     = view.getRecord( node ),
			valid          = false


		Ext.Array.each(
			draggedRecords,
			function( record ) {
				switch( record.get( 'iconCls' ) ) {
					case 'tree-system-icon':
						valid = this.checkSystemDrag( targetNode, position )
						break
					case 'tree-scene-entity-icon':
					case 'tree-scene-entity-readonly-icon':
						valid = this.checkEntityDrag(  targetNode  )
						break
				}

				if( !valid ) return false
			},
			this
		)

		if (Ext.Array.contains(draggedRecords, targetNode)) valid = false

		if( !valid ) return false

		return view.fireEvent('nodedragover', targetNode, position, data, e) !== false
	},


	onNodeOut: function( nodeData, source, e, data ) {
		var el = Ext.fly( nodeData )
		if( el && el.hasCls( this.nodeOverCls ) ) el.removeCls( this.nodeOverCls )
	},

	onNodeOver: function( nodeData, source, e, data ) {
		var result =  this.callParent(arguments);

		var el = Ext.fly( nodeData )

		if (result == 'x-tree-drop-ok-append' && el) {

			//mark the currently targeted node as active
			if (!el.hasCls( this.nodeOverCls ) ) el.addCls( this.nodeOverCls )

		} else {
			el.removeCls( this.nodeOverCls )
		}

		return result
	},

	checkSystemDrag: function( targetNode, position ) {
		var targetNodeType = targetNode.get( 'iconCls' ),
			parentNode     = targetNode.parentNode,
			parentNodeType = parentNode.get( 'iconCls' )

		if( targetNodeType === 'tree-system-icon' && parentNodeType === 'tree-system-folder-icon' ) return true
		if( targetNodeType === 'tree-system-folder-icon' && position === 'append' ) return true

		return false
	},

	checkEntityDrag: function( targetNode ) {
		var targetNodeType = targetNode.get( 'iconCls' )

		if( targetNodeType === 'tree-scene-entity-icon' || targetNodeType === 'tree-scene-entity-readonly-icon' ) return true

		return false
	}
})
