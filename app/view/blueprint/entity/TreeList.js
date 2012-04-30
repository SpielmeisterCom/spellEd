Ext.define('Spelled.view.blueprint.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entitiesblueprinttreelist',

    animate: false,
    animCollapse: false,
    title : 'All Entity Blueprints',
    store : 'EntitiesBlueprintTree',

    rootVisible: false
});