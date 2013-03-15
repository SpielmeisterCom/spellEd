Ext.define('Spelled.abstract.view.GroupedTreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
	alias: 'widget.groupedtree',

	requires: [ 'Spelled.abstract.view.GroupedTreeView' ],

	viewType: 'groupedtreeview',

	groupTreeNodes: function() {
		var view = this.getView()

		view.store.group( 'group' )
	}
});


