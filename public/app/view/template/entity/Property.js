Ext.define('Spelled.view.template.entity.Property', {
    extend: 'Ext.form.Panel',
    alias : 'widget.entitytemplateproperty',

	bodyPadding: 10,
	margin: '5 0 0 0',
	title: 'Property',

	defaults: {
		hidden: true
	},

	buttons: [
		{
			text: "Save",
			action: "save"
		},
		{
			text: "Reset",
			action: "reset",
			formBind:true
		}
	],

    items: [
        {
            xtype: 'textfield',
            readOnlyCls: 'readOnlyField',
            readOnly: true,
            name: 'name',
            fieldLabel: 'Name',
            allowBlank:false,
            anchor: '100%'
        },
        {
            xtype: 'textfield',
            readOnlyCls: 'readOnlyField',
            readOnly: true,
            name: 'type',
            fieldLabel: 'Type',
            allowBlank:false,
            anchor: '100%'
        },
        {
            xtype: 'textareafield',
            name: 'default',
            fieldLabel: 'Default value',
            allowBlank:false,
            anchor: '100%'
        }
    ],

	showConfig: function() {
	this.items.each(
		function( item ) {
			item.show()
		}
	)
}
});
