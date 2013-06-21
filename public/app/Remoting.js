Ext.define( 'Spelled.Remoting', {
	singleton: true,

	requires: [
		'Ext.direct.*',
		'Spelled.provider.WebKit',
		'Spelled.Configuration'
	],

	actions: {
		"StorageActions":[
			{"name":"create","len":1},
			{"name":"createNamespaceFolder","len":1},
			{"name":"read","len":1},
			{"name":"update","len":1},
			{"name":"destroy","len":1},
			{"name":"getNamespaces","len":1},
			{"name":"deleteFolder","len":1}
		],
		"SpellBuildActions":[
			{"name":"initDirectory","len":2},
			{"name":"buildExport","len":3},
			{"name":"buildClean","len":1},
			{"name":"buildDebug","len":2},
			{"name":"buildRelease","len":2}
		]
	},

	createNodeWebKitProvider: function() {
		return {
			"namespace":"Spelled",
			"type":"webkit",
			"actions": this.actions
		}
	},

	createSpellEdCloudProvider: function() {
		return {
			"url": Spelled.Configuration.extDirectRouterUrl,
			"namespace":"Spelled",
			"type":"remoting",
			"actions": this.actions
		}
	}
})
