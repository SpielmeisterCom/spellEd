Ext.define( 'Spelled.platform.target.Cloud', {
	extend: 'Spelled.platform.target.Abstract',
	requires: [
		'Spelled.Remoting'
	],

	addClosingEditorHandler: function() {
		var controller = Spelled.getApplication().getController( 'Projects' ),
			callback   = controller.projectCloseWarning

		Ext.EventManager.on( window, 'beforeunload', callback, controller )
		Ext.EventManager.on( window, 'unload', callback, controller )
	},

	copyToClipboard: function( text ) {
		window.prompt ("Copy identifier to clipboard: Ctrl+C, Enter", text )
	},

	createRemoteProvider: function() {
		return Spelled.Remoting.createSpellEdCloudProvider()
	},

	toggleDevTools: function() {
		Spelled.MessageBox.info( 'Not supported', 'Please open the development toolbar manually (for example hit F12 on Windows)' )
	},

	enterFullScreen: function( dom ) {
		var success  = false,
			prefixes = ["moz", "webkit", "ms", "o", ""]

		Ext.each( prefixes, function( prefix ) {
			var fnName = ( prefix.length > 0 ) ? "RequestFullScreen" : "requestFullScreen"

			if (dom[prefix + fnName] !== undefined) {
				dom.focus()

				//we need to call this function directly here, because Firefox does
				//not accept calling this function from another context
				dom[prefix + fnName]()

				success = true
			}
		})

		return success
	}
})
