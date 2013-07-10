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
							validateOnChange: false,
							name: 'name',
							fieldLabel: 'User name',
							anchor: '100%',
							validator: Ext.bind( this.validator, this)
						},
						{
							xtype: "textarea",
							validateOnChange: false,
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
		var registerWindow = this,
			form           = registerWindow.down( 'form' ).getForm(),
			invalid        = true,
			pidField       = this.down( 'displayfield[name="pid"]'),
			infoField      = this.down( 'displayfield[name="information"]'),
			nameField      = this.down( 'textfield[name="name"]')

		pidField.reset()
		infoField.reset()

		if( Spelled.Validator.validateLicenseInformation( result ) && nameField.getValue() == result.payload.uid ) {
			var information = this.down( 'displayfield[name="information"]'),
				payload     = result.payload

			pidField.setValue( payload.pid )

			if( Spelled.Validator.validateLicenseSubscription( payload ) ) {
				var expireDate = Spelled.Converter.getLicenseExpireDate( payload.isd, payload.days )

				form.clearInvalid()
				invalid = false

				infoField.setValue( 'Entitles for free updates and upgrades until ' + Ext.Date.format( expireDate, 'F j, Y' ) )
			} else {
				infoField.setValue( 'License expired.' )
			}

		} else {
			form.markInvalid( { name: 'Invalid', license: 'Invalid' } )
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
