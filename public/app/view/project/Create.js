Ext.define('Spelled.view.project.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createproject',

    title : 'Create a new Project',
    modal : true,

	layout: 'fit',

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Name',
                    anchor: '100%',
                    allowBlank:false
                }
            ],
            buttons: [
                {
                    text: "Create",
                    action: "createProject",
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