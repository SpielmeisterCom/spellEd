Ext.define('Spelled.store.Library', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true,
		cls: 'folder'
    },
	listeners: {
		generateNodesFromRecords: function( records ) {
			Ext.getStore( 'FoldersTree' ).generateNodesFromRecords( records )
		}
	}
});
