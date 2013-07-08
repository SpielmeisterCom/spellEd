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
					setlicense: this.setLicenseData
				}
			},
			controller:{
				'*': {
					showregister: this.showRegister,
					licensecallback: this.licenseCallback,
					checklicensefile: this.checkLicenseFile
				}
			}
		})
    },

	refs: [
		{
			ref : 'RegisterWindow',
			selector: 'registerwindow'
		}
	],

	licenseCallback: function( licenseData, result, callback ) {
		var result = Ext.decode( result, true )

		if( result ) {
			result.licenseData = licenseData
		}

		Ext.callback( Ext.Function.pass( callback, [ result ] ) )
	},

	validateLicenseInformation: function( license ) {
		if( Ext.isObject( license ) && license.status == 'valid' ) {
			return true
		} else {
			false
		}
	},

	checkLicenseFile: function() {
		var licenseData = this.application.platform.readLicense()

		if( licenseData ) {
			var callback = Ext.bind( function( result ) {
				var stateProvider = Spelled.Configuration.getStateProvider()

				if( this.validateLicenseInformation( result ) ) {
					stateProvider.set( 'license', result )
				} else {
					this.application.fireEvent( 'showregister', false )
				}
			}, this )

			this.application.platform.getLicenseInformation( licenseData, callback )
		} else {
			this.application.fireEvent( 'showregister', false )
		}
	},

	setLicenseData: function( view, values ) {
		var stateProvider = Spelled.Configuration.getStateProvider()

		stateProvider.set( 'license', values )

		this.application.platform.writeLicense( Ext.encode( values ) )
	},

	showRegister: function( closable ) {
		if( Spelled.Configuration.isDemoInstance() || !Spelled.platform.Adapter.isNodeWebKit() ) return

		var stateProvider = Spelled.Configuration.getStateProvider(),
			view          = Ext.widget( 'registerwindow', { closable: closable } ),
			form          = view.down( 'form').getForm(),
			license       = stateProvider.get( 'license' )

		var values = Ext.isObject( license ) ? {
			name: license.uid,
			license: license.licenseData
		}: {}

		form.setValues( values )
	}
})
