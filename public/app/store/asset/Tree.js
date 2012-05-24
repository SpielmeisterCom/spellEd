Ext.define('Spelled.store.asset.Tree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.AssetsActions.getTree,
        paramOrder: [ 'node', 'projectName' ]
    }
});