Ext.define('Spelled.store.Library', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true,
		cls: 'folder'
    },

	sortHelper : function( node1, node2, field ) {
		var node1SortOrder = node1.get( field ),
			node2SortOrder = node2.get( field )

		if ( node1SortOrder === node2SortOrder) return 0

		return node1SortOrder < node2SortOrder ? -1 : 1
	},

	sortFunction: function( node ) {
			var me = this

			node.sort(
				function( node1, node2 ) {
					var result = me.sortHelper( node1, node2, 'qtitle' )

					if( result === 0 ) {
						return me.sortHelper( node1, node2, 'text' )
					} else return result
				},
				false,
				true
			)
	},

	listeners: {
		expand: function( node ) {
			this.sortFunction( node )
		},
		generateNodesFromRecords: function( records ) {
			Ext.getStore( 'FoldersTree' ).generateNodesFromRecords( records )
		}
	}
});
