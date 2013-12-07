Ext.define('Spelled.view.project.resources.Image', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.projectresourceimage',

	initComponent: function() {
		var projectName = Spelled.Configuration.getStateProvider().get( 'projectName' )

		Ext.applyIf( this, {
			items:[
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
					xtype: 'image',
					src: Spelled.Converter.toWorkspaceUrl( projectName + '/' + this.path )
				}
			]
		})

		this.callParent( arguments )
	}

})