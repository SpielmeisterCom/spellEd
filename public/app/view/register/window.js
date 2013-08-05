Ext.define('Spelled.view.register.Window' ,{
    extend: 'Ext.Window',
    alias: 'widget.registerwindow',

	requires: [
		'Ext.form.field.Radio'
	],

	runningValidation: false,

	layout: 'fit',
	autoShow: true,

    title : 'Please enter your license information',
    modal : true,

	width: 650,

   	initComponent: function() {
		Ext.applyIf(this, {
			items: [
				{
					bodyPadding: 10,
					xtype: 'form',
					items: [
						{
							xtype: 'textfield',
							name: 'name',
							fieldLabel: 'User name',
							anchor: '100%',
							validator: Ext.bind( this.validator, this)
						},
						{
							xtype: "textarea",
							anchor    : '100%',
							rows: 9,
							name: 'license',
							fieldLabel: 'License key',
							validator: Ext.bind( this.validator, this)
						},
						{
							xtype: 'displayfield',
							name: 'pid',
							fieldLabel: 'License type'
						},
						{
							xtype: 'displayfield',
							name: 'information'
						}
					],
					buttons: [
						{
							itemId: 'okRegisterButton',
							disabled: true,
							text: "Ok",
							handler: Ext.bind( this.submit, this )
						},
						{
							text: "Cancel",
							disabled: !this.closable ? true : false,
							handler: function() {
								this.up('window').close()
							}
						}
					]
				}
			]
		})

		this.callParent( arguments )
	},

	validateForm: function( result ) {
		if( !this.down( 'form' ) || !result ) return

		var registerWindow = this,
			form           = registerWindow.down( 'form' ).getForm(),
			invalid        = true,
			pidField       = this.down( 'displayfield[name="pid"]'),
			infoField      = this.down( 'displayfield[name="information"]'),
			nameField      = this.down( 'textfield[name="name"]'),
			hasPayload     = Ext.isObject( result.payload ),
			isCorrectUser  = hasPayload && nameField.getValue() == result.payload.uid

		pidField.reset()
		infoField.reset()

		if( Spelled.Validator.validateLicenseInformation( result ) && isCorrectUser ) {
			var information = this.down( 'displayfield[name="information"]'),
				payload     = result.payload

			pidField.setValue( payload.pid )
			form.clearInvalid()
			invalid = false

			var expireDate = Spelled.Converter.getLicenseExpireDate( payload.isd, payload.days )

			infoField.setValue( 'Entitles for free updates and upgrades until ' + Ext.Date.format( expireDate, 'F j, Y' ) )

		} else if( hasPayload ) {
			form.markInvalid( { name: 'Invalid', license: 'Invalid' } )

			if( Spelled.Validator.validateLicenseSubscription( result.payload ) ) {
				infoField.setValue( 'License expired.' )
			} else if( !isCorrectUser ){
				infoField.setValue( 'Wrong username.' )
			}
		} else {
			infoField.setValue( "Your license signature is invalid." )
		}

		registerWindow.down( '#okRegisterButton').setDisabled( invalid )

		registerWindow.runningValidation = false

		return invalid
	},

	validator: function( value, overridingCallback ) {
		var regWindow = this,
			form      = this.down( 'form' ),
			license   = form.down( 'textarea[name="license"]')

		if( !value ) return "Missing field."

		if( regWindow.runningValidation ) return
		regWindow.runningValidation = true

		var callback = function( result ) {
			regWindow.validateForm( result )
		}

		Spelled.app.platform.getLicenseInformation( license.getValue(), overridingCallback ? overridingCallback : callback )

		return 'Waiting for validation...'
	},

	submit: function() {
		var form   = this.down( 'form' ).getForm(),
			values = form.getValues()

		var overridingCallback = Ext.bind( function( result ) {
			this.fireEvent( 'setlicense', this, result )
			this.close()
		}, this)

		this.validator( values, overridingCallback )
	}
});
