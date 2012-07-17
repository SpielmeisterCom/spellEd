Ext.define('Spelled.view.template.system.Input' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.systemtemplateinputlist',

    title: 'Registered inputs for this system',
    flex: 1,

	initComponent: function() {
		var me = this;

		me.tools = [{
			type:'help',
			tooltip: 'Get Help',
			handler:  Ext.bind( me.handleDocClick, me)
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
				dataIndex: 'templateId',
				flex:1,
				editor: {
					xtype: 'systemtemplateinputgridcombobox',
					allowBlank: false
				}
			},
			{
				xtype: 'actioncolumn',
				width: 30,
				icon: 'images/icons/wrench-arrow.png',
				handler: Ext.bind(me.handleEditClick, me)
			}
		];

		me.addEvents(
			'editclick'
		)

		me.callParent( arguments )
	},

	enableColumnHide: false,

	handleEditClick: function(gridView, rowIndex, colIndex, column, e, record) {
		gridView.getSelectionModel().select( rowIndex )
		this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
	},

	selType: 'rowmodel',

	plugins: [{
		ptype: 'cellediting',
		clicksToEdit: 1
	}],

	handleDocClick: function( event, toolEl, panel ) {
		this.fireEvent( 'showDocumentation', event, toolEl, panel );
	},

    bbar: [
        {
            text: "Register component dictionary",
            action: "showAddInput"
        }
    ]
});
