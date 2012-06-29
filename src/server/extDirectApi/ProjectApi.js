define(
    'server/extDirectApi/ProjectApi',
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

            var getConfigFilePath = function ( projectsDir ) {
                return projectsDir + "/project.json"
            }

            var util = createUtil( root )

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

                            var fileContent = fs.readFileSync( getConfigFilePath( projectFilePath ) , 'utf8' )
                            var object = JSON.parse( fileContent )

                            object.name = projectDir
                            result.push( object )
                        }
                    }
                )

                return result
            }

            var readProject = function( req, res, payload, next ) {
                var tmpPath = util.getPath( payload[0].id )
                return util.readFile( getConfigFilePath(tmpPath) )
            }

			var entityParsing = function( entity ) {
				var entityResult = _.pick( entity, 'name' )

				if( _.has( entity, 'templateId' ) &&
					!!entity.templateId ) {

					entityResult.templateId = entity.templateId
				}

				entityResult.components = _.reduce(
					entity.getComponents,
					function( memo, component ) {
						if( !component.additional && ( !component.changed || _.size( component.config ) === 0 )) return memo

						return memo.concat( _.pick( component, 'templateId', 'config' ) )
					},
					[]
				)

				entityResult.children = _.reduce(
					entity.getChildren,
					function( memo, entityChildren ) {
						return memo.concat( entityParsing( entityChildren ) )
					},
					[]
				)

				if( _.isEmpty(entityResult.components) ) delete entityResult.components
				if( _.isEmpty(entityResult.children) ) delete entityResult.children
				//delete templateId on anonymous entities
				if( _.isEmpty(entityResult.templateId) ) delete entityResult.templateId

				return entityResult
			}

            //TODO: don't write templatecomponentvalues, maybe the spelljs ext should do this?
            var updateProject = function( req, res, payload, next ) {
                var project = payload[ 0 ]

                var result = _.pick( project, 'name', 'startScene', 'scenes')
                result.scenes = []

                _.each(
                    project.getScenes,
                    function( scene ) {
                        var sceneResult = _.pick( scene, 'name', 'scriptId', 'systems' )
                        sceneResult.entities = []

                        _.each(
                            scene.getEntities, function( entity ) {
								sceneResult.entities.push( entityParsing( entity ) )
							}
                        )

                        result.scenes.push( sceneResult )
                    }
                )
                var projectFilePath = util.getPath( project.name )

                util.writeFile( getConfigFilePath( projectFilePath ) , JSON.stringify( result, null, "\t" ) )

                return result
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
