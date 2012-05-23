define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'server/extDirectApi/blueprints/createComponentApi',
        'server/extDirectApi/blueprints/createEntityApi',
        'server/extDirectApi/createAssetsApi',
        'server/extDirectApi/ProjectApi',

        'underscore'
    ],
    function(
        path,
        fs,
        createUtil,
        createComponentApi,
        createEntityApi,
        createAssetsApi,
        createProjectApi,

        _
    ) {
        'use strict'

        return function( projectsRoot ) {

            var projectBlueprintLibraryPath = "/library/blueprints/"
            var util = createUtil( projectsRoot )


            var listBlueprints = function( req, res, payload, next ) {
                var requestedNode = ( payload[ 0 ] !== 'root' ) ? payload[ 0 ] :  projectsRoot + payload[1] + projectBlueprintLibraryPath

                var tmpPath = util.getPath( requestedNode )

                if ( !tmpPath ) return {}

                return util.listing( tmpPath, true, req, res, payload, next )
            }

            var getAllBlueprints = function( projectName ) {
                var blueprintsPath =  projectsRoot + projectName + projectBlueprintLibraryPath,
                    tmpPath = util.getPath( blueprintsPath )


                if ( !tmpPath ) return {}

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return {}

                return util.getDirFilesAsObjects( tmpPath )
            }

            var getAllEntityBlueprints = function( req, res, payload, next ) {
                var projectName =  payload[0]

                var blueprints = getAllBlueprints( projectName )

                return _.filter(
                    blueprints,
                    function( blueprint ) {
                        return ( blueprint.type === 'entityBlueprint' )
                    }
                )
            }

            var getAllComponentBlueprints = function( req, res, payload, next ) {
                var projectName = payload[0]

                var blueprints = getAllBlueprints( projectName )

                return _.filter(
                    blueprints,
                    function( blueprint ) {
                        return ( blueprint.type === 'componentBlueprint' )
                    }
                )
            }

            return {
                ProjectActions            : createProjectApi( projectsRoot ) ,
                ComponentBlueprintActions : createComponentApi( projectsRoot ),
                EntityBlueprintActions    : createEntityApi( projectsRoot ),
                AssetsActions             : createAssetsApi( projectsRoot ),
                BlueprintsActions : [
                    {
                        name: "getTree",
                        len: 2,
                        func: listBlueprints
                    },
                    {
                        name: "getAllEntitiesBlueprints",
                        len: 1,
                        func: getAllEntityBlueprints
                    },
                    {
                        name: "getAllComponentsBlueprints",
                        len: 1,
                        func: getAllComponentBlueprints
                    }
                ]
            }
        }
    }
)
