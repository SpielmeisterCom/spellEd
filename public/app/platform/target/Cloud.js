Ext.define( 'Spelled.platform.target.Cloud', {
	requires: [
		'Spelled.Remoting'
	],

	copyToClipboard: function( text ) {

	},

	createRemoteProvider: function() {
		return Spelled.Remoting.createSpellEdCloudProvider()
	},

	getToolbarXType: function() {
		return 'toolbar'
	},

	enterFullScreen: function( dom ) {
		var success  = false,
			prefixes = ["moz", "webkit", "ms", "o", ""]

		Ext.each( prefixes, function( prefix ) {
			var fnName = ( prefix.length > 0 ) ? "RequestFullScreen" : "requestFullScreen"

			if (dom[prefix + fnName] !== undefined) {
				dom.contentWindow.focus()

				//we need to call this function directly here, because Firefox does
				//not accept calling this function from another context
				dom[prefix + fnName]()

				success = true
			}
		})

		return success
	},

	normalizeUrl: function( url ) {
		return url
	}
})
