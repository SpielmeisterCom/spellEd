Ext.define('Spelled.view.blueprint.entity.Property', {
    extend: 'Ext.form.Panel',
    alias : 'widget.entityblueprintproperty',

    bodyPadding: 10,
    title: 'Property',

    buttons: [
        {
            text: "Save",
            action: "save"
        },
        {
            text: "Reset",
            action: "reset"
        }
    ],
    items: [
        {
            xtype: 'displayfield',
            name: 'name',
            fieldLabel: 'Name',
            anchor: '100%'
        },
        {
            xtype: 'displayfield',
            name: 'type',
            fieldLabel: 'Type',
            anchor: '100%'
        },
        {
            xtype: 'textareafield',
            name: 'default',
            fieldLabel: 'Default value',
            anchor: '100%'
        }
    ]
});