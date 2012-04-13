Ext.define('Spelled.store.Zones', {
    extend: 'Ext.data.TreeStore',
    model: 'Spelled.model.Zone',

    proxy: {
        type: 'direct',
        directFn: Spelled.ZonesActions.getListing
    },

    root: {
        text: 'Zones',
        id: 'data',
        expanded: false
    },

    folderSort: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }]
});