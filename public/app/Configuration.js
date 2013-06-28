Ext.define( 'Spelled.Configuration', {
	singleton              : true,

	isDemoInstance: function() {
		var host = location.hostname

		return host === this.demoServerHostname
	},

	getDemoTooltipText: function( text ) {
		return Spelled.Configuration.isDemoInstance() ? 'Not supported in demo version' : text || ''
	},

	getStateProvider: function() {
		return Ext.state.Manager.getProvider()
	},

	createStateProvider: function() {
		Ext.state.Manager.setProvider( Ext.create( 'Ext.state.CookieProvider') )
	},

	setWorkspacePath: function( path ) {
		this.getStateProvider().set( 'workspacePath', path )
	},

	getWorkspacePath: function() {
		return this.getStateProvider().get( 'workspacePath' )
	},

	getSpellCliPath: function() {
		var spellCliPath = 'spellcli'
		return spellCliPath
	},

	getSpellCorePath: function() {
		var spellCorePath = 'spellCore'
		return spellCorePath

	},

	getDocumentationServerUrl: function() {
		return this.documentationServerURL + this.version + '/'
	},

	demoServerHostname     : 'spelled-demo.spelljs.com',
	version                : '0.8.25',
	buildNumber	       : '99999',
	buildTimeStamp	       : '2099-01-01T01:00:00.000+01:00',
	storageVersion         : 1,
	extDirectRouterUrl     : '/router/',
	name                   : "SpellEd",
	documentationServerURL : "http://docs.spelljs.com/"
})
