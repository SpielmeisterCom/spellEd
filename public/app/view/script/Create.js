Ext.define('Spelled.view.script.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createscript',

    title : 'Create a new Script',
    modal : true,

    closeable: true,

    items: [
        {
            defaults: {
                anchor: '100%',
                allowBlank: false
            },
            xtype: "form",
            bodyPadding: 10,

            api: {
                submit: Spelled.ScriptsActions.create
            },

            items: [
                {
                    xtype: "scriptfolderpicker",
                    name: 'folder',
                    fieldLabel: 'Import into',
                    displayField: 'text',
                    valueField: 'id'
                },
                {
                    xtype: "textfield",
                    name: 'name',
                    fieldLabel: 'Name'
                }
            ],
            buttons: [
                {
                    text: "Create",
                    action: "createScript",
                    formBind:true
                },
                {
                    text: "Cancel",
                    handler: function() {
                        this.up('window').close()
                    }
                }
            ]
        }
    ]
});