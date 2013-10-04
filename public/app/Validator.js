Ext.define( 'Spelled.Validator', {
	singleton: true,

	vTypes: {
		list: function(val, field) {
			var fileName = /["'\[\]]/g

			if( !fileName.test( val ) ){
				var values = val.split(','),
					valid  = true,
					regexp = /^[ \t]+|[ \t]+$/g

				Ext.Array.each(
					values,
					function( item ) {
						if( regexp.test( item ) || !valid ) {
							valid = false
							return false
						}
					}
				)

				return valid
			}

			return false
		},
		listText: "This is not a valid list. List example: 'blue,green,red'. These Characters are not allowed: [ ] \" ' ",
		audioFileUpload: function(val, field) {
			var fileName = /^.*\.(mp3|ogg)$/i

			return fileName.test( val )
		},
		audioFileUploadText: 'Audio must be in .mp3 or .ogg format'
	},

	validateLicenseInformation: function( license ) {
		if( Ext.isObject( license ) && license.isSignatureValid === true ) {
			return true
		} else {
			return false
		}
	},

	validateLicenseSubscription: function( license ) {
		return Ext.isObject( license ) && license.isInValidityPeriod === false
	}
})
