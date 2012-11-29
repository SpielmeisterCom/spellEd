Ext.define('Spelled.view.system.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addsystem',

    title: "Add a System to the Scene",
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

			layout: {
				align: 'stretch',
				type: 'vbox'
			},

            items: [
				{
					xtype: 'combobox',
					name: 'scene',
					displayField: 'sceneId',
					matchFieldWidth : false,
					fieldLabel: 'Select scene',
					emptyText: " -- Select a scene --",
					store: 'config.Scenes',
					anchor: '100%',
					allowBlank: false
				},
                {
					xtype: 'combobox',
					store: 'system.Types',

					valueField: 'type',
					displayField:'name',
					queryMode: 'local',
					forceSelection: true,

					editable: false,
					name: 'type',
					fieldLabel: 'Select the execution group'
                },
                {
					flex: 1,
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
    ],

	setExecutionGroup: function( value ) {
		this.down( 'combobox[name="type"]' ).setValue( value )
	},

	setScene: function( scene ) {
		this.down( 'combobox[name="scene"]' ).setValue( scene.get( 'sceneId' ) )
	}

});
