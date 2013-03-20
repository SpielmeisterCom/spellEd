Ext.define('Spelled.base.view.GroupedTreeList' ,{
    extend: 'Spelled.base.view.TreeList',
	alias: 'widget.groupedtree',

	requires: [ 'Spelled.base.view.GroupedTreeView' ],

	viewType: 'groupedtreeview',

	groupTreeNodes: function() {
		var view = this.getView()
		view.store.model = this.store.model

		view.store.group( 'group' )
	}
});


