Ext.define( 'Spelled.Validator', {
	singleton: true,

	validateLicenseInformation: function( license ) {
		if( Ext.isObject( license ) && license.isValid === true ) {
			return true
		} else {
			return false
		}
	},

	validateLicenseSubscription: function( license ) {
		return Ext.isObject( license ) && license.isInValidityPeriod === false
	}
})
