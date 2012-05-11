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
            id: "BlueprintsTree",
            flex: 1,
            xtype: 'blueprintstreelist'
        }
    ]

});