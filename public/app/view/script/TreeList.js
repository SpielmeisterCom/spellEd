Ext.define('Spelled.view.script.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scriptstreelist',

    animate: false,
    animCollapse: false,
    title : 'All Scripts',
    store : 'script.Tree',

    rootVisible: false
});
