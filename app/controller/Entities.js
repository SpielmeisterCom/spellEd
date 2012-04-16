Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',


    views: [
        'entity.TreeList'
    ],

    showEntitylist: function() {
        console.log( "show entitylist called" )
    }
});