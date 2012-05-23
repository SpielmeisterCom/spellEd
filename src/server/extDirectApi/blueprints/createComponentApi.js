define(
    'server/extDirectApi/blueprints/createComponentApi',
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

            /**
             *  Component Blueprints Actions
             */

            var readComponentBlueprint = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateComponentBlueprint = function( req, res, payload, next ) {
                var component = payload[ 0 ],
                    tmpPath   = component.id

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
