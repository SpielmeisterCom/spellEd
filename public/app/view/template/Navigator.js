Ext.define('Spelled.view.template.Navigator', {
	extend: 'Spelled.abstract.view.Navigator',
    alias : 'widget.templatesnavigator',

    title: "Templates",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items:[
        {
            id: "TemplatesTree",
            flex: 1,
            xtype: 'templatestreelist'
        }
    ]

});
