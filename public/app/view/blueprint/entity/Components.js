Ext.define('Spelled.view.blueprint.entity.Components' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entityblueprintcomponentslist',

    title: 'Components',
    rootVisible: false,
    flex: 1,

    bbar: [
        {
            text: "Add Component",
            action: "showAddComponent"
        }
    ]
});