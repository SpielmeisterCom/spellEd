Ext.define( 'Spelled.provider.WebKit', {
	extend: 'Ext.direct.RemotingProvider',
	alias:  'direct.webkitprovider',
	id: 'webkitProvider',

	listeners: {
		beforecallback: function() {
			console.log( "beforecallback" )
			console.log( arguments )
		},
		call: function() {
			console.log( "call" )
			console.log( arguments )
		},
		beforecall: function() {
			console.log( "beforecall" )
			console.log( arguments )
		}
	},

	//enableBuffer: false,

	sendRequest: function(data) {
		var me = this, request, callData, i, len

		request = {
			callback: me.onData,
			scope: me,
			transaction: data
		}

		if (Ext.isArray(data)) {
			callData = []

			for (i = 0, len = data.length; i < len; ++i) {
				callData.push(me.getCallData(data[i]))
			}
		}
		else {
			callData = me.getCallData(data)
		}

		request.jsonData = callData

		me.doWebKitRequest( request )
	},

	onData: function(options, success, response) {
		var me = this,
			i, len, events, event, transaction, transactions;

console.log( "response" )
console.log( response )
		events = me.createEvents(response);
console.log( "events" )
console.log( events )
		for (i = 0, len = events.length; i < len; ++i) {
			event = events[i];
			transaction = me.getTransaction(event);
			me.fireEvent('data', me, event);

			if (transaction && me.fireEvent('beforecallback', me, event, transaction) !== false) {
				me.runCallback(transaction, event, true);
				Ext.direct.Manager.removeTransaction(transaction);
			}
		}

	},

	doWebKitRequest: function( request ) {
console.log( request )
		var requestData = request.jsonData,
			action      = requestData.action,
			method      = requestData.method,
			transaction = request.transaction,
			args        = transaction.args[0],
			api         = this.webKitExtDirectApi

		if( !api ) throw "Api not initialized"

		if( !api[ action ] ) throw "Action: '" +action + "' not supported in WebKit Provider."
		var actionApi = api[ action ]

		var neededFunc = Ext.Array.findBy( actionApi, function( item ) { return item.name == method } )

		if( !neededFunc ) throw "Method: '" + method +"' not found in: '" +action + "' not supported in WebKit Provider."


		var result = neededFunc.func( null, null, args )
console.log( result )

		var response = {
			responseText: Ext.encode( [ Ext.Object.merge( {}, request.jsonData, { result: result } ) ] )
		}

		this.onData( transaction.callbackOptions, true, response )
	},

	createWebKitExtDirectApi: function( callback ) {
		var me = this

		requirejs(
			[
				'server/createExtDirectApi'
			],
			function(
				createExtDirectApi
				) {
				'use strict'
				me.webKitExtDirectApi = createExtDirectApi( Spelled.Configuration.projectsPath, Spelled.Configuration.spellCorePath, Spelled.Configuration.spellCliPath )

				Ext.callback( callback )
			}
		)
	},

	connect: function() {
		var me = this

		me.initAPI()
		me.connected = true
		me.fireEvent('connect', me)
	}
})
