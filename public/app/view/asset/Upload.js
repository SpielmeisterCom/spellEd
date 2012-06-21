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
                    editable: false,
					emptyText: '-- Select Type --',
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
					allowBlank: true,
                    name: 'asset',
                    fieldLabel: 'Asset',
                    labelWidth: 50,
                    msgTarget: 'side',
                    buttonText: 'Select a File...',
					listeners: {
						'change': function( cmp, value) {
							if( value )
								this.up('form').down('combobox[name="assetId"]').reset()
						}
					},
					validator: function( value ) {
						var file = this.up('form').down('combobox[name="assetId"]').getValue()
						if( ( !file && !value ) )
							return "You need to select a new File"
						else
							return true
					}
                },
				{
					xtype: "assetidproperty",
					hidden: true,
					allowBlank: true,
					fieldLabel: "From existing Asset",
					listeners: {
						'change': function( cmp, value) {
							if( value )
								this.up('form').down('filefield').reset()
						}
					},
					validator: function( value ) {
						var file = this.up('form').down('filefield').getValue()
						if( ( !file && !value ) )
							return "You need to select a new File or a existing Asset"
						else
							return true
					}
				},{
					xtype: 'menuseparator'
				}
            ],

            buttons: [
                {
                    formBind: true,
                    text: 'Upload',
                    action: 'createAsset'
                }
            ]
        }
    ]
});
