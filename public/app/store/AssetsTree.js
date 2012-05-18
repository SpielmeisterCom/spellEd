Ext.define('Spelled.store.AssetsTree', {
    extend: 'Ext.data.TreeStore',

    filters: [
        new Ext.util.Filter({
            filterFn: function(item) {
                return item.cls !== 'file'
            }
        })
    ],

    root: {
        expanded: true
    }
});