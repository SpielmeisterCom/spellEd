Ext.define('Spelled.view.blueprint.system.input.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addinputtoblueprint',

    title: "Add new Input-Definition to the System",
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
            action: 'addInput'
        }
    ]

});