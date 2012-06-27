Ext.define('Spelled.view.component.Add' ,{
    extend: 'Ext.Window',
    alias: 'widget.addcomponent',

    title : 'Add a new Component to the Entity',
    modal : true,
	layout: 'fit',

	width: 450,

    items: [
        {
            bodyPadding: 10,

            xtype: 'form',
            items: [
                {
                    xtype: 'combobox',

                    valueField: 'templateId',
                    displayField:'templateId',
                    queryMode: 'local',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'templateId',
                    fieldLabel: 'Select a Component',
                    anchor: '100%',
                    allowBlank:false
                }
            ],
            buttons: [
                {
                    text: "Add",
                    action: "addComponent",
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