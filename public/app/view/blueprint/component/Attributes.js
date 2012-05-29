Ext.define('Spelled.view.blueprint.component.Attributes' ,{
    extend: 'Ext.tree.Panel',
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