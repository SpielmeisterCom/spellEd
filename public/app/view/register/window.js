Ext.define('Spelled.view.register.Window' ,{
    extend: 'Ext.Window',
    alias: 'widget.registerwindow',

	requires: [
		'Ext.form.field.Radio'
	],

	layout: 'fit',
	autoShow: true,

    title : 'Select the licence you want to use',
    modal : true,

   	initComponent: function() {
		Ext.applyIf(this, {
			items: [
				{
					bodyPadding: 10,
					xtype: 'form',
					items: [
						{
							xtype: 'radiofield',
							name: 'type',
							inputValue: 'personal',
							boxLabel: 'Personal licence (for commercial usage)',
							handler: Ext.bind( this.showDetails, this )
						},
						{
							name: 'details',
							xtype: 'container',
							margin: '0 0 0 20',
							width: 500,
							layout: 'fit',
							items: [
								{
									xtype: 'textfield',
									name: 'name',
									fieldLabel: 'User name',
									flex: 1,
									anchor: '100%',
									validator: this.validator
								},
								{
									xtype: "textarea",
									anchor    : '100%',
									rows: 7,
									name: 'licence',
									fieldLabel: 'Licence key',
									flex: 3,
									validator: this.validator
								}
							]
						},
						{
							xtype: 'radiofield',
							name: 'type',
							inputValue: 'free',
							boxLabel: 'Free licence (non commercial usage)',
							handler: Ext.bind( function( me, value ) {
								if( value ) {
									//TODO: refactor after implementing licencing
									this.down( 'textfield').reset()
									this.down( 'textarea').reset()
									this.toggleSubmitButton( true )
								}
							}, this )
						}
					],
					buttons: [
						{
							itemId: 'okRegisterButton',
							text: "Ok",
							handler: Ext.bind( this.submit, this ),
							disabled: true
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

	validator: function() {
		return "Not enabled"
	},

	submit: function() {
		var form = this.down( 'form' ).getForm()

		this.fireEvent( 'setlicence', this, form.getValues() )

		this.close()
	},

	checkData: function() {
		//TODO: to be implemented
		return false
	},

	toggleSubmitButton: function( enabled ) {
		var button = this.down( '#okRegisterButton' )

		enabled ? button.enable() : button.disable()
	},

	showDetails: function( checkbox, visible ) {
		var details = this.down( 'container[name="details"]' )

		if( !visible || this.checkData() ) {
			this.toggleSubmitButton( true )
		} else {
			this.toggleSubmitButton( false )
		}
	}
});
