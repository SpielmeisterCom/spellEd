Ext.define('Spelled.view.template.component.attribute.AnimatedAppearance', {
	extend: 'Spelled.view.component.property.AssetId',
    alias : 'widget.spelledanimatedappearancefield',

	store: 'asset.Animations',

	initComponent: function() {
		this.callParent()
	}
});
