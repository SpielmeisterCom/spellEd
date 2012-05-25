Ext.define('Spelled.view.blueprint.entity.components.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addcomponenttoblueprint',

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
            formBind: true,
            text: 'Add',
            action: 'addComponent'
        }
    ]

});