Ext.define('Spelled.store.asset.Tree', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.AssetsActions.getTree,
        paramOrder: [ 'node', 'projectName' ]
    }
});