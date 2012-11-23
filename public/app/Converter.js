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
	},

	formatPropertyGridSource: function( source ) {
		var newSource = {}
		Ext.Object.each( source,
			function( key, attribute ) {
				newSource[ key ] = attribute.value
			},
			this
		)

		return newSource
	},

	isEqual: function( value1, value2 ) {
		if( Ext.isArray( value1 ) ) {
			return Ext.Array.difference( value1, value2).length === 0
		}

		return value1 == value2
	}
})
