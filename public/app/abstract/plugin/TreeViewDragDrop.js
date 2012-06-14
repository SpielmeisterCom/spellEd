Ext.define('Spelled.abstract.plugin.TreeViewDragDrop' ,{
    extend: 'Ext.tree.plugin.TreeViewDragDrop',
	alias: 'plugin.treeviewnodedragdrop',

	requires: [
		'Ext.tree.ViewDragZone',
		'Ext.tree.ViewDropZone'
	]
});


