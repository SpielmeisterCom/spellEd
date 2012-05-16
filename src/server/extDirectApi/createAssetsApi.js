define(
    'server/extDirectApi/createAssetsApi',
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
            var assetPathPart = "/library/assets"

            var util = createUtil( root )

            var createAsset = function( req, res, payload, next ) {
                var assetName = payload[0]

            }

            var getAll = function( req, res, payload, next ) {

            }

            var readAsset = function( req, res, payload, next ) {
                var tmpPath = util.getPath( payload[0].id )
                return util.readFile( tmpPath )
            }

            var updateAsset = function( req, res, payload, next ) {
                var project = payload[ 0 ]

            }

            var deleteAsset = function( req, res, payload, next ) {
                return "errol"
            }

            var getTree = function( req, res, payload, next ) {

                var tmpPath = root + payload[1] +  assetPathPart

                return util.listing( tmpPath, false, req, res, payload, next )
            }

            return [
                {
                    name: "create",
                    len: 1,
                    func: createAsset
                },
                {
                    name: "read",
                    len: 1,
                    func: readAsset
                },
                {
                    name: "update",
                    len: 1,
                    func: updateAsset
                },
                {
                    name: "delete",
                    len: 1,
                    func: deleteAsset
                },
                {
                    name: 'getTree',
                    len: 2,
                    func: getTree
                }
            ]
        }
    }
)
