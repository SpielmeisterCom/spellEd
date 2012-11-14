Ext.define('Spelled.view.asset.create.KeyFrameAnimation', {
    extend: 'Ext.container.Container',
    alias: 'widget.keyframeanimationconfig',

	initComponent: function() {
		var me    = this,
            store = Ext.getStore( 'asset.KeyFrameAnimationPreviews' )

        store.load()

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_key_frame_animation",
					width: 'null'
				},
				{
					border: null,
					items:[
                        {
                            xtype: 'assetidproperty',
                            queryMode: 'remote',
                            store: store,
                            fieldLabel: 'Preview asset',
                            listeners: {
                                select: Ext.bind( me.onSelectAsset, this )
                            }
                        },
						{
							xtype: 'spelledintegerfield',
							name: 'length',
							minValue: 1,
							fieldLabel: 'Animation length'
						},
						{
							xtype: 'treepanel',
							title: 'Choose a component attribute',
							rootVisible: false
						},
						{
							listeners: {
								edit: me.sortGridByTimeColumn
							},
							hidden: true,
							xtype: 'gridpanel',
							enableColumnHide: false,
							sortableColumns: false,
							name: 'attributeConfig',
							selType: 'rowmodel',
							plugins: [{
								ptype: 'cellediting',
								clicksToEdit: 1
							}],
							bbar: [
								{
									text: "Add",
									action: "addFrame"
								}
							],
							columns: [
								{
									header: 'Time in ms',
									dataIndex: 'time',
									width: 120,
									editor: {
										xtype: 'spelledintegerfield',
										allowBlank: false
									}
								},
								{
									header: 'value',
									width: 120,
									dataIndex: 'value',
									editor: {
										xtype: 'textfield',
										allowBlank: false
									}
								},
								{
									header: 'Easing function',
									dataIndex: 'interpolation',
									flex:1,
									editor: {
										xtype        : 'combobox',
										forceSelection: true,
										typeAhead    : true,
										emptyText    : '-- Select a Interpolation Function --',
										queryMode	 : 'local',
										store        : 'asset.InterpolationFunctions',
										name         : 'name',
										displayField : 'name',
										valueField   : 'name',
										listClass    : 'x-combo-list-small',
										allowBlank   : false
									}
								},
								{
									xtype: 'actioncolumn',
									width: 30,
									icon: 'images/icons/wrench-arrow.png',
									handler: Ext.bind( me.handleEditClick, me )
								}
							]
						}
					]
				}
			]
		})

		me.addEvents(
			'editclick'
		)

		me.callParent()
	},

    onSelectAsset: function() {
        var record = this.up( 'form').getForm().getRecord()

        this.fireEvent( 'refreshAssetPreview', this.up('editasset').down( 'assetiframe' ) , record )
    },

	sortGridByTimeColumn: function( editor, e) {
		e.record.store.sort()
	},

	handleEditClick: function(gridView, rowIndex, colIndex, column, e, record) {
		gridView.getSelectionModel().select( rowIndex )
		this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
	}
});
