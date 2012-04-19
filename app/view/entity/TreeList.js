Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',
    animate: false,
    animCollapse: false,

    rootVisible: false,

    title: "Assets & Entities",
    store: "EntitiesTree"
});