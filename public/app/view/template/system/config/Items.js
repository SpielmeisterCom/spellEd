Ext.define('Spelled.view.template.system.config.Items' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemconfig',

	requires: [ 'Spelled.Converter' ],

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
		var system = this.up('systemtemplateconfiguration').down('systemtemplatedetails').getForm().getRecord()
		this.originalConfig[ recordId ] = Spelled.Converter.decodeFieldValue( value )

		this.fireEvent( 'configchange', system, source, recordId, value, oldValue )
	},

	setSystemSceneConfig: function( config ) {
		this.originalConfig = config

		var tmp = Ext.clone( config )
		Ext.iterate( tmp, function( key, value ) { tmp[ key ] = Spelled.Converter.convertValueForGrid( value ) } )

		this.down( 'propertygrid' ).setSource( tmp )
	}
})
