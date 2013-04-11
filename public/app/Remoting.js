Ext.define( 'Spelled.Remoting', {
	singleton: true,

	requires: [
		'Ext.direct.*',
		'Spelled.provider.WebKit',
		'Spelled.Configuration'
	],

	createNodeWebKitProvider: function() {
		return {
			"namespace":"Spelled",
			"type":"webkit",
			"actions":{
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
					{"name":"exportDeployment","len":2}
				]
			}
		}
	},

	createSpellEdCloudProvider: function() {
		return {
			"url": Spelled.Configuration.extDirectRouterUrl,
			"namespace":"Spelled",
			"type":"remoting",
			"actions":{
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
					{"name":"exportDeployment","len":2}
				]
			}
		}
	},

	constructor: function() {
		var provider = Spelled.Configuration.isNodeWebKit() ? this.createNodeWebKitProvider() : this.createSpellEdCloudProvider()

		Ext.Direct.addProvider( provider )
	}
})
