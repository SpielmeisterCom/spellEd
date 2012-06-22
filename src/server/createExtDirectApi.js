define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'server/extDirectApi/templates/createComponentApi',
        'server/extDirectApi/templates/createEntityApi',
        'server/extDirectApi/templates/createSystemApi',
        'server/extDirectApi/createAssetsApi',
        'server/extDirectApi/createScriptsApi',
        'server/extDirectApi/ProjectApi',

        'underscore'
    ],
    function(
        path,
        fs,
        createUtil,
        createComponentApi,
        createEntityApi,
        createSystemApi,
        createAssetsApi,
        createScriptsApi,
        createProjectApi,

        _
    ) {
        'use strict'

        return function( projectsRoot ) {

            var projectTemplateLibraryPath = "/library/templates/"
            var util = createUtil( projectsRoot )


            var listTemplates = function( req, res, payload, next ) {
                var requestedNode = ( payload[ 0 ] !== 'root' ) ? payload[ 0 ] :  projectsRoot + payload[1] + projectTemplateLibraryPath

                var tmpPath = util.getPath( requestedNode )

                if ( !tmpPath ) return {}

                return util.listing( tmpPath, true, req, res, payload, next )
            }

            var getAllTemplates = function( projectName, type ) {
                var templatesPath =  projectsRoot + projectName + projectTemplateLibraryPath,
                    tmpPath = util.getPath( templatesPath )


                if ( !tmpPath ) return {}

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return {}

                return _.filter(
                    util.getDirFilesAsObjects( tmpPath ),
                    function( template ) {
                        return ( template.type === type )
                    }
                )
            }

            var getAllentityTemplates = function( req, res, payload, next ) {
                var projectName =  payload[0]
                return getAllTemplates( projectName, 'entityTemplate' )
            }

            var getAllcomponentTemplates = function( req, res, payload, next ) {
                var projectName = payload[0]
                return getAllTemplates( projectName, 'componentTemplate' )
            }

			var getAllSystemsTemplates = function( req, res, payload, next ) {
				var projectName = payload[0]
				return getAllTemplates( projectName, 'systemTemplate' )
			}

            var createTemplate = function( req, res, payload, next ) {
                var api = ( payload.type === "componentTemplate" ) ? createComponentApi( projectsRoot ) :  createEntityApi( projectsRoot )

                var apiFunction = _.find(
                    api,
                    function( item ) {
                        return ( item.name === 'create')
                    }
                )

                if( apiFunction ) {
                    return apiFunction.func( req, res, payload, next )
                }
            }

            return {
                ProjectActions           : createProjectApi( projectsRoot ) ,
                ComponentTemplateActions : createComponentApi( projectsRoot ),
                EntityTemplateActions    : createEntityApi( projectsRoot ),
                AssetsActions            : createAssetsApi( projectsRoot ),
                SystemTemplateActions    : createSystemApi( projectsRoot ),
                ScriptsActions           : createScriptsApi( projectsRoot ),
                TemplatesActions         : [
                    {
                        name: "createTemplate",
                        len: 0,
                        func: createTemplate,
                        form_handler: true
                    },
                    {
                        name: "getTree",
                        len: 2,
                        func: listTemplates
                    },
                    {
                        name: "getAllEntitiesTemplates",
                        len: 1,
                        func: getAllentityTemplates
                    },
                    {
                        name: "getAllComponentsTemplates",
                        len: 1,
                        func: getAllcomponentTemplates
                    },
					{
						name: "getAllSystemsTemplates",
						len: 1,
						func: getAllSystemsTemplates
					}
                ]
            }
        }
    }
)
