Ext.define('Spelled.view.blueprint.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.blueprintsnavigator',

    title: "Blueprints",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items:[
        {
            id: "EntitiesBlueprintTree",
            flex: 1,
            xtype: 'entitiesblueprinttreelist'
        },
        {
            id: "ComponentsBlueprintTree",
            flex: 1,
            xtype: 'componentsblueprinttreelist'
        }
    ]

});