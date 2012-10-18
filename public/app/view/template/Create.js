Ext.define('Spelled.view.template.Create', {
    extend: 'Ext.Window',
    alias: 'widget.createtemplate',

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
                    xtype: "combo",
                    name: 'type',
                    editable: false,
                    store: 'template.Types',
					forceSelection: true,
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
                    xtype: "spellednamefield",
                    name: 'name',
                    fieldLabel: 'Name',
					vtype: 'alphanum'
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
