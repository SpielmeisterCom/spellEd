Ext.define('Spelled.view.asset.Editor', {
    extend: 'Ext.tab.Panel',
    alias : 'widget.asseteditor',
    title: "Asset Editor",

//    listeners: {
//        dragover: {
//            element: 'el',
//            fn: function( e ) {
//                console.log( arguments )
//                console.log( "Dropped item in asset editor" )
//
//                e.stopPropagation()
//                e.preventDefault()
//            }
//        }
//    },

    bbar: [
        {
            xtype: 'button',
            action: 'showCreateAsset',
            text: 'Create a new Asset'
        }
    ]


});