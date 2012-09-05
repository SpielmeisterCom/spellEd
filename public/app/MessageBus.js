/**
 * Sends messages to engine instances. Performs transparent queuing when receiving engine instance is not yet initialized.
 */
Ext.define(
	'Spelled.MessageBus',
	{
		constructor : function( options ) {
			this.initConfig( options )
		},

		config : {
			handlers : {},
			queue : {}
		},

		send : function( targetId, message ) {
			if( this.isReadyToReceive( targetId ) ) {
				this.sendMessageToEngine( targetId, message )

			} else {
				this.addToQueue( targetId, message )
			}
		},

		sendMessageToEngine : function( targetId, message ) {
			var cmp = Ext.getCmp( targetId )

			cmp.el.dom.contentWindow.postMessage( JSON.stringify( message ), '*' )
		},

		isReadyToReceive : function( targetId ) {
			return ( this.queue[ targetId ] &&
				this.queue[ targetId ].initialized )
		},

		addToQueue : function( targetId, message ) {
			if( !this.queue[ targetId ] ) {
				this.queue[ targetId ] = {
					initialized : false,
					messages : []
				}
			}

			if( message ) {
				this.queue[ targetId ].messages.push( message )
			}
		},

		flushQueue : function( targetId ) {
			var queue = this.queue[ targetId ]

			if( !queue ) return

			var me = this

			Ext.each(
				queue.messages,
				function( message ) {
					me.sendMessageToEngine( targetId, message )
				}
			)

			queue.initialized = true
			queue.messages.length = 0
		},

		receive : function( event ) {
			var message = JSON.parse( event.data ),
				handler = this.handlers[ message.type ]

			if( handler ) {
				handler( message.iframeId, message.payload )
			}
		}
	}
);
