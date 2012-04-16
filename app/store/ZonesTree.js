Ext.define('Spelled.store.ZonesTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        text: 'Zones',
        id: 'data',
        expanded: false
    },

    proxy: {
        type: 'direct',
        directFn: Spelled.ZonesActions.getListing
    },

    folderSort: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }]
});