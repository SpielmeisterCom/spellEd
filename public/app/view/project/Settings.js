Ext.define('Spelled.view.project.Settings' ,{
    extend: 'Ext.Window',
    alias: 'widget.projectsettings',

	requires: [
		'Ext.form.FieldContainer'
	],

    title : 'Project settings',
    modal : true,
	autoShow: true,

	layout: 'fit',

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'displayfield',
                    name: 'name',
                    fieldLabel: 'Name',
                    anchor: '100%',
                    allowBlank:false,
					vtype: 'alphanum'
                },
				{
					xtype: 'fieldcontainer',
					fieldLabel: "Screen size",
					layout: 'hbox',
					defaults: {
						flex: 1,
						hideLabel: true
					},
					items: [
						{
							xtype     : 'numberfield',
							name      : 'screenSizeX',
							margin    : '0 5 0 0',
							allowBlank: false
						},{
							xtype :'displayfield',
							value : 'x',
							margin: '5 5 0 0'
						},
						{
							xtype     : 'numberfield',
							name      : 'screenSizeY',
							allowBlank: false
						}
					]
				}
            ]
        }
    ],
	buttons: [
		{
			text: "Set",
			action: "setProjectSettings",
			formBind:true
		},
		{
			text: "Cancel",
			handler: function() {
				this.up('window').close()
			}
		}
	]
});