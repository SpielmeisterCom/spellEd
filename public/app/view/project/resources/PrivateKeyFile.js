Ext.define('Spelled.view.project.resources.PrivateKeyFile' ,{
	alias: 'widget.projectresourceprivatekeyfile',
	extend: 'Ext.form.Panel',

	initComponent: function() {
		Ext.applyIf( this, {
			items:[
				{
					xtype:      'displayfield',
					fieldLabel: 'Private Key Type',
					value:      this.type,
					anchor:     '100%'
				},
				{
					xtype:      'displayfield',
					fieldLabel: 'Path',
					value:      this.path,
					anchor:     '100%'
				},
				{
					xtype:      'displayfield',
					fieldLabel: 'Description',
					value:      this.description,
					anchor:     '100%'
				}
			]
		})

		this.callParent( arguments )
	}

})