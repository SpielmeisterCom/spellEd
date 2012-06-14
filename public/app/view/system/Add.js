Ext.define('Spelled.view.system.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addsystem',

    title: "Add a System to the Zone",
    modal: true,
    closable: true,

    layout: 'fit',
    width : 550,
    height: 450,

    items: [
        {
            xtype: "form",
            bodyPadding: 10,

            defaults: {
                anchor: '100%',
                allowBlank: false
            },

            items: [
                {
					xtype: 'combobox',
					store: 'system.Types',

					valueField: 'type',
					displayField:'name',
					queryMode: 'local',
					forceSelection: true,

					editable: false,
					name: 'type',
					fieldLabel: 'Select the System Type'
                },
                {
					layout: {
						align: 'stretch',
						type: 'vbox'
					},
                    xtype: 'treepanel',
                    title: 'Available Systems',
                    rootVisible: false
                }
            ],
            buttons: [
                {
                    formBind: true,
                    text: 'Add',
                    action: 'addSystems'
                }
            ]
        }
    ]

});