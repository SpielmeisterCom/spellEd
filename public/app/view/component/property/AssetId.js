Ext.define('Spelled.view.component.property.AssetId', {
    extend: 'Ext.form.ComboBox',

	alias : 'widget.assetidproperty',

	editable       : false,
	emptyText      : '-- Select a existing Asset --',
	store          : 'asset.Assets',
	name           : 'assetId',
	displayField   : 'name',
	valueField     : 'internalAssetId'
});