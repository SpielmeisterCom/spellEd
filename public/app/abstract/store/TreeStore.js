Ext.define('Spelled.abstract.store.TreeStore', {
    extend: 'Ext.data.TreeStore',

    hasFilter: false,

	generateNodesFromRecords: function( records ) {
		var rootNode  = this.getRootNode()

		Ext.Array.each(
			records,
			function( record ) {
				var namespace = record.getFullName(),
					parts     = namespace.split( '.'),
					i         = 0,
					lastNode  = rootNode

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

				record.createTreeNode( lastNode )
			}
		)
	},

    filter: function(filters, value) {

        if (Ext.isString(filters)) {
            filters = {
                property: filters,
                value: value
            };
        }

        var me = this,
            decoded = me.decodeFilters(filters),
            i = 0,
            length = decoded.length;

        for (; i < length; i++) {
            me.filters.replace(decoded[i]);
        }

        Ext.Array.each(me.filters.items, function(filter) {
            Ext.Object.each(me.tree.nodeHash, function(key, node) {
                if (filter.filterFn) {
                    if (!filter.filterFn(node)) node.remove();
                } else {
                    if (node.data[filter.property] != filter.value) node.remove();
                }
            });
        });
        me.hasFilter = true;
    },

    clearFilter: function() {
        var me = this;
        me.filters.clear();
        me.hasFilter = false;
        me.load();
    },

    isFiltered: function() {
        return this.hasFilter;
    }
});