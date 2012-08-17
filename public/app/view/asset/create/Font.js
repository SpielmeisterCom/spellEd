Ext.define('Spelled.view.asset.create.Font', {
    extend: 'Ext.container.Container',
    alias: 'widget.textappearanceconfig',

	initComponent: function() {
	    var me = this

		var fontStore =  Ext.create( 'Ext.data.Store', {
			fields: ['fontName', 'fontStyle'],
			data: Ext.amdModules.systemFontDetector.getFonts()
		})

		var fontCombo = Ext.create( 'Ext.form.field.ComboBox',
			{
				typeAhead: true,
				queryMode: 'local',
				forceSelection: true,
				store: fontStore,
				displayField: 'fontName',
				valueField: 'fontName',
				name: 'fontFamily',
				fieldLabel: 'Font Family'
			}
		)

		fontCombo.setValue( fontStore.first() )

		Ext.applyIf( me, {
			layout:'column',
			items: [
				{
					columnWidth: 0.5,
					xtype: 'container',
					items: [
						fontCombo,
						{
							xtype: "numberfield",
							name: 'fontSize',
							minValue: 1,
							value: 14,
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
							value: "normal",
							name: 'fontStyle',
							fieldLabel: 'Font Style'
						},
						{
							xtype: "numberfield",
							name: 'spacing',
							minValue: 0,
							value: 1,
							fieldLabel: 'Spacing'
						},
						{
							xtype: "numberfield",
							name: 'outline',
							minValue: 0,
							value: 1,
							fieldLabel: 'Outline'
						},
						{
							xtype: "colorfield",
							allowBlank: true,
							value: "#FFF",
							name: 'color',
							fieldLabel: 'Color'
						},
						{
							xtype: "colorfield",
							allowBlank: true,
							value: "#000",
							name: 'outlineColor',
							fieldLabel: 'Outline Color'
						}
					]
				},
				{
					xtype: 'container',
					columnWidth: 0.5,
					items: [
						{
							xtype: 'tool-documentation',
							docString: "#!/guide/asset_type_text_appearance",
							width: 'null'
						},
						{
							xtype: 'image'
						}
					]
				}
			]

		})


		me.callParent()
	}
});
