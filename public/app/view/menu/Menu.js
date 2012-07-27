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
						icon: "images/icons/book.png",
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
						icon: "images/icons/script-save.png",
						action: "saveProject"
					},
					{
						text: "Export for deployment",
						icon: "images/icons/application_go.png",
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