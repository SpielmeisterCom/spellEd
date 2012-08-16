Ext.define('Spelled.view.template.component.attribute.TextAppearance', {
    extend: 'Spelled.view.component.property.AssetId',
    alias : 'widget.spelledtextappearancefield',

	store: 'asset.Fonts',

	initComponent: function() {
		this.callParent()
	}
});
