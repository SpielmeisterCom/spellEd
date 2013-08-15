Ext.define('Spelled.controller.assets.Sound', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.store.asset.Sounds',
		'Spelled.model.assets.Sounds',
		'Spelled.view.asset.create.Sound'
	],

    views: [
		'asset.create.Sound'
    ],

    stores: [
        'asset.Sounds'
    ],

    models: [
		'assets.Sound'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'AssetEditor',
			selector: '#SceneEditor'
		},
		{
			ref : 'Navigator',
			selector: '#LibraryTree'
		}
    ],

    init: function() {
        this.control({
			'soundasset': {

			}
        })

    }


})
