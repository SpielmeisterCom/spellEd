Ext.define( 'Spelled.Validator', {
	singleton: true,

	vTypes: {
		audioFileUpload: function(val, field) {
			var fileName = /^.*\.(mp3|ogg)$/i

			return fileName.test( val )
		},
		audioFileUploadText: 'Audio must be in .mp3 or .ogg format'
	},

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
