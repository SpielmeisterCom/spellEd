define(
	'server/extDirectApi/createStorageApi',
	[
		'path',
		'fs',
		'server/extDirectApi/createUtil',
		'flob',

		'underscore'
	],
	function(
		path,
		fs,
		createUtil,
		flob,

		_
	) {
		'use strict'

		return function( root ) {
			var util          = createUtil( root ),
				libraryPrefix = "library"

			var generateExtModel = function( filePath ) {
				var content   = JSON.parse( getByFilePath( filePath ) ),
					fileParts = filePath.substr( filePath.indexOf( libraryPrefix ) + libraryPrefix.length + 1 ).split( path.sep ),
					baseName  = fileParts.pop()

				content.id = filePath

				if( content.type === 'project' ) {
					content.name = fileParts.pop()
				} else {
					content.name      = path.basename( baseName, path.extname( baseName ) )
					content.namespace = fileParts.join( "." )
				}

				return content
			}

			var getByFilePath = function( filePath ) {
				return fs.readFileSync( filePath, 'utf8' )
			}

			var writeContent = function( filePath, content, encoding ) {

				return fs.writeFileSync( filePath, ( _.isObject( content ) )
					? JSON.stringify( content, '', '\t' )
					: ( encoding === 'base64' ) ?  new Buffer( content, 'base64' ) : content
				)
			}

			var getAllByType = function( params ) {
				var searchPath = util.getPath( params.projectName || root ),
					type       = params.type,
					subtype    = params.subtype,
					pattern    = ( params.projectName ) ? searchPath + "/library/**/*" : searchPath + "/*/*",
					files      = flob.byTypes( pattern, [ '.json' ] )

				var result = _.map(
					files,
					function( filePath ) {
						try{
							var content = generateExtModel( filePath )

							if( _.isArray( type ) ) {
								return ( _.find( type, function( key ){ return key === content.type } ) ) ? content : false

							} else if( subtype ) {
								return ( content.type === type && content.subtype === subtype ) ? content : false
							} else {
								return ( content.type === type ) ? content : false
							}

						} catch( e ) {
							throw  "Could not parse JSON file: '" + path.relative( searchPath, filePath  ) + "' <br/> " + e
						}
					}
				)

				return _.filter(
					result,
					function( item ) {
						return item !== false
					}
				)
			}

			var read = function( req, res, payload ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload

				if( _.has( params, 'id' ) ) {
					var filePath = util.getPath( params.id )

					if( !fs.existsSync( filePath ) ) return

					return ( _.has( params, 'type' ) ) ? generateExtModel( filePath ) : getByFilePath( filePath )
				} else {
					return getAllByType( params )
				}
			}

			var create = function(  req, res, payload  ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id ),
					content  = params.content

				writeContent( filePath, content, params.encoding )

				return ( _.has( params, 'type' ) ) ? generateExtModel( filePath ) : getByFilePath( filePath )
			}

			var update = function( req, res, payload ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id),
					content  = params.content

				return writeContent( filePath, content, params.encoding )
			}

			var destroy = function( req, res, payload ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id)

				fs.unlink( filePath )
			}

			var getNamespaces = function( req, res, payload ) {
				var params     = _.isArray( payload ) ? payload.pop() : payload,
					readDir    = fs.readdirSync,
					fsStat     = fs.statSync,
					join       = path.join,
					searchPath = util.getPath( join( params.projectName, "library" ) ),
					files      = [],
					sep        = path.sep

				var searchFiles = function( dirFiles, parentPath ) {
					_.each(
						dirFiles,
						function( file ){
							var filePath = join( parentPath, file ),
								stat     = fsStat( filePath )

							if( stat.isDirectory() ) {
								files.push( filePath.substr( filePath.indexOf( searchPath ) + searchPath.length ) )
								searchFiles( readDir( filePath ), filePath )
							}
						}
					)
				}

				searchFiles( readDir( searchPath ), searchPath )

				var result = _.map(
					files,
					function( item ) {
						return _.rest( item.split( sep ) ).join( '.' )
					}
				)

				return _.uniq( _.without( result, false ) )
			}

			var createNamespaceFolder = function( req, res, payload ) {
				var params      = _.isArray( payload ) ? payload.pop() : payload,
					projectPath = util.getPath( path.join( params.projectName, 'library' ) ),
					namespace   = params.path,
					exists      = fs.existsSync

				if( namespace ) {
					var parts = namespace.split( '.' ),
						tmp   = projectPath

					_.each(
						parts,
						function( part ) {
							tmp = path.join( tmp, part )
							if( !exists( tmp ) ) {
								fs.mkdirSync( tmp )
							}
						}
					)
				}
			}

			var rmDir = function( dirPath ) {
				var files = fs.readdirSync( dirPath )

				_.each(
					files,
					function( file ) {
						var filePath = dirPath + '/' + file

						if ( fs.statSync( filePath ).isFile() )
							fs.unlinkSync( filePath )
						else
							rmDir( filePath )
					}
				)

				fs.rmdirSync( dirPath )
			}

			var deleteFolder = function( req, res, payload ) {
				var params      = _.isArray( payload ) ? payload.pop() : payload,
					projectPath = util.getPath( path.join( params.projectName, 'library' ) ),
					namespace   = params.namespace

				if( namespace ) {
					var parts      = namespace.split( '.' ),
						folderPath = path.join( projectPath, parts.join( path.sep ) )

					rmDir( folderPath )
				}
			}

            return [
                {
                    name: "create",
                    len: 1,
                    func: create
                },
				{
					name: "createNamespaceFolder",
					len: 1,
					func: createNamespaceFolder
				},
                {
                    name: "read",
                    len: 1,
                    func: read
                },
                {
                    name: "update",
                    len: 1,
                    func: update
                },
                {
                    name: "destroy",
                    len: 1,
                    func: destroy
                },
				{
					name: "getNamespaces",
					len: 1,
					func: getNamespaces
				},
				{
					name: "deleteFolder",
					len: 1,
					func: deleteFolder
				}
			]
        }
    }
)
