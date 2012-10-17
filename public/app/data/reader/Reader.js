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
			response = converter( response )

			if (response) {
				data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
			}
		}

		return data || this.nullResultSet
	}
});