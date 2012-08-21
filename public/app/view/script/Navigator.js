Ext.define('Spelled.view.script.Navigator', {
	extend: 'Spelled.abstract.view.Navigator',
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