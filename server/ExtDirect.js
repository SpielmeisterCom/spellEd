'use strict';

(function () {

    var route = function( payload ) {
        return console.log( "need to route the payload" )
    }


    var ExtDirect = function( payload ) {
        this.payload = payload
    }

    ExtDirect.prototype = {
        route: route
    }

    return ExtDirect
}());
