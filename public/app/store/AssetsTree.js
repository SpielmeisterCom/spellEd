Ext.define('Spelled.store.AssetsTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.AssetsActions.getTree,
        paramOrder: ['node', 'projectName'],
        extraParams: {
            projectName: 'ExampleProject'
        }
    }
});