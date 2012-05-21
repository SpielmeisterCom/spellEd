Ext.define('Spelled.view.asset.Upload', {
    extend: 'Ext.Window',
    alias: 'widget.createasset',

    title : 'Add a new Asset to the Project',
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
                submit: Spelled.AssetsActions.create
            },

            items: [
                {
                    xtype: "combo",
                    name: 'type',
                    forceSelection: true,
                    store: 'asset.Types',
                    queryMode: 'local',
                    fieldLabel: "Type",
                    displayField: 'name',
                    valueField: 'type'
                },
                {
                    xtype: "textfield",
                    name: 'name',
                    fieldLabel: 'Name'
                },
                {
                    xtype: "assetfolderpicker",
                    name: 'folder',
                    fieldLabel: 'Import into',
                    displayField: 'text',
                    valueField: 'id'
                },
                {
                    xtype: 'filefield',
                    name: 'asset',
                    fieldLabel: 'Asset',
                    labelWidth: 50,
                    msgTarget: 'side',
                    buttonText: 'Select a File...'
                }
            ],

            buttons: [
                {
                    text: 'Upload',
                    action: 'createAsset'
                }
            ]
        }
    ]
});
