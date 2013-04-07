Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',

	border: false,

	initComponent: function() {
		var me = this

		me.items = [
			{
				xtype: 'toolbar',
				cls: 'spelledToolbar',
				items: [
					{
						text: 'Project',
						menu: {
							items: [{
								text   : 'Create',
								tooltip: 'Creates a new Spell-Project',
								action: 'showCreateProject'
							},{
								text   : 'Load',
								tooltip: 'Load a existing Spell-Project',
								action: 'showLoadProject'
							},{
								text   : 'Settings',
								tooltip: 'Edit the project settings',
								action: 'showProjectSettings'
							}]

						}
					},
					{
						text: "Save",
						action: "saveProject"
					},
					{
						text: "Export for deployment",
						action: "exportProject"
					},
					{
						text: 'Layout',
						menu: {
							items: [{
								text   : 'Main layout',
								action: 'changeToMainLayout'
							},{
								text   : 'Split layout',
								action: 'changeToSplitLayout'
							}]

						}
					},
					{
						xtype: 'tool-documentation',
						docString: ""
					}
				]
			}
		]

		me.callParent( arguments )
	}
});
