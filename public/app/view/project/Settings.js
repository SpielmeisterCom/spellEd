Ext.define('Spelled.view.project.Settings' ,{
    extend: 'Ext.Window',
    alias: 'widget.projectsettings',

	requires: [
		'Ext.form.FieldContainer',
		'Spelled.view.project.settings.Resources',
		'Spelled.view.project.settings.Windows',
		'Spelled.view.project.settings.WindowsPhone'
	],

    width: 1000,
    height: 700,
	layout: 'fit',

    title : 'Project settings',
    modal : true,
	autoShow: true,

	initComponent: function() {

		Ext.applyIf( this, {
			items: [
				{
					defaults: {
						padding:5
					},
					xtype: 'tabpanel',
                    items: [
						{
							xtype: 'projectgeneralsettings'
						},
						{
							xtype: 'projectlanguagesettings'
						},
                        {
                            xtype: 'projectandroidsettings'
                        },
                        {
                            xtype: 'projectiossettings'
                        },
	                    {
		                    xtype: 'projecttizensettings'
	                    },
						{
							xtype: 'projectwebsettings'
						},
						{
							xtype: 'projectwindowssettings'
						},
						{
							xtype: 'projectwindowsphonesettings'
						},
						{
							xtype: 'projectplugins'
						}
					]
				}
			]
		})

		this.callParent( arguments )
	},

	buttons: [
		{
			text: "Save",
			action: "setProjectSettings",
			formBind: true
		},
		{
			text: "Cancel",
			handler: function() {
				this.up('window').close()
			}
		}
	]
})