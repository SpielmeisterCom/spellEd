Ext.define('Spelled.view.template.system.Input' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.systemtemplateinputlist',

    title: 'Input',
    flex: 1,

    bbar: [
        {
            text: "Add",
            action: "showAddInput"
        }
    ]
});
