Ext.define('Spelled.store.TemplatesTree', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.TemplatesActions.getTree,
        paramOrder: [ 'node', 'projectName' ]
    }
});
