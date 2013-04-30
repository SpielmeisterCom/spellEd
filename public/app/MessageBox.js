Ext.define('Spelled.MessageBox', {
	singleton: true,

	showBuildServerConnectError: function() {
		this.alert( 'Service unavailable', "SpellEd can't connect to the Build-Server." )
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