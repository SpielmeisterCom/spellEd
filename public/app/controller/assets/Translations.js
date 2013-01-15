Ext.define('Spelled.controller.assets.Translations', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.store.asset.Translations',
		'Spelled.model.assets.Translation'
	],

    views: [
    ],

    stores: [
        'asset.Translations'
    ],

    models: [
		'assets.Translation'
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

	messageBus: {},

    init: function() {
        this.control({
			'': {

			}
        })

		this.application.on({
			scope: this
		})
    }


})
