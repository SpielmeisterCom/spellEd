Ext.define('Spelled.view.template.system.config.Items' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemconfig',

    title: 'Scene system configuration',
	margins: '0 0 5 0',
	frame: true,
	flex: 2,

	initComponent: function() {
		Ext.applyIf( this, {
			items: [
				{
					xtype: 'propertygrid',
					source: {},
					listeners: {
						propertychange: Ext.bind( this.onPropertyChange, this )
					}
				}
			],
			tools: [{
				xtype: 'tool-documentation',
				docString: "#!/guide/concepts_systems"
			}]
		})

		this.callParent( arguments )
	},

	onPropertyChange: function( source, recordId, value, oldValue ) {
		this.fireEvent( 'configchange', this.up('systemtemplateconfiguration').down('systemtemplatedetails').getForm().getRecord(), source, recordId, value, oldValue )
	},

	setSystemSceneConfig: function( config ) {
		this.down( 'propertygrid' ).setSource( config )
	}
})
