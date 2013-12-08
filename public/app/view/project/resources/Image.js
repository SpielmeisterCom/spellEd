Ext.define('Spelled.view.project.resources.Image', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.projectresourceimage',

	initComponent: function() {
		var projectName = Spelled.Configuration.getStateProvider().get( 'projectName' )

		Ext.applyIf( this, {
			items:[
				{
					xtype:      'form',
					padding:    5,
					border:     false,
					items: [
						{
							xtype:      'displayfield',
							fieldLabel: 'Dimensions',
							value:      this.height + ' x ' + this.height,
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
						},
						{
							xtype:      'displayfield',
							fieldLabel: 'Preview',
							value:      '',
							anchor:     '100%'
						}
					]
				},
				{
					xtype: 'image',
					padding:    5,
					style: {
						maxWidth: '100%',
						maxHeight: '100%'
					},
					src: Spelled.Converter.toWorkspaceUrl( projectName + '/' + this.path ) + "?t=" + Ext.Date.now()
				}
			]
		})

		this.callParent( arguments )
	}

})