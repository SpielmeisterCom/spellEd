Ext.define('Spelled.store.Zones', {
    extend: 'Ext.data.TreeStore',
//    model: 'Spelled.model.Zone',

    proxy: {
        type: 'direct',
        directFn: TestAction.getTree
    },

//    proxy: {
//        type: 'direct',
//        directFn: function() {
//            console.log( "BACK" )
//        },
//        paramOrder: 'id' // Tells the proxy to pass the id as the first parameter to the remoting method.
//    },

    root: {
        text: 'Zones',
        id: 'src',
        expanded: false
    },

    folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});