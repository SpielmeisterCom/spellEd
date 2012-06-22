Ext.define('Spelled.view.template.Create', {
    extend: 'Ext.Window',
    alias: 'widget.createtemplate',

    title : 'Create a new Template',
    modal : true,

    closable: true,

    items: [
        {
            defaults: {
                anchor: '100%',
                allowBlank: false
            },
            xtype: "form",
            bodyPadding: 10,

            api: {
                submit: Spelled.TemplatesActions.createTemplate
            },

            items: [
                {
                    xtype: "combo",
                    name: 'type',
                    editable: false,
                    store: 'template.Types',
                    queryMode: 'local',
                    fieldLabel: "Template Type",
                    displayField: 'name',
                    valueField: 'type'
                },
                {
                    xtype: "templatefolderpicker",
                    name: 'namespace',
                    fieldLabel: 'Import into',
                    displayField: 'text',
                    valueField: 'id'
                },
                {
                    xtype: "textfield",
                    name: 'name',
                    fieldLabel: 'Name'
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
