Ext.define('Spelled.view.library.folder.Create', {
	extend: 'Ext.window.Window',
    alias : 'widget.createlibraryfolder',

	mixins: [ 'Spelled.abstract.validator.General' ],

	autoShow: true,
	modal: true,

    title: "Create a new library namespace",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			items:[{
				xtype: 'form',
				defaults: {
					anchor: '100%',
					allowBlank: false
				},
				bodyPadding: 10,
				items: [
					{
						xtype: 'textfield',

						fieldLabel: 'Name',
						validator: function( value ) {
							if( me.isNamespaceCompliant( value ) ) return true
							else return "Illegal character used. Only alphanumeric values and '.' allowed"
						},
						name: 'path'
					},
					{
						xtype: "libraryfolderpicker",
						name: 'namespace',
						fieldLabel: 'Create into',
						displayField: 'text',
						valueField: 'id'
					}
				],
				buttons: [
					{
						formBind: true,
						text: 'Create',
						action: 'createFolder'
					}
				]
			}]
		})

		this.callParent( arguments )
	}
})
