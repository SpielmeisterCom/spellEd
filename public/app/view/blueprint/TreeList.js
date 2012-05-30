Ext.define('Spelled.view.blueprint.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.blueprintstreelist',

    animate: false,
    animCollapse: false,
    title : 'All Blueprints',
    store : 'BlueprintsTree',

    rootVisible: false
});
