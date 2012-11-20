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
						if( this.isJavaScriptCompliant( value ) ) return this.__proto__.validator( value )
						return "Usage of invalid characters"
					}
				},
                {
                    xtype: "templatefolderpicker",
                    name: 'namespace',
                    fieldLabel: 'Import into',
                    displayField: 'text',
                    valueField: 'id'
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
