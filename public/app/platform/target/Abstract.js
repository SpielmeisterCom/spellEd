Ext.define( 'Spelled.platform.target.Abstract', {

	addClosingEditorHandler: function() {},

	showItemInFolder: function( projectName, libraryId ) {},

	copyToClipboard: function( text ) {},

	createRemoteProvider: function() {},

	getToolbarXType: function() {
		return 'toolbar'
	},

	getLicenseInformation: function( callback ) {},

	writeLicense: function() {},

	readLicense: function() {},

	toggleDevTools: function() {},

	enterFullScreen: function( dom ) {},

	normalizeUrl: function( url ) {
		return url
	}
})
