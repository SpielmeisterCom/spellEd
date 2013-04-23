Ext.define( 'Spelled.Configuration', {
	singleton              : true,

	isNodeWebKit: function() {
		return ( typeof process == 'object' )
	},

	isMacOs: function() {
		return ( typeof process == 'object' && process.platform == 'darwin' )
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

	version                : '0.8.1',
	storageVersion         : 1,
	extDirectRouterUrl     : '/router/',
	name                   : "SpellEd",
	documentationServerURL : "http://docs.spelljs.com/0.8.1/"
})
