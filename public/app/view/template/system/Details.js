Ext.define('Spelled.view.template.system.Details', {
    extend: 'Ext.form.Panel',
    alias : 'widget.systemtemplatedetails',

    bodyPadding: 10,
    collapsible: true,
    hideCollapseTool: false,
    title: 'Details',
    titleCollapse: false,
    margins: '0 0 5 0',
	frame: true,

	initComponent: function() {
		Ext.applyIf( this, {
			items: [
				{
					xtype: 'displayfield',
					fieldLabel: 'Type',
					name: 'type',
					anchor: '100%'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Name',
					name: 'tmpName',
					anchor: '100%'
				},
				{
					xtype: 'checkbox',
					fieldLabel: 'Active',
					name: 'active',
					anchor: '100%',
					handler: Ext.bind( this.onConfigChange, this )
				}
			]
		})

		this.callParent(arguments)
	},

	onConfigChange: function( field, newValue ) {
		this.fireEvent( 'configchange', this.getForm().getRecord(), field.getName(), newValue )
	}
});
