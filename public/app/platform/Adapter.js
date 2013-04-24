Ext.define( 'Spelled.platform.Adapter', {
	singleton: true,

	requires: [
		'Spelled.Remoting',
		'Spelled.platform.target.Cloud',
		'Spelled.platform.target.NodeWebKit'
	],

	isNodeWebKit: function() {
		return ( typeof process == 'object' )
	},

	isMacOs: function() {
		return ( typeof process == 'object' && process.platform == 'darwin' )
	},

	factory: function() {
		return this.isNodeWebKit() ? Ext.create( 'Spelled.platform.target.NodeWebKit' ) : Ext.create( 'Spelled.platform.target.Cloud' )
	}
})
