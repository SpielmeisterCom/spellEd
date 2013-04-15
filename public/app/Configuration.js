Ext.define( 'Spelled.Configuration', {
	singleton              : true,

	isNodeWebKit: function() {
		return ( typeof process == 'object' )
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

	version                : '0.8.1',
	storageVersion         : 1,
	extDirectRouterUrl     : '/router/',
	name                   : "SpellEd",
	documentationServerURL : "http://docs.spelljs.com/0.8.1/",
	spellCliPath           : '',
	spellCorePath          : ''
})
