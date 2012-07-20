Ext.define('Spelled.view.template.component.attribute.Appearance', {
    extend: 'Spelled.view.component.property.AssetId',
    alias : 'widget.spelledappearancefield',

	store: 'asset.Textures',

	initComponent: function() {
		this.callParent()
	}
});
