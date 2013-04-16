Ext.define( 'Spelled.provider.WebKit', {
	extend: 'Ext.direct.RemotingProvider',
	alias:  'direct.webkitprovider',
	id: 'webkitProvider',

	queueTransaction: function( transaction ) {
		var me = this

		if ( transaction.form ) {
			me.sendFormRequest( transaction )
			return
		}

		me.sendRequest( transaction )
	},

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

		Ext.defer( me.doWebKitRequest, 10, me, [ request ] )
	},

	onData: function(options, success, response) {
		var me = this,
			i, len, events, event, transaction, transactions;

		events = me.createEvents(response);

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
		var requestData = request.jsonData,
			action      = requestData.action,
			method      = requestData.method,
			transaction = request.transaction,
			args        = requestData.data,
			api         = this.webKitExtDirectApi

		if( !api ) throw "Api not initialized"

		if( !api[ action ] ) throw "Action: '" +action + "' not supported in WebKit Provider."
		var actionApi = api[ action ]

		var neededFunc = Ext.Array.findBy( actionApi, function( item ) { return item.name == method } )

		if( !neededFunc ) throw "Method: '" + method +"' not found in: '" +action + "' not supported in WebKit Provider."

		var result = neededFunc.func( null, null, args )

		var response = {
			responseText: Ext.encode( [ Ext.Object.merge( {}, request.jsonData, { result: result } ) ] )
		}

		this.onData( transaction.callbackOptions, true, response )
	},

	createWebKitExtDirectApi: function( callback ) {
		var me = this

		requirejs(
			[
				'webKit/createExtDirectApi'
			],
			function(
				createExtDirectApi
				) {
				'use strict'
				me.webKitExtDirectApi = createExtDirectApi( Spelled.Configuration.getWorkspacePath(), Spelled.Configuration.spellCorePath, Spelled.Configuration.spellCliPath )

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
