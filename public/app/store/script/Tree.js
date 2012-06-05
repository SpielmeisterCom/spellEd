Ext.define('Spelled.store.script.Tree', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        text: "Scripts",
        expanded: true
    },
    proxy: {
        type: 'direct',
        directFn: Spelled.ScriptsActions.getTree,
        paramOrder: [ 'node', 'projectName' ]
    }
});