Ext.define('Spelled.view.script.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.scriptsnavigator',

    title: "Scripts",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items:[
        {
            id: "ScriptsTree",
            flex: 1,
            xtype: 'scriptstreelist'
        }
    ]

});