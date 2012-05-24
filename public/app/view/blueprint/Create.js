Ext.define('Spelled.view.blueprint.Create', {
    extend: 'Ext.Window',
    alias: 'widget.createblueprint',

    title : 'Create a new Blueprint',
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
                submit: Spelled.BlueprintsActions.createBlueprint
            },

            items: [
                {
                    xtype: "combo",
                    name: 'type',
                    forceSelection: true,
                    store: 'blueprint.Types',
                    queryMode: 'local',
                    fieldLabel: "Blueprint Type",
                    displayField: 'name',
                    valueField: 'type'
                },
                {
                    xtype: "blueprintfolderpicker",
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
                    action: 'createBlueprint'
                }
            ]
        }
    ]
});
