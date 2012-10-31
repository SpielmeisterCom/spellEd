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

			if( cmp ) cmp.el.dom.contentWindow.postMessage( Ext.encode( message ), '*' )
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

			Ext.each(
				queue.messages,
				function( message ) {
					this.sendMessageToEngine( targetId, message )
				},
				this
			)

			queue.initialized = true
			queue.messages.length = 0
		},

		receive : function( event ) {
			var message = Ext.decode( event.data, true )
			if( !message ) return
			var handler = this.handlers[ message.type ]

			if( handler ) {
				handler( message.iframeId, message.payload )
			}
		}
	}
);
