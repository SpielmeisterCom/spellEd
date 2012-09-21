Ext.define('Spelled.data.reader.EntityTemplate', {
    extend: 'Ext.data.reader.Json',
	alias: 'reader.entityTemplate',

	read: function( response ) {
		var data

		if( Ext.isArray( response ) ) {
			var tmpResponse = []
			Ext.Array.each(
				response,
				function( item ) {
					tmpResponse.push( Ext.amdModules.entityTemplateConverter.toEditorFormat( item ) )
				},
				this
			)

			data = this.readRecords( tmpResponse)

		} else {
			response = Ext.amdModules.entityTemplateConverter.toEditorFormat( response )

			if (response) {
				data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
			}
		}

		return data || this.nullResultSet;
	}
});