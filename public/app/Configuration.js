Ext.define( 'Spelled.Configuration', {

	isNodeWebKit: function() {
		return ( typeof process == 'object' )
	},

	singleton              : true,

	version                : '0.8.1',
	storageVersion         : 1,
	extDirectRouterUrl     : '/router/',
	name                   : "SpellEd",
	documentationServerURL : "http://docs.spelljs.com/0.8.1/",
	spellCliPath           : '',
	spellCorePath          : '',
	projectsPath           : ''
})
