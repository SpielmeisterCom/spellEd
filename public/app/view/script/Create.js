Ext.define('Spelled.view.script.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createscript',

    title : 'Create new script',
    modal : true,

	layout: 'fit',

    closeable: true,

    items: [
        {
            defaults: {
                anchor: '100%',
                allowBlank: false
            },
            xtype: "form",
            bodyPadding: 10,

            items: [
                {
                    xtype: "scriptfolderpicker",
                    name: 'folder',
                    fieldLabel: 'Import into',
                    displayField: 'text',
                    valueField: 'id'
                },
                {
                    xtype: "spellednamefield",
                    name: 'name',
                    fieldLabel: 'Name',
					vtype: 'alphanum'
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