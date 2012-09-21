Ext.define('Spelled.data.reader.Project', {
    extend: 'Ext.data.reader.Json',
	alias: 'reader.project',

	read: function( response ) {
		var data

		if( Ext.isArray( response ) ) {
			var tmpResponse = []
			Ext.Array.each(
				response,
				function( item ) {
					tmpResponse.push( Ext.amdModules.projectConverter.toEditorFormat( item, { omitScenes: true } ) )
				},
				this
			)

			data = this.readRecords( tmpResponse)

		} else {
			response = Ext.amdModules.projectConverter.toEditorFormat( response )

			if (response) {
				data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
			}
		}

		return data || this.nullResultSet;
	}
});