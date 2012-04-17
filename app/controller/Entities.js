Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',


    views: [
        'entity.TreeList'
    ],

    showEntitylist: function( entities ) {
        console.log( "show entitylist called" )
    }
});