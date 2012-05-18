Ext.define('Spelled.view.asset.Upload', {
    extend: 'Ext.Window',
    alias: 'widget.createasset',

    title : 'Add a new Asset to the Project',
    modal : true,

    closable: true,

    items: [
        {
            defaults: {
                anchor: '100%'
            },
            xtype: "form",
            bodyPadding: 10,

            api: {
                submit: Spelled.AssetsActions.create
            },

            items: [
                {
                    xtype: "textfield",
                    name: 'name',
                    fieldLabel: 'Name'
                },
                {
                    xtype: 'filefield',
                    name: 'asset',
                    fieldLabel: 'Asset',
                    labelWidth: 50,
                    msgTarget: 'side',
                    allowBlank: false,
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
