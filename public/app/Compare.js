Ext.define( 'Spelled.Compare', {
	singleton: true,

	isEqual: function( value1, value2 ) {
		return Ext.amdModules.underscore.isEqual( value1, value2 )
	}
})
