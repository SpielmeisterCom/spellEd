Ext.define('Spelled.view.entity.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createentity',

    title : 'Add a new Entity to the Zone',
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
                    anchor: '100%',
                    allowBlank:false
                },
				{
					xtype: 'combobox',
					store: 'config.Zones',

					valueField: 'name',
					displayField:'name',
					queryMode: 'local',
					forceSelection: true,
					editable: false,

					name: 'zoneId',
					fieldLabel: 'Select a Zone',
					anchor: '100%',
					allowBlank:false
				},
                {
                    xtype: 'combobox',
                    store: 'blueprint.Entities',

                    valueField: 'id',
                    displayField:'name',
                    queryMode: 'local',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'blueprintId',
                    fieldLabel: 'Select a Blueprint',
                    anchor: '100%',
                    allowBlank:false
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