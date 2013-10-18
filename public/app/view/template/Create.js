Ext.define('Spelled.view.template.Create', {
    extend: 'Ext.Window',
    alias: 'widget.createtemplate',

	requires: [
		'Ext.form.field.Hidden'
	],

    title : 'Create a new Template',
    modal : true,

	layout: 'fit',

	width : 450,

    closable: true,

    items: [
        {
            defaults: {
                anchor: '100%',
                allowBlank: false
            },
            xtype: "form",
            bodyPadding: 10,

            items: [
                {
                    xtype: "hiddenfield",
                    name: 'type'
                },
				{
					xtype: "spellednamefield",
					name: 'name',
					fieldLabel: 'Name',
					vtype: 'alphanum',
					validator: function( value ) {
						var namespace = this.up( 'form' ).down( 'templatefolderpicker' )

						if( this.isJavaScriptCompliant( value ) ) return Object.getPrototypeOf( this ).validator( value, namespace )
						return "Usage of invalid characters"
					}
				},
                {
                    xtype: "templatefolderpicker",
                    name: 'namespace',
                    fieldLabel: 'Namespace',
                    displayField: 'text',
                    valueField: 'id',
					listeners: {
						select: function() {
							var form = this.up( 'form' )
							if( form ) form.getForm().isValid()
						}
					}
                }
            ],

            buttons: [
                {
                    formBind: true,
                    text: 'Create',
                    action: 'createTemplate'
                }
            ]
        }
    ]
});
