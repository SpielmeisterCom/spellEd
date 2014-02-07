Ext.define('Spelled.view.project.resources.ProvisionFile', {
	alias: 'widget.projectresourceprovisionfile',
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
				}
			]
		})

		this.callParent( arguments )
	}

})