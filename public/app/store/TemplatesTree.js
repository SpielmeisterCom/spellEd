Ext.define('Spelled.store.TemplatesTree', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.TemplatesActions.getTree,
        paramOrder: [ 'node', 'projectName' ]
    }
});
