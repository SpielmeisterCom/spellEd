Ext.define('Spelled.view.template.entity.Add' ,{
    extend: 'Ext.Window',
    alias: 'widget.addentitytotemplate',

    title : 'Add a new Template-Entity to the Template',
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
                    action: "addEntityToTemplate",
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
