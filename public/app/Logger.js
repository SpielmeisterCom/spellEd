Ext.define('Spelled.Logger', {
	singleton: true,

	log: function( level, text ) {
		var loggerView = Ext.getCmp( 'SpelledConsole' )

		var wrappedText = "<div>" + text + "</div>"
		switch( level ) {
			case 'DEBUG':
				wrappedText = "<div class='console-message-debug'>Debug: " + text + "</div>"
				break
			case 'INFO':
				wrappedText = "<div class='console-message-info'>" + text + "</div>"
				break
			case 'WARN':
				wrappedText = "<div class='console-message-warn'>Warning: " + text + "</div>"
				break
			case 'ERROR':
				wrappedText = "<div class='console-message-error'>Error: " + text + "</div>"
				break
		}

		loggerView.log( wrappedText )
	}
});