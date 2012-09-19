Ext.define('Spelled.store.script.Tree', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        text: "Scripts",
        expanded: true
    },

	generateNodesFromRecords: function( records ) {
		var rootNode  = this.getRootNode()

		Ext.Array.each(
			records,
			function( record ) {
				var namespace= record.get( 'scriptId'),
					parts    = namespace.split( '.'),
					i        = 0,
					lastNode = rootNode

				if( rootNode.findChild( 'id', record.get( 'id' ), true ) ) return

				for( i; i < parts.length - 1; i++ ) {
					var nodeId       = Ext.Array.slice( parts, 0, i ).join( '.' ),
						existingNode = lastNode.findChild( 'id', nodeId )

					if( existingNode ) {
						lastNode = existingNode
					} else {
						lastNode = lastNode.appendChild(
							rootNode.createNode( {
								text: parts[i],
								cls: 'folder',
								id: nodeId
							} )
						)
					}
				}

				lastNode.appendChild(
					rootNode.createNode( {
						text: record.get( 'name' ),
						leaf: true,
						id: record.getId()
					} )
				)
			}
		)
	}
});