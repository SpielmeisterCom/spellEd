Ext.define('Spelled.view.template.component.attribute.Vec2', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledvec2field',

	mixins: [ 'Spelled.abstract.grid.Property' ],

//	valueToRaw: function( value ) {
//		return ( !!value ) ?  value.toString(): "0,0"
//	},
//
//	rawToValue: function( value ){
//		var newRawValue = value
//
//		if( !!newRawValue && Ext.isString( newRawValue ) ) {
//			newRawValue = Ext.Array.map(
//				newRawValue.split(","),
//				function( key ) {
//					return parseInt( key, 10 )
//				}
//			)
//		}
//
//		return newRawValue
//	},

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
