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

        var blueprintsPath = 'data/blueprints/'

        return function( projectsRoot ) {

            var util = createUtil( projectsRoot )

            /**
             *
             * ExtDirectFunctions
             *
             */

            var listBlueprints = function( req, res, payload, next ) {
                var rootPath = blueprintsPath
                return util.listing( rootPath, true, req, res, payload, next )
            }


            return {
                ProjectActions            : createProjectApi( projectsRoot ) ,
                ComponentBlueprintActions : createComponentApi( projectsRoot ),
                EntityBlueprintActions    : createEntityApi( projectsRoot ),
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
