define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'server/extDirectApi/blueprints/createComponentApi',
        'server/extDirectApi/blueprints/createEntityApi',
        'server/extDirectApi/ProjectApi',

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

        return function( projectsRoot, spellBlueprintsRootPath ) {

            var util = createUtil( spellBlueprintsRootPath )

            var listBlueprints = function( req, res, payload, next ) {

                return util.listing( spellBlueprintsRootPath, true, req, res, payload, next )
            }

            var getAllEntityBlueprints = function( req, res, payload, next ) {
                var tmpPath = util.getPath( spellBlueprintsRootPath + "/spell/entity/" )

                if ( !tmpPath ) return next()

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return next()

                return util.getDirFilesAsObjects( tmpPath )
            }

            var getAllComponentBlueprints = function( req, res, payload, next ) {
                var tmpPath = util.getPath( spellBlueprintsRootPath + "/spell/component/" )
                if ( !path ) return next()

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return next()

                return util.getDirFilesAsObjects( tmpPath )
            }

            return {
                ProjectActions            : createProjectApi( projectsRoot ) ,
                ComponentBlueprintActions : createComponentApi( projectsRoot = spellBlueprintsRootPath, spellBlueprintsRootPath ),
                EntityBlueprintActions    : createEntityApi( projectsRoot = spellBlueprintsRootPath, spellBlueprintsRootPath ),
                BlueprintsActions : [
                    {
                        name: "getTree",
                        len: 1,
                        func: listBlueprints
                    },
                    {
                        name: "getAllEntitiesBlueprints",
                        len: 0,
                        func: getAllEntityBlueprints
                    },
                    {
                        name: "getAllComponentsBlueprints",
                        len: 0,
                        func: getAllComponentBlueprints
                    }
                ]
            }
        }
    }
)
