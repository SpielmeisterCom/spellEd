Ext.define('Spelled.view.library.Navigator', {
	extend: 'Spelled.base.view.Navigator',
    alias : 'widget.librarynavigator',

    title: "Library",

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items:[
        {
            id: "LibraryTree",
            flex: 1,
            xtype: 'librarytreelist'
        }
    ]

});
