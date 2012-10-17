Ext.define('Spelled.view.scene.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createscene',

	layout: 'fit',	

    title : 'Add a new Scene to the Project',
    modal : true,

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Name',
					vtype: 'alphanum',
                    anchor: '100%',
                    allowBlank:false
                },
				{
					xtype: "libraryfolderpicker",
					name: 'namespace',
					fieldLabel: 'Namespace',
					displayField: 'text',
					valueField: 'id'
				}
            ],
            buttons: [
                {
                    text: "Create",
                    action: "createScene",
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
