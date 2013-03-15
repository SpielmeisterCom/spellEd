Ext.define('Spelled.abstract.grid.property.Grid', {
    extend: 'Ext.grid.property.Grid',
	alias : 'widget.defaultpropertygrid',

	sourceConfig: {},

	addCustomEditor: function( key, attribute ) {
		var value  = attribute.value,
			type   = attribute.type,
			values = ( attribute.values && Ext.isString( attribute.values ) ) ? attribute.values.split(',') : attribute.values,
			cellEditorConfig = { field: { xtype: type, value: value, initialValue: attribute.initialValue } }

		if( Ext.isArray( values ) && values.length > 0 ) cellEditorConfig.field.store = values

		if( !this.sourceConfig[ key ] ) this.sourceConfig[ key ] = {}
		this.sourceConfig[ key ][ 'editor' ] = new Ext.grid.CellEditor( cellEditorConfig )
	},

	initComponent: function() {
		Ext.Object.each( this.source,
			this.addCustomEditor,
			this
		)

		this.source = Spelled.Converter.formatPropertyGridSource( this.source )

		this.callParent(arguments)
	}
});