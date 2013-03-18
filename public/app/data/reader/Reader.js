Ext.define('Spelled.data.reader.Reader', {
    extend: 'Ext.data.reader.Json',

	convertResponse: function( response, converter ) {
		var data

		if( Ext.isArray( response ) ) {
			var tmpResponse = []
			Ext.Array.each(
				response,
				function( item ) {
					tmpResponse.push( converter( item ) )
				},
				this
			)

			data = this.readRecords( tmpResponse)

		} else {
			var tmp = ( !Ext.isObject( response ) && Ext.isString( response ) ) ? Ext.JSON.decode( response ) : response

			response = converter( tmp )

			if (response) {
				data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
			}
		}

		return data || this.nullResultSet
	}
});