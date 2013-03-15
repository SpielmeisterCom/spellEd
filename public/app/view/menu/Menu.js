Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',

	border: false,

	initComponent: function() {
		var me = this

		me.items = [
			{
				xtype: 'toolbar',
				items: [
					{
						text: 'Project',
						icon: "resources/images/icons/book.png",
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
						icon: "resources/images/icons/script-save.png",
						action: "saveProject"
					},
					{
						text: "Export for deployment",
						icon: "resources/images/icons/application_go.png",
						action: "exportProject"
					},
					{
						text: 'Layout',
						icon: "resources/images/icons/monitor.png",
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
