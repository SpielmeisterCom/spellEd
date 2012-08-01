define(
	'server/extDirectApi/ProjectApi',
	[
		'path',
		'fs',
		'server/extDirectApi/createUtil',
		'server/extDirectApi/templates/entityFormatter',

		'underscore'
	],
	function(
		path,
		fs,
		createUtil,
		entityFormatter,

		_
	) {
		'use strict'

		return function( root ) {

			var getConfigFilePath = function ( projectsDir ) {
				return projectsDir + "/project.json"
			}

			var util = createUtil( root )

			/**
			 * This function creates a project in the spell engine format. It requires the project in the editor format as argument.
			 *
			 * @param {Object} project
			 */
			var translateProjectConfigToEngineFormat = function( project ) {
				var result = _.pick( project, 'name', 'startScene', 'scenes' )

				result.scenes = _.map(
					project.getScenes,
					function( sceneEditorFormat ) {
						var scene = _.pick( sceneEditorFormat, 'name', 'scriptId', 'systems' )

						scene.entities = _.map(
							sceneEditorFormat.getEntities,
							function( entityEditorFormat ) {
								return entityFormatter.toEngineFormat( entityEditorFormat )
							}
						)

						return scene
					}
				)

				return result
			}

			/**
			 * This function creates a project in the editor format. It requires the project in the spell engine format as argument.
			 *
			 * @param {Object} project
			 */
			var translateProjectConfigToEditorFormat = function( project ) {
				var result = _.pick( project, 'name', 'startScene', 'scenes' )

				result.scenes = _.map(
					project.scenes,
					function( sceneEngineFormat ) {
						var scene = _.pick( sceneEngineFormat, 'name', 'scriptId', 'systems' )

						scene.entities = _.map(
							sceneEngineFormat.entities,
							function( entity ) {
								return entityFormatter.toEditorFormat( entity )
							}
						)

						return scene
					}
				)

				return result
			}

            var createProject = function( req, res, payload, next ) {
                var projectName = payload[0],
                    projectDir  = util.getPath( projectName, false )


                if( path.existsSync( projectDir ) === false ) {
                    fs.mkdirSync( projectDir, "0755" )

                    return projectDir
                } else {
                    return false
                }
            }

            var getAll = function( req, res, payload, next ) {

                var files = fs.readdirSync( root )
                files.sort()

                var result = []

                _.each(
                    files,
                    function( projectDir ) {
                        var projectFilePath = util.getPath( projectDir )

                        var fileStat = fs.statSync( projectFilePath )

                        if( fileStat.isDirectory() ) {
                            var fileContent = fs.readFileSync( getConfigFilePath( projectFilePath ) , 'utf8' ),
                            	object = translateProjectConfigToEditorFormat(
									JSON.parse( fileContent )
								)

                            object.name = projectDir
                            result.push( object )
                        }
                    }
                )

                return result
            }

            var readProject = function( req, res, payload, next ) {
                var projectFilePath = util.getPath( payload[ 0 ].id )

				return translateProjectConfigToEditorFormat(
					util.readFile(
						getConfigFilePath( projectFilePath )
					)
				)
            }

            var updateProject = function( req, res, payload, next ) {
				var project         = payload[ 0 ],
					projectFilePath = util.getPath( project.name )

				util.writeFile(
					getConfigFilePath( projectFilePath ),
					JSON.stringify( translateProjectConfigToEngineFormat( project ), null, "\t" )
				)
            }

            var deleteProject = function( req, res, payload, next ) {
                return "errol"
            }

            return [
                {
                    name: "create",
                    len: 1,
                    func: createProject
                },
                {
                    name: "read",
                    len: 1,
                    func: readProject
                },
                {
                    name: "update",
                    len: 1,
                    func: updateProject
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deleteProject
                },
                {
                    name: 'getAll',
                    len: 0,
                    func: getAll
                }
            ]
        }
    }
)
