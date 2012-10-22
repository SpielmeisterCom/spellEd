Ext.define('Spelled.view.scene.plugin.SceneTreeDropZone' ,{
    extend: 'Ext.tree.ViewDropZone',

	isValidDropPoint : function(node, position, dragZone, e, data) {
		if (!node || !data.item || !data.records) return false

		var view       = this.view,
			targetNode = view.getRecord(node),
			record     = data.records[0]

console.log( record )
console.log( targetNode )

		return this.callParent( arguments )
	}
})
