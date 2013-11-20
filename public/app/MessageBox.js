Ext.define('Spelled.MessageBox', {
	singleton: true,

	showBuildServerConnectError: function( response ) {
		this.alert( 'Service unavailable', response.message + "<br/><br/>" + response.xhr.responseText )
	},

	showMissingProjectsError: function() {
		this.alert( 'No active project found', "You need to load a project first." )
	},

	info: function( title, msg ) {
		var msg = Ext.Msg.alert( title, msg )
		msg.setIcon( Ext.Msg.INFO )
	},

	alert: function( title, msg ) {
		var msg = Ext.Msg.alert( title, msg )
		msg.setIcon( Ext.Msg.WARNING )
	},

	error: function( title, msg, critical ) {
		Ext.Msg.show({
			closable: !critical,
			title: title,
			msg: msg,
			icon: Ext.Msg.ERROR
		})
	}
});