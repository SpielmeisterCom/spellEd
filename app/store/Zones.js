Ext.define('Spelled.store.Zones', {
    extend: 'Ext.data.TreeStore',
//    model: 'Spelled.model.Zone',

    proxy: {
        type: 'direct',
        directFn: Spelled.ZoneListing.getTree
    },

    root: {
        text: 'Zones',
        id: 'data',
        expanded: false
    },

    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});