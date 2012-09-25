Ext.define('Spelled.store.Library', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true,
		cls: 'folder'
    },
	listeners: {
		generateNodesFromRecords: function() {
			Ext.getStore( 'FoldersTree' ).filter(function( item ) {
				return item.get( 'cls' ) === 'folder'
			})
		}
	}
});
