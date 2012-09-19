Ext.define('Spelled.store.script.FoldersTree', {
    extend: 'Spelled.store.script.Tree',

	listeners: {
		load: function() {
			this.filter(
				Ext.create('Ext.util.Filter', {
					filterFn: function( item ) {
						return item.data.cls === 'folder'
					}
				})
			)
		}
	}
});