Ext.define('Spelled.view.scene.Navigator', {
    extend: 'Spelled.base.view.Navigator',
    alias : 'widget.scenesnavigator',

    title: "Scenes",

    items:[
        {
            id: "ScenesTree",
			flex: 1,
            xtype: 'scenetreelist'
        }
    ]

});
