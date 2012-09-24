Ext.define('Spelled.abstract.store.TreeStore', {
    extend: 'Ext.data.TreeStore',

    hasFilter: false,

	createParentNode: function( node, parts ) {
		if( parts.length === 0 ) return node

		var part        = parts.shift(),
			localNodeId = node.getId() + "." + part,
			localNode   = node.findChild( 'id', localNodeId )

		if( !part ) return node

		if( !localNode ) {
			localNode = node.appendChild(
				node.createNode( {
					text : part,
					cls  : 'folder',
					id   : localNodeId
				} )
			)
		}

		return this.createParentNode( localNode, parts )
	},

	generateNodesFromRecords: function( records ) {
		var rootNode  = this.getRootNode()

		Ext.Array.each(
			records,
			function( record ) {
				var namespace = record.get( 'namespace' ),
					parts     = namespace.split( '.' )

				if( rootNode.findChild( 'id', record.get( 'id' ), true ) ) return

				record.createTreeNode( this.createParentNode( rootNode, parts ) )
			},
			this
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