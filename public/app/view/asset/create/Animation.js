Ext.define('Spelled.view.asset.create.Animation', {
    extend: 'Ext.container.Container',
    alias: 'widget.animationassetconfig',

	mixins: [ 'Spelled.abstract.field.AssetId' ],

	initComponent: function() {
		var me   = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_2d_animated_appearance",
					width: 'null'
				},
				{
					xtype: 'fieldcontainer',
					fieldLabel: "From existing Sprite Sheet",
					layout: 'column',
					items: [
						{
							xtype: "assetidproperty",
							store: 'asset.SpriteSheets'
						},
						{
							hidden: !this.edit,
							padding: 5,
							xtype: "tool",
							type: 'search',
							handler: Ext.bind( me.clickedDeepLink, me )
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					fieldLabel: "Offset",
					items: [
						{
							xtype: "spelledvec2field",
							convertIt: true,
							name: 'transformation',
							value: "[0,0]",
							fieldLabel: 'Transformation'
						},
						{
							xtype: "spelledvec2field",
							name: 'scale',
							convertIt: true,
							value: "[0,0]",
							fieldLabel: 'Scale'
						},
						{
							xtype: "numberfield",
							name: 'rotation',
							value: 0,
							fieldLabel: 'Rotation'
						}
					]
				},
				{
					xtype: "numberfield",
					name: 'duration',
					minValue: 0,
					fieldLabel: 'Duration'
				},
				{
					xtype: "textfield",
					name: 'frameIds',
					rawToValue: Spelled.Converter.integerListFromString,
					fieldLabel: 'Frames'
				}
			]
		})


		me.callParent()
	}
});
