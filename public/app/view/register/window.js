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
							xtype: 'textfield',
							name: 'licenceType',
							fieldLabel: 'Type'
						},
						{
							xtype: 'textfield',
							name: 'date',
							fieldLabel: 'Date'
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

	validateForm: function( result, insertIntoForm ) {
		var registerWindow = this,
			form           = registerWindow.down( 'form' ).getForm(),
			invalid        = true

		var values = Ext.isObject( result ) ? {
			name: result.uid,
			license: result.licenseData
		}: {}

		if( insertIntoForm ) {
			form.setValues( values )
		}

		if( Ext.isObject( result ) && result.status == 'valid' ) {
			form.clearInvalid()
			invalid = false
		} else {
			form.markInvalid( { name: 'Invalid', license: 'Invalid' } )
		}

		registerWindow.down( '#okRegisterButton').setDisabled( invalid )
	},

	validator: function( value ) {
		var regWindow  = this.up( 'window' ),
			form    = this.up( 'form' ),
			license = form.down( 'textarea[name="license"]')

		var callback = function( result ) {
			regWindow.validateForm( result, false )
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
