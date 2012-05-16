Ext.define('Spelled.view.asset.Navigator', {
    extend: 'Ext.panel.Panel',
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