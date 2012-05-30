Ext.define('Spelled.view.blueprint.component.Attributes' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.componentblueprintattributeslist',

    title: 'Attributes',
    rootVisible: true,
    flex: 1,

    bbar: [
        {
            text: "Add Attribute",
            action: "addAttribute"
        }
    ]
});