Ext.define('Spelled.view.blueprint.entity.Components' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.entityblueprintcomponentslist',

    title: 'Components',
    flex: 1,

    bbar: [
        {
            text: "Add Component",
            action: "showAddComponent"
        }
    ]
});