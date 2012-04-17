Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',

    rootVisible: false,

    title: "Assets & Entities",
    store: "EntitiesTree"
});