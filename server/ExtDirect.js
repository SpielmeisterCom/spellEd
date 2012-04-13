'use strict';

var API = {
    url: "/router",
    type: "remoting",
    actions: {
        ZoneListing: [ {
            name: "getTree",
            len: 1
        }]
    }
}

exports.getApi = function() {
    return 'Ext.ns("Ext.app"); Ext.app.REMOTING_API = '+ JSON.stringify( API ) + ";"
}

exports.createExtDirect = function( payload ) {

    var route = function( payload ) {
        return console.log( "need to route the payload" )
    }

    var ExtDirect = function( payload ) {
        this.payload = payload
    }

    ExtDirect.prototype = {
        route:  route
    }

    return new ExtDirect( payload )
}
