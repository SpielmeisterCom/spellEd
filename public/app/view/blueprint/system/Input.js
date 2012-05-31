Ext.define('Spelled.view.blueprint.system.Input' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.systemblueprintinputlist',

    title: 'Input',
    flex: 1,

    bbar: [
        {
            text: "Add",
            action: "showAddInput"
        }
    ]
});