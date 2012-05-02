Ext.define('Spelled.view.blueprint.component.Property', {
    extend: 'Ext.form.Panel',
    alias : 'widget.componentblueprintproperty',

    bodyPadding: 10,
    title: 'Properties',
    flex: 1,
    items: [
        {
            xtype: 'displayfield',
            width: 447,
            value: 'spelljs/core',
            fieldLabel: 'Namespace',
            anchor: '100%'
        },
        {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Name',
            anchor: '100%'
        },
        {
            xtype: 'combobox',
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