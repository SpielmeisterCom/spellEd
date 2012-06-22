Ext.define('Spelled.view.template.entity.components.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addcomponenttotemplate',

    title: "Add Components to the Entity",
    modal: true,
    closable: true,

    layout: 'fit',
    width : 550,
    height: 450,

    items: [
        {
            xtype: 'treepanel',
            title: 'Available Components',
            rootVisible: true
        }
    ],

    buttons: [
        {
            text: 'Add',
            action: 'addComponent'
        }
    ]

});
