Ext.define('Spelled.abstract.plugin.ViewDragZone' ,{
    extend: 'Ext.tree.ViewDragZone',

	isPreventDrag: function(e, record) {
		return this.callOverridden(arguments) || !record.isLeaf();
	}
});
