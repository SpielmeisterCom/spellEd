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
							xtype: "tool",
							type: 'search',
							handler: Ext.bind( me.clickedDeepLink, me )
						}
					]
				},
				{
					xtype: "textfield",
					name: 'animationType',
					value: 'sprite',
					fieldLabel: 'Animation Type',
					readOnly: true
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
					fieldLabel: 'Frames'
				}
			]
		})


		me.callParent()
	}
});
