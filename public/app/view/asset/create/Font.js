Ext.define('Spelled.view.asset.create.Font', {
    extend: 'Ext.container.Container',
    alias: 'widget.textappearanceconfig',

	initComponent: function() {
	    var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_text_appearance",
					width: 'null'
				},
				{
					xtype: "combo",
					queryMode: 'local',
					displayField: 'name',
					valueField: 'name',
					name: 'fontFamily',
					fieldLabel: 'Font Family'
				},
				{
					xtype: "numberfield",
					name: 'fontSize',
					minValue: 0,
					fieldLabel: 'Font Size'
				},
				{
					xtype: "combo",
					editable: false,
					store: {
						fields: ['name'],
						data : [
							{"name":"normal"},
							{"name":"bold"},
							{"name":"italic"}
						]
					},
					queryMode: 'local',
					displayField: 'name',
					valueField: 'name',
					name: 'fontStyle',
					fieldLabel: 'Font Style'
				},
				{
					xtype: "colorfield",
					allowBlank: true,
					name: 'color',
					fieldLabel: 'Color'
				},
				{
					xtype: "numberfield",
					name: 'spacing',
					fieldLabel: 'Spacing'
				},
				{
					xtype: "numberfield",
					name: 'outline',
					fieldLabel: 'Outline'
				},
				{
					xtype: "colorfield",
					allowBlank: true,
					name: 'outlineColor',
					fieldLabel: 'Outline Color'
				}

			]
		})


		me.callParent()
	}
});
