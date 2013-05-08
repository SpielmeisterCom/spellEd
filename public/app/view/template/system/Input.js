Ext.define('Spelled.view.template.system.Input' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.systemtemplateinputlist',

    title: 'Registered inputs for this system',
	frame: true,
    flex: 1,

	initComponent: function() {
		var me = this;

		me.tools = [{
			xtype: 'tool-documentation',
			docString: "#!/guide/concepts_systems"
		}]

		me.columns = [
			{
				header: 'Local alias',
				width: 120,
				dataIndex: 'name',
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			{
				header: 'Mapped component dictionary',
				dataIndex: 'componentId',
				flex:1,
				editor: {
					xtype: 'systemtemplateinputgridcombobox',
					allowBlank: false
				}
			},
			{
				xtype: 'spelledactioncolumn',
				width: 30
			}
		];

		me.callParent( arguments )
	},

	enableColumnHide: false,

	selType: 'rowmodel',

	plugins: [{
		ptype: 'cellediting',
		clicksToEdit: 1
	}],

    bbar: [
        {
            text: "Register component dictionary",
            action: "showAddInput"
        }
    ]
});
