Ext.define('Spelled.view.scene.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.scenesnavigator',

    title: "Scenes",
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    items:[
        {
            id: "ScenesTree",
			flex: 1,
            xtype: 'scenetreelist'
        }
    ]

});
