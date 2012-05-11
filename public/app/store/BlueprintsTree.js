Ext.define('Spelled.store.BlueprintsTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.BlueprintsActions.getTree,
        paramOrder: ['node']
    }
});