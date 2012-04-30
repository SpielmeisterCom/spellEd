Ext.define('Spelled.store.ComponentsBlueprintTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.ComponentBlueprintActions.getTree,
        paramOrder: ['node']
    }
});