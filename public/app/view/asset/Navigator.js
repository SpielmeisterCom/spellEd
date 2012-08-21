Ext.define('Spelled.view.asset.Navigator', {
	extend: 'Spelled.abstract.view.Navigator',
    alias : 'widget.assetsnavigator',

    title: "Assets",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items:[
        {
            id: "AssetsTree",
            flex: 1,
            xtype: 'assetstreelist'
        }
    ]

});