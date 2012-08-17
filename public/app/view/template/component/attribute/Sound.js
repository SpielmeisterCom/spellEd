Ext.define('Spelled.view.template.component.attribute.Sound', {
	extend: 'Spelled.view.component.property.AssetId',
    alias : 'widget.spelledsoundfield',

	store: 'asset.Sounds',

	initComponent: function() {
		this.callParent()
	}
});
