Ext.define('Spelled.view.asset.create.Create', {
    extend: 'Ext.Window',
    alias: 'widget.createasset',

    title : 'Add a new Asset to the Project',
    modal : true,

	layout: 'fit',

	width : 560,

    closable: true,

    items: [ {
		xtype: 'assetform',
		api: {
			submit: Spelled.AssetsActions.create
		}
	}]
});
