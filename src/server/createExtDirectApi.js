define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'server/extDirectApi/Component',
        'server/extDirectApi/Entity',
        'server/extDirectApi/Project',

        'underscore'
    ],
    function(
        path,
        fs,
        createUtil,
        createComponentApi,
        createEntityApi,
        createProjectApi,

        _
    ) {
        'use strict'

        var root = 'data/'
        var blueprintsPath = 'data/blueprints/'


        var util = createUtil( root )

        /**
         *
         * ExtDirectFunctions
         *
         */

        var listBlueprints = function( req, res, payload, next ) {
            var rootPath = blueprintsPath
            return util.listing( rootPath, true, req, res, payload, next )
        }

        return function(){
            return {
                ProjectActions            : createProjectApi( root ) ,
                ComponentBlueprintActions : createComponentApi( root ),
                EntityBlueprintActions    : createEntityApi( root ),
                BlueprintsActions : [
                    {
                        name: "getTree",
                        len: 1,
                        func: listBlueprints
                    }
                ]
            }
        }
    }
)
