Ext.define('Spelled.controller.Register', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.register.Window'
	],

    views: [
		'register.Window'
    ],

    init: function() {
		this.listen({
			component: {
				'spelledmenu [action="showRegister"]': {
					click: this.showRegister
				},
				'nwtoolbar': {
					showRegister: this.showRegister
				},
				'registerwindow': {
					setlicence: this.setLicenceData
				}
			},
			controller:{
				'*': {
					showregister: this.showRegister
				}
			}
		})
    },

	setLicenceData: function( view, values ) {
		var stateProvider = Spelled.Configuration.getStateProvider()

		stateProvider.set( 'userName', values.name )

		this.application.platform.writeLicence( Ext.encode( values ) )
	},

	showRegister: function( closable ) {
		if( Spelled.Configuration.isDemoInstance() ) return

		var view = Ext.widget( 'registerwindow', { closable: closable } ),
			form = view.down( 'form').getForm(),
			stateProvider = Spelled.Configuration.getStateProvider()

		var values = {
			name: stateProvider.get( 'userName' ),
			licence: this.application.platform.readLicence()
		}

		form.setValues( values )
	}
})
