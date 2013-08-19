Ext.define('Spelled.view.project.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createproject',

    title : 'Create new Project',
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
                    allowBlank:false,
					vtype: 'alphanum',
					validator: function( value ) {
						var project = Ext.getStore( 'Projects' ).findRecord( 'name', value, 0, false, false, true )
						return ( project ) ? "Project with this name already exists!" : true
					}
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
