Ext.define('Spelled.abstract.store.TreeStore', {
    extend: 'Ext.data.TreeStore',

    hasFilter: false,

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