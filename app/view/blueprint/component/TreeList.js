Ext.define('Spelled.view.blueprint.component.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.componentsblueprinttreelist',

    animate: false,
    animCollapse: false,
    title : 'All Component Blueprints',
    store : 'ComponentsBlueprintTree',

    rootVisible: false
});