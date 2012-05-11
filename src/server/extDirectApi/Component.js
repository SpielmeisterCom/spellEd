define(
    'server/extDirectApi/Component',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,

        _
    ) {
        'use strict'
        return function( root ) {

            var util = createUtil( root )

            var getAllComponentBlueprints = function( req, res, payload, next ) {
                var tmpPath = util.getPath( "blueprints/spell/component/" )
                if ( !path ) return next()

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return next()

                return util.getDirFilesAsObjects( tmpPath )
            }

            /**
             *  Component Blueprints Actions
             */

            var readComponentBlueprint = function( req, res, payload, next ) {
                var tmpPath = util.getPath(  payload[0].id )

                return util.readFile( tmpPath )
            }

            var updateComponentBlueprint = function( req, res, payload, next ) {
                var component = payload[ 0 ],
                    tmpPath      = component.id

                var result = _.pick( component, 'name', 'namespace', 'type')

                var attributes = []
                _.each(
                    component.getAttributes,
                    function( attribute ) {
                        attributes.push(
                            _.pick( attribute, 'name', 'type', 'default' )
                        )
                    }
                )

                result.attributes = attributes

                util.writeFile( tmpPath, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteComponentBlueprint = function( req, res, payload, next ) {
                return "errol"
            }

            var createComponentBlueprint = function( req, res, payload, next ) {
                return "errol"
            }

            return [
                {
                    name: "getAll",
                    len: 0,
                    func: getAllComponentBlueprints
                },
                {
                    name: "read",
                    len: 1,
                    func: readComponentBlueprint
                },
                {
                    name: "create",
                    len: 1,
                    func: createComponentBlueprint
                },
                {
                    name: "update",
                    len: 1,
                    func: updateComponentBlueprint
                },
                {
                    name: "delete",
                    len: 1,
                    func: deleteComponentBlueprint
                }
            ]
        }
    }
)
