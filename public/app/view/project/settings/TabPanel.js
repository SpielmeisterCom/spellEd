Ext.define('Spelled.view.project.settings.TabPanel' ,{
	extend: 'Ext.tab.Panel',

	defaults: {
		padding:5
	},

	getValues: function() {
		var values = {}

		Ext.Array.each(
			this.items.items,
			function( item ) {
				var itemValues  = item.getValues(),
					configId    = item.configId

				for( var key in  itemValues ) {
					if( configId ) {
						if( !values[ configId ] ) {
							values[ configId ] = {}
						}

						values[ configId ][ key ] = itemValues[ key ]
						
					} else {
						values[ key ] = itemValues[ key ]
					}

				}
			}
		)

		return values
	},

	setValues: function( values ) {
		Ext.Array.each(
			this.items.items,
			function( item ) {
				var configId    = item.configId

				if( configId ) {
					item.setValues( values[ configId ] )
				} else {
					item.setValues( values )
				}
			}
		)
	}
})