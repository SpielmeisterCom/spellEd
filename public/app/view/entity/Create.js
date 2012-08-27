Ext.define('Spelled.view.entity.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createentity',

    title : 'Add a new Entity to the Scene',
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
					vtype: 'alphanum',
                    fieldLabel: 'Name',
                    anchor: '100%',
                    allowBlank:false
                },
				{
					xtype: 'hiddenfield',
					name: 'owner'
				},
				{
                    xtype: 'combobox',
                    store: 'template.Entities',

                    valueField: 'id',
                    displayField:'name',
                    queryMode: 'local',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'templateId',
                    fieldLabel: 'Select a Template',
					emptyText: " -- Is Optional --",
                    anchor: '100%',
					allowBlank: true
                }
            ],
            buttons: [
                {
                    text: "Create",
                    action: "createEntity",
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
