Ext.define('Spelled.view.blueprint.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.blueprintstreelist',

    animate: false,
    animCollapse: false,
    title : 'All Blueprints',
    store : 'BlueprintsTree',

    rootVisible: false
});