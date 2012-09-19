Ext.define('Spelled.abstract.model.Model', {
	generateIdentifier: function( object ) {
		var namespace = object.namespace,
			name      = object.name

		return ( !!namespace && namespace.length > 0 ) ? namespace +"."+ name : name
	},

	getAccordingJSFileName: function() {
		return this.get('id').replace( /\.json$/, ".js" )
	}
});
