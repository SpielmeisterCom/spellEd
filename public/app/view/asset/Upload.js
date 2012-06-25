Ext.define('Spelled.view.asset.Upload', {
    extend: 'Ext.Window',
    alias: 'widget.createasset',

    title : 'Add a new Asset to the Project',
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
					store: 'asset.SpriteSheets',
					hidden: true,
					allowBlank: true,
					fieldLabel: "From existing Sprite Sheet",
					listeners: {
						'change': function( cmp, value) {
							if( value )
								this.up('form').down('filefield').reset()
						}
					},
					validator: function( value ) {
						var file = this.up('form').down('filefield').getValue()
						if( ( !file && !value ) )
							return "You need to select a existing Asset"
						else
							return true
					}
				},{
					xtype: 'menuseparator'
				},{
					xtype: 'spritesheetconfig',
					hidden: true
				},{
					xtype: 'animationassetconfig',
					hidden: true
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
