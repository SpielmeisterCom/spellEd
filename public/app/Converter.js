Ext.define('Spelled.Converter' ,{
	singleton: true,

	convertValueForGrid: function( value ) {
		if( Ext.isArray( value ) === true ) {
			return "[" + value.toString() + "]"
		} else if( Ext.isObject( value ) ) {
			return Ext.encode( value )
		} else {
			return value
		}
	},

	decodeFieldValue: function( value ) {
		return Ext.decode( value, true ) || value
	}
})
