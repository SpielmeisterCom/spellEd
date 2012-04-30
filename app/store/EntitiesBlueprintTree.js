Ext.define('Spelled.store.EntitiesBlueprintTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.EntityBlueprintActions.getTree,
        paramOrder: ['node']
    }
});