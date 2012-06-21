Ext.define('Spelled.view.component.property.AssetId', {
    extend: 'Ext.form.ComboBox',

	alias : 'widget.assetidproperty',

	editable       : false,
	emptyText      : '-- Select a existing Asset --',
	queryMode	   : 'local',
	store          : 'asset.Textures',
	name           : 'assetId',
	displayField   : 'name',
	valueField     : 'assetId'
});