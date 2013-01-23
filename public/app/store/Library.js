Ext.define('Spelled.store.Library', {
    extend: 'Spelled.abstract.store.TreeStore',

	model: 'Spelled.model.LibraryNode',

    root: {
        expanded: true,
		cls: 'folder'
    },

	proxy: 'memory',

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
				var result = me.sortHelper( node1, node2, 'sortOrder' )

				if( result === 0 ) {
					return me.sortHelper( node1, node2, 'text' )
				} else return result
			},
			false,
			true
		)
	},

	getNodeByLibraryId: function( libraryId ) {
		return this.getRootNode().findChild( 'libraryId', libraryId, true )
	},

	findLibraryItemByLibraryId: function( libraryId ) {
		var node   = this.getNodeByLibraryId( libraryId ),
			result = null

		if( node ) {
			var type = node.get( 'cls' )

			switch( type ) {
				case 'component':
					result = Ext.getStore( 'template.Components' ).getByTemplateId( libraryId )
					break
				case 'entityTemplate':
					result = Ext.getStore( 'template.Entities' ).getByTemplateId( libraryId )
					break
				case 'scene':
					result = Ext.getStore( 'config.Scenes' ).findRecord( 'sceneId', libraryId )
					break
				case 'system':
					result = Ext.getStore( 'template.Systems' ).getByTemplateId( libraryId )
					break
				default:
					var store = Spelled.StoreHelper.getAssetStoreByType( type )

					if( store ) result = store.findRecord( 'myAssetId', libraryId )
			}
		}

		return result
	},

	getAllLibraryIds: function() {
		var ids = []

		var getLeafs = function( node ) {
			if( node.get( 'libraryId' ) && node.get( 'cls' ) != "folder" ) ids.push( node.convertToDependencyObject() )

			node.eachChild( getLeafs )

			return ids
		}


		return getLeafs( this.getRootNode() )
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
