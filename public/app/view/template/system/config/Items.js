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
					xtype: 'defaultpropertygrid',
					source: this.formatSystemSceneConfig( this.source ),
					listeners: {
						propertychange: Ext.bind( this.onPropertyChange, this ),
						editproperty: Ext.bind( this.propertyChangeHelper, this )
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

	propertyChangeHelper: function( field, value, oldValue ) {
		var source = this.down('defaultpropertygrid').getSource()

		this.onPropertyChange( source, field.ownerCt.editorId, value, oldValue )
	},

	onPropertyChange: function( source, recordId, value, oldValue ) {
		var system = this.up('systemtemplateconfiguration').down('systemtemplatedetails').getForm().getRecord()
		this.originalConfig[ recordId ] = Spelled.Converter.decodeFieldValue( value )

		this.fireEvent( 'configchange', system, source, recordId, value, oldValue )
	},

	formatSystemSceneConfig: function( config ) {
		var knownTypes = Ext.getStore( 'template.component.AttributeTypes' )
		this.originalConfig = config

		var tmp = Ext.clone( config )
		Ext.iterate( tmp, function( key, value ) {
			var type  = Ext.typeOf( value ),
				xtype = knownTypes.findRecord( 'name', type, null, null, null, true )

			tmp[ key ] = {
				type: ( xtype ) ? xtype.get( 'type' ) : 'spelledtextfield',
				value: Spelled.Converter.convertValueForGrid( value ),
				initialValue: value
			}
		})

		return tmp
	}
})
