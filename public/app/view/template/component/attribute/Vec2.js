Ext.define('Spelled.view.template.component.attribute.Vec2', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledvec2field',

	mixins: [ 'Spelled.abstract.grid.Property' ],

	valueToRaw: function( value ) {
		return ( this.convertIt ) ? Spelled.Converter.convertValueForGrid( value ) : value
	},

	rawToValue: function( value ){
		return ( this.convertIt ) ? Spelled.Converter.decodeFieldValue( value ) : value
	},

	validator: function( value ) {
		var regexp = /^\[ ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?\]$/

		if( !regexp.test( value ) )	return "This is not a valid vec2. Vec2 Example: '[1,2]'"
		else return true
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
