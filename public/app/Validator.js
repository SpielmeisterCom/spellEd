Ext.define( 'Spelled.Validator', {
	singleton: true,

	validateLicenseInformation: function( license ) {
		if( Ext.isObject( license ) && license.isValid === true && this.validateLicenseSubscription( license.payload ) ) {
			return true
		} else {
			return false
		}
	},

	validateLicenseSubscription: function( payload ) {
		var today      = new Date( Date.now() ),
			startDate  = new Date( payload.isd ),
			expireDate = Spelled.Converter.getLicenseExpireDate( payload.isd, payload.days )

		return Ext.Date.between( today, startDate, expireDate )
	}

})
