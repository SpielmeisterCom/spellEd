Ext.define('Spelled.store.FoldersTree', {
	extend: 'Spelled.base.store.TreeStore',

    root: {
        expanded: true,
		cls: 'folder'
	},
	filters: [
		function( item ) {
			return item.get( 'cls' ) === 'folder' && item.get( 'text' ) !== 'spell'
		}
	]

});
