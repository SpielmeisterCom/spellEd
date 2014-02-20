Ext.define( 'Spelled.Configuration', {
	singleton              : true,

	isDemoInstance: function() {
		var host = location.hostname

		return host === this.demoServerHostname || host === this.demoStagingServer
	},

	isDevEnvironment: function() {
		var host   = location.hostname

		return host === 'localhost' || this.isInNodeWebkitDevEnvironment()
	},

	isInNodeWebkitDevEnvironment: function() {
		var params = Ext.Object.fromQueryString( location.search )

		return ( Ext.isObject( params ) && params.isDevelEnv )
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
		Spelled.app.platform.getConfig().workspacePath = path
		Spelled.app.platform.writeConfigFile()
	},

	getWorkspacePath: function() {
		return Spelled.app.platform.getConfig().workspacePath
	},

	getSpellCliPath: function() {
		var spellCliPath = Spelled.app.platform.getConfig().spellCliPath + '/spellcli'

		return !this.isInNodeWebkitDevEnvironment() ? spellCliPath : '../../../' + spellCliPath
	},

	getSpellCorePath: function() {
		var spellCorePath =  Spelled.app.platform.getConfig().spellCorePath

		return !this.isInNodeWebkitDevEnvironment() ? spellCorePath : '../../../' + spellCorePath
	},

	getDocumentationServerUrl: function() {
		return this.documentationServerURL + this.version + '/'
	},

	appName                : 'SpellJS',
	configFileName         : 'spellConfig.json',
	defaultConfigFileName  : 'defaultSpellConfig.json',
	licenseFileName        : 'license.txt',
	demoProjectsFolder     : 'demo_projects',
	defaultWorkspaceName   : 'spellWorkspace',
	updateServerUrl        : 'http://backoffice.spielmeister.com/spelljs-desktop-latest-version.json',
	demoServerHostname     : 'spelled-demo.spelljs.com',
	demoStagingServer      : 'spelled-demo.spelljs.staging',
	version                : '0.9.12',
	buildNumber	           : '99999',
	buildTimeStamp	       : '2099-01-01T01:00:00.000+01:00',
	storageVersion         : 1,
	extDirectRouterUrl     : '/router/',
	name                   : "SpellEd",
	documentationServerURL : "http://docs.spelljs.com/"
})
