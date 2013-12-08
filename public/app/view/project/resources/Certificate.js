Ext.define('Spelled.view.project.resources.Certificate' ,{
	alias: 'widget.projectresourcecertificate',
	extend: 'Ext.panel.Panel',

	initComponent: function() {
		Ext.applyIf( this, {
			items:[
				{
					xtype:      'form',
					padding:    5,
					border:     false,
					items: [
						{
							xtype:      'displayfield',
							fieldLabel: 'Cetificate Type',
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
			}]
		})

		this.callParent( arguments )
	}

})