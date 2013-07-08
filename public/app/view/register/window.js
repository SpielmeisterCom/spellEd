Ext.define('Spelled.view.register.Window' ,{
    extend: 'Ext.Window',
    alias: 'widget.registerwindow',

	requires: [
		'Ext.form.field.Radio'
	],

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
							validateOnBlur: false,
							name: 'name',
							fieldLabel: 'User name',
							anchor: '100%',
							validator: this.validator
						},
						{
							xtype: "textarea",
							validateOnBlur: false,
							anchor    : '100%',
							rows: 9,
							name: 'license',
							fieldLabel: 'License key',
							validator: this.validator
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
							handler: Ext.bind( this.submit, this ),
							formBind: true
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
			hasResult      = Ext.isObject( result ),
			pidField       = this.down( 'displayfield[name="pid"]'),
			infoField      = this.down( 'displayfield[name="information"]'),
			nameField      = this.down( 'textfield[name="name"]')

		pidField.reset()
		infoField.reset()

		if( Spelled.Validator.validateLicenseInformation( result ) ){
			form.clearInvalid()
			invalid = false
		} else {
			form.markInvalid( { name: 'Invalid', license: 'Invalid' } )
		}

		if( hasResult && nameField.getValue() == result.payload.uid ) {
			var information = this.down( 'displayfield[name="information"]'),
				payload     = result.payload

			if( Spelled.Validator.validateLicenseSubscription( payload ) ) {
				var expireDate = Spelled.Converter.getLicenseExpireDate( payload.isd, payload.days )

				infoField.setValue( 'Entitles for free updates and upgrades until ' + Ext.Date.format( expireDate, 'F j, Y' ) )
			} else {
				infoField.setValue( 'License expired.' )
			}

			pidField.setValue( payload.pid )
		} else {
			form.markInvalid( { name: 'Invalid' } )
		}

		registerWindow.down( '#okRegisterButton').setDisabled( invalid )
	},

	validator: function( value ) {
		var regWindow = this.up( 'window' ),
			form      = this.up( 'form' ),
			license   = form.down( 'textarea[name="license"]')

		var callback = function( result ) {
			regWindow.validateForm( result )
		}

		Spelled.app.platform.getLicenseInformation( license.getValue(), callback )

		return true
	},

	submit: function() {
		var form = this.down( 'form' ).getForm()

		this.fireEvent( 'setlicense', this, form.getValues() )

		this.close()
	}
});
