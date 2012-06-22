Ext.define('Spelled.view.template.component.Attributes' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.componenttemplateattributeslist',

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
