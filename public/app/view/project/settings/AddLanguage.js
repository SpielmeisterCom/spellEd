Ext.define('Spelled.view.project.settings.AddLanguage' ,{
    extend: 'Ext.Window',
    alias: 'widget.projectsettingsaddlanguage',

    title : 'Add a new supported language to this project',
    modal : true,
	autoShow: true,

	layout: 'fit',

	items: [
		{
			bodyPadding: 10,
			xtype: 'form',
			items: [
				{
					xtype: 'combo',
					name: 'language',
					fieldLabel: 'Add additional language',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					forceSelection: true,
					typeAhead: true,
					store: 'Languages'
				}
			],
			buttons: [
				{
					text: "Add language",
					action: "addLanguage",
					formBind: true
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
})