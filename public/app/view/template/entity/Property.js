Ext.define('Spelled.view.template.entity.Property', {
    extend: 'Spelled.view.template.component.Property',
    alias : 'widget.entitytemplateproperty',

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
    ]
});
