Ext.define('Spelled.controller.Register', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.register.Window',
		'Spelled.Validator'
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
		var result = Ext.decode( result, true ) || {}

		result.licenseData = licenseData

		Ext.callback( Ext.Function.pass( callback, [ result ] ) )
	},

	checkLicenseFile: function() {
		var licenseData   = this.application.platform.readLicense(),
			stateProvider = Spelled.Configuration.getStateProvider(),
			callback      = Ext.bind( function( result ) {

			stateProvider.set( 'license', Ext.merge( {}, stateProvider.get( 'license' ), result ) )

			if( !Spelled.Validator.validateLicenseInformation( result ) ) {
				this.application.fireEvent( 'showregister', false )
			}
		}, this )


		if( licenseData ) {
			this.application.platform.getLicenseInformation( licenseData, callback )
		} else {
			stateProvider.clear( 'license' )
			this.application.fireEvent( 'showregister', false )
		}
	},

	setLicenseData: function( view, license ) {
		var stateProvider = Spelled.Configuration.getStateProvider()

		stateProvider.set( 'license', license )
		this.application.platform.writeLicense( license.licenseData )
	},

	showRegister: function( closable ) {
		if( Spelled.Configuration.isDemoInstance() || !Spelled.platform.Adapter.isNodeWebKit() || Ext.ComponentQuery.query( 'registerwindow').length > 0 ) return

		var stateProvider = Spelled.Configuration.getStateProvider(),
			view          = Ext.widget( 'registerwindow', { closable: closable } ),
			form          = view.down( 'form' ).getForm(),
			license       = stateProvider.get( 'license'),
			payload       = Ext.isObject( license ) && license.payload ? license.payload : {}

		var values = Ext.isObject( license ) ? {
			name: payload.uid,
			license: license.licenseData
		}: {}

		form.setValues( values )
		view.validateForm( license )
	}
})
