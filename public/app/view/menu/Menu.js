Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',

	initComponent: function() {
		var me = this

		me.items = [
			{
				xtype: 'toolbar',
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
								action: 'showloadProject'
							}]

						}
					},
					{
						text: "Save",
						action: "saveProject"
					},
					{
						text: "Export",
						action: "exportProject"
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