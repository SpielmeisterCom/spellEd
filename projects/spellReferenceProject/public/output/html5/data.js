define(
	'spell/client/runtimeModule',
	function() {
		return {"name":"spellReferenceProject","startZone":"Game","zones":[{"entities":[{"name":"spacecraft1","blueprintId":"spellReferenceProject.entity.spacecraft","config":{"spell.component.core.position":[128,128],"spell.component.core.graphics2d.appearance":{"textureId":"textures/spellReferenceProject/pixelShip2.png"},"spell.component.core.actor":{"id":"aiControlled"},"spellReferenceProject.component.spacecraft":{"mass":3,"thrusterForce":250}}},{"name":"spacecraft2","blueprintId":"spellReferenceProject.entity.spacecraft","config":{"spell.component.core.position":[400,250],"spell.component.core.rotation":0.2,"spell.component.core.graphics2d.appearance":{},"spell.component.core.inputDefinition":{"actorId":"playerControlled","keyToAction":{"space":"accelerate","left arrow":"steerLeft","right arrow":"steerRight"}},"spell.component.core.actor":{"id":"playerControlled"},"spellReferenceProject.component.spacecraft":{"mass":1,"thrusterForce":110}}}],"name":"Game","resources":["textures/spellReferenceProject/pixelShip2.png","textures/spellReferenceProject/pixelShip1.png"],"scriptId":"spell/zone/default","systems":{"update":[],"render":["spell.system.keyInput","spellReferenceProject.system.spacecraftIntegrator","spell.system.render"]}}],"componentBlueprints":[{"type":"componentBlueprint","namespace":"spell.component.core","name":"position","attributes":[{"name":"value","type":"vec3","default":[0,0,0]}]},{"type":"componentBlueprint","namespace":"spell.component.core","name":"rotation","attributes":[{"name":"value","type":"Number","default":0}]},{"type":"componentBlueprint","namespace":"spell.component.core.graphics2d","name":"appearance","attributes":[{"name":"rotation","type":"number","default":0},{"name":"scale","type":"vec2","default":[1,1]},{"name":"translation","type":"vec2","default":[0,0]},{"name":"textureId","type":"assetTextureId","default":"spell/textures/not_defined"},{"name":"opacity","type":"number","default":1}]},{"type":"componentBlueprint","namespace":"spell.component.core.graphics2d","name":"renderData","attributes":[{"name":"rotation","type":"number","default":0},{"name":"scale","type":"vec2","default":[1,1]},{"name":"translation","type":"vec2","default":[0,0]},{"name":"pass","type":"integer","default":1},{"name":"opacity","type":"number","default":1}]},{"type":"componentBlueprint","namespace":"spell.component.core","name":"inputDefinition","attributes":[{"name":"actorId","type":"string"},{"name":"keyToAction","type":"object","default":{}}]},{"type":"componentBlueprint","namespace":"spell.component.core","name":"actor","attributes":[{"name":"id","type":"string"},{"name":"actions","type":"object","default":{}}]},{"type":"componentBlueprint","namespace":"spellReferenceProject.component","name":"spacecraft","attributes":[{"name":"mass","type":"Number","default":1},{"name":"thrusterForce","type":"Number","default":0.5},{"name":"speed","type":"vec2","default":[0,0]}]}],"entityBlueprints":[{"type":"entityBlueprint","namespace":"spellReferenceProject.entity","name":"spacecraft","components":[{"blueprintId":"spell.component.core.position"},{"blueprintId":"spell.component.core.rotation"},{"blueprintId":"spell.component.core.graphics2d.appearance","config":{"scale":[4,4],"textureId":"textures/spellReferenceProject/pixelShip1.png"}},{"blueprintId":"spell.component.core.graphics2d.renderData"},{"blueprintId":"spell.component.core.inputDefinition"},{"blueprintId":"spell.component.core.actor","config":{"actions":{"accelerate":{"executing":false},"steerLeft":{"executing":false},"steerRight":{"executing":false}}}},{"blueprintId":"spellReferenceProject.component.spacecraft"}]}],"systemBlueprints":[{"type":"systemBlueprint","namespace":"spell.system","name":"keyInput","input":[{"name":"inputDefinitionEntities","components":["spell.component.core.inputDefinition"]},{"name":"actorEntities","components":["spell.component.core.actor"]}],"scriptId":"spell/system/keyInput"},{"type":"systemBlueprint","namespace":"spellReferenceProject.system","name":"spacecraftIntegrator","input":[{"name":"spacecraftEntities","components":["spell.component.core.position","spell.component.core.rotation","spell.component.core.actor","spellReferenceProject.component.spacecraft"]}],"scriptId":"spellReferenceProject/system/spacecraftIntegrator"},{"type":"systemBlueprint","namespace":"spell.system","name":"render","input":[{"name":"entities","components":["spell.component.core.position","spell.component.core.graphics2d.appearance","spell.component.core.graphics2d.renderData"]}],"scriptId":"spell/system/render"}]}
	}
)

define(
	'spell/system/keyInput',
	[
		'spell/shared/util/input/keyCodes',

		'spell/shared/util/platform/underscore'
	],
	function(
		keyCodes,

		_
	) {
		'use strict'


		/**
		 * private
		 */

		var actorComponentId           = 'spell.component.core.actor',
			inputDefinitionComponentId = 'spell.component.core.inputDefinition'

		var init = function( globals ) {
			this.inputManager.init()
		}

		var cleanUp = function( globals ) {}

		var processEvent = function( inputDefinitionEntities, actorEntities ) {
			var inputEvent = this

			_.each(
				inputDefinitionEntities,
				function( definition ) {
					var inputDefinition = definition[ inputDefinitionComponentId ]

					var actionId = _.find(
						inputDefinition.keyToAction,
						function( action, key ) {
							return keyCodes[ key ] === inputEvent.keyCode
						}
					)

					if( !actionId ) return


					var isExecuting = ( inputEvent.type === 'keydown' )

					_.each(
						actorEntities,
						function( actorEntity ) {
							var actor = actorEntity[ actorComponentId ],
								action = actor.actions[ actionId ]

							if( !action ||
								action.executing === isExecuting || // only changes in action state are interesting
								actor.id !== inputDefinition.actorId ) {

								return
							}

							action.executing = isExecuting
						}
					)
				}
			)
		}

		/**
		 * Update the actor entities action component with the player input
		 *
		 * @param globals
		 * @param timeInMs
		 * @param deltaTimeInMs
		 */
		var process = function( globals, timeInMs, deltaTimeInMs ) {
			_.invoke( this.inputEvents, processEvent, this.inputDefinitionEntities, this.actorEntities )

			this.inputEvents.length = 0
		}


		/**
		 * public
		 */

		var KeyInput = function( globals, inputDefinitionEntities, actorEntities ) {
			this.inputEvents  = globals.inputEvents
			this.inputManager = globals.inputManager
			this.actorEntities = actorEntities
			this.inputDefinitionEntities = inputDefinitionEntities
		}

		KeyInput.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return KeyInput
	}
)

define(
	'spellReferenceProject/system/spacecraftIntegrator',
	[
		'glmatrix/vec2',

		'spell/shared/util/platform/underscore'
	],
	function(
		vec2,

		_
	) {
		'use strict'


		/**
		 * private
		 */

		var positionComponentId   = 'spell.component.core.position',
			rotationComponentId   = 'spell.component.core.rotation',
			actorComponentId      = 'spell.component.core.actor',
			spacecraftComponentId = 'spellReferenceProject.component.spacecraft',
			rotationSpeed         = 1.75,
			tmp                   = vec2.create()



		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updateSpacecraft = function( deltaTimeInMs ) {
			var spacecraftEntity    = this,
				deltaTimeInS        = deltaTimeInMs / 1000,
				positionComponent   = spacecraftEntity[ positionComponentId ],
				actions             = spacecraftEntity[ actorComponentId ].actions,
				spacecraftComponent = spacecraftEntity[ spacecraftComponentId ]


			var rotationDirection = ( actions.steerLeft.executing ?
				-1 :
				actions.steerRight.executing ?
					1 :
					0
			)

			if( rotationDirection ) {
				spacecraftEntity[ rotationComponentId ] += deltaTimeInMs / 1000 * rotationSpeed * rotationDirection
			}

			var deltaSpeed = vec2.create()

			if( actions.accelerate.executing ) {
				var rotation = spacecraftEntity[ rotationComponentId ]

				// f, tmp := thrustVector
				vec2.set(
					[
						Math.sin( rotation ) * spacecraftComponent.thrusterForce,
						Math.cos( rotation ) * spacecraftComponent.thrusterForce
					],
					tmp
				)

				// da, tmp := deltaAcceleration
				vec2.multiplyScalar( tmp, 1 / spacecraftComponent.mass )

				// dv, tmp := deltaSpeed
				vec2.multiplyScalar( tmp, deltaTimeInS )
				vec2.add( spacecraftComponent.speed, tmp )
			}

			// ds, tmp := deltaPosition
			vec2.multiplyScalar( spacecraftComponent.speed, deltaTimeInS, tmp )

			vec2.add( positionComponent, tmp )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			_.invoke( this.spacecraftEntities, updateSpacecraft, deltaTimeInMs )
		}


		/**
		 * public
		 */

		var SpacecraftIntegrator = function( globals, spacecraftEntities ) {
			this.spacecraftEntities = spacecraftEntities
		}

		SpacecraftIntegrator.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return SpacecraftIntegrator
	}
)

define(
	'glmatrix/vec2',
	[
		'spell/shared/util/platform/Types'
	],
	function(
		Types
	) {
		'use strict'


		var vec2 = {}

		/**
		 * Creates a new instance of a vec2 using the default array type
		 * Any javascript array-like objects containing at least 2 numeric elements can serve as a vec2
		 *
		 * @param {vec2} [vec] vec2 containing values to initialize with
		 *
		 * @returns {vec2} New vec2
		 */
		vec2.create = function( vec ) {
			var dest = Types.createNativeFloatArray( 2 )

			if( vec ) {
				dest[ 0 ] = vec[ 0 ]
				dest[ 1 ] = vec[ 1 ]

			} else {
				dest[ 0 ] = dest[ 1 ] = 0
			}

			return dest
		}

		/**
		 * Performs a vector multiplication
		 *
		 * @param {vec2} vec First operand
		 * @param {vec2} vec2 Second operand
		 * @param {vec2} [dest] vec2 receiving operation result. If not specified result is written to vec
		 *
		 * @returns {vec2} dest if specified, vec otherwise
		 */
		vec2.multiply = function( vec, vec2, dest ) {
			if( !dest || vec === dest ) {
				vec[ 0 ] *= vec2[ 0 ]
				vec[ 1 ] *= vec2[ 1 ]
				return vec
			}

			dest[ 0 ] = vec[ 0 ] * vec2[ 0 ]
			dest[ 1 ] = vec[ 1 ] * vec2[ 1 ]
			return dest
		}

		/**
		 * Performs a vector multiplication
		 *
		 * @param {vec2} vec First operand
		 * @param {float} s Second operand
		 * @param {vec2} [dest] vec2 receiving operation result. If not specified result is written to vec
		 *
		 * @returns {vec2} dest if specified, vec otherwise
		 */
		vec2.multiplyScalar = function( vec, s, dest ) {
			if( !dest || vec === dest ) {
				vec[ 0 ] *= s
				vec[ 1 ] *= s
				return vec
			}

			dest[ 0 ] = vec[ 0 ] * s
			dest[ 1 ] = vec[ 1 ] * s
			return dest
		}

		/**
		 * Performs a vector addition
		 *
		 * @param {vec2} vec First operand
		 * @param {vec2} vec2 Second operand
		 * @param {vec2} [dest] vec2 receiving operation result. If not specified result is written to vec
		 *
		 * @returns {vec2} dest if specified, vec otherwise
		 */
		vec2.add = function( vec, vec2, dest ) {
			if( !dest || vec === dest ) {
				vec[ 0 ] += vec2 [0 ]
				vec[ 1 ] += vec2[ 1 ]
				return vec
			}

			dest[ 0 ] = vec[ 0 ] + vec2[ 0 ]
			dest[ 1 ] = vec[ 1 ] + vec2[ 1 ]
			return dest
		}

		/**
		 * Copies the values of one vec3 to another
		 *
		 * @param {vec2} vec vec2/vec3 containing values to copy
		 * @param {vec2} dest vec2 receiving copied values
		 *
		 * @returns {vec2} dest
		 */
		vec2.set = function( vec, dest ) {
			dest[ 0 ] = vec[ 0 ]
			dest[ 1 ] = vec[ 1 ]

			return dest
		}

		return vec2
	}
)

define(
	'spell/system/render',
	[
		'funkysnakes/shared/config/constants',
		'spell/shared/util/Events',

		'glmatrix/vec2',
		'glmatrix/vec3',
		'glmatrix/mat4',

		'spell/shared/util/platform/underscore'
	],
	function(
		constants,
		Events,

		vec2,
		vec3,
		mat4,

		_
	) {
		'use strict'


		/**
		 * private
		 */

		var scale       = vec3.create(),
			translation = vec3.create(),
			opacity     = 1.0

		var appearanceComponentId = 'spell.component.core.graphics2d.appearance',
			renderDataComponentId = 'spell.component.core.graphics2d.renderData',
			positionComponentId   = 'spell.component.core.position',
			rotationComponentId   = 'spell.component.core.rotation'


		var createEntitiesSortedByPath = function( entitiesByPass ) {
			var passA,
				passB

			return _.toArray( entitiesByPass ).sort(
				function( a, b ) {
					passA = a[ renderDataComponentId ].pass
					passB = b[ renderDataComponentId ].pass

					return ( passA < passB ? -1 : ( passA > passB ? 1 : 0 ) )
				}
			)
		}

		var createWorldToViewMatrix = function( matrix, aspectRatio ) {
			// world space to view space matrix
			var cameraWidth  = 1024,
				cameraHeight = 768

			mat4.ortho(
				0,
				cameraWidth,
				0,
				cameraHeight,
				0,
				1000,
				matrix
			)

			mat4.translate( matrix, [ 0, 0, 0 ] ) // camera is located at (0/0/0); WATCH OUT: apply inverse translation
		}

		var draw = function( context, textures, entities ) {
			_.each(
				entities,
				function( entity ) {
					var entityAppearance  = entity[ appearanceComponentId ],
						entityRenderData  = entity[ renderDataComponentId ]

					context.save()
					{
						var texture = textures[ entityAppearance.textureId ]

						if( !texture ) throw 'The texture id \'' + entityAppearance.textureId + '\' could not be resolved.'


						opacity = entityAppearance.opacity * entityRenderData.opacity

						if( opacity !== 1.0 ) {
							context.setGlobalAlpha( opacity )
						}

						// object to world space transformation go here
						vec2.add( entity[ positionComponentId ], entityRenderData.translation, translation )
						vec2.set( entityRenderData.scale, scale )

						context.rotate( entityRenderData.rotation )
						context.translate( translation )
						context.scale( scale )

						// appearance transformations go here
						vec2.set( entityAppearance.translation, translation )
						vec2.multiply( entityAppearance.scale, [ texture.width, texture.height ], scale )

						context.rotate( entityAppearance.rotation + entity[ rotationComponentId ] )
						context.translate( translation )
						context.scale( scale )

						context.drawTexture( texture, -0.5, -0.5, 1, 1 )
					}
					context.restore()
				}
			)

//			// draw origins
//			context.setFillStyleColor( [ 1.0, 0.0, 1.0 ] )
//
//			_.each(
//				entities,
//				function( entity ) {
//					var entityRenderData = entity.renderData
//
//					context.save()
//					{
//						// object to world space transformation go here
//						context.translate( entityRenderData.position )
//						context.rotate( entityRenderData.orientation )
//
//						context.fillRect( -2, -2, 4, 4 )
//					}
//					context.restore()
//				}
//			)
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			var context = this.context

			// clear color buffer
			context.clear()

			draw( context, this.textures, createEntitiesSortedByPath( this.entities ) )
		}

		var init = function( globals ) {}

		var cleanUp = function( globals ) {}


		/**
		 * public
		 */

		var Renderer = function( globals, entities ) {
			this.textures = globals.resources
			this.context  = globals.renderingContext
			this.entities = entities

			var eventManager = globals.eventManager,
				context = this.context

			// setting up the view space matrix
			this.worldToView = mat4.create()
			mat4.identity( this.worldToView )
			createWorldToViewMatrix( this.worldToView, 4 / 3 )
			context.setViewMatrix( this.worldToView )

			// setting up the viewport
			var viewportPositionX = 0,
				viewportPositionY = 0

			context.viewport( viewportPositionX, viewportPositionY, constants.maxWidth, constants.maxHeight )

			eventManager.subscribe(
				Events.SCREEN_RESIZED,
				_.bind(
					function( screenWidth, screenHeight ) {
						context.resizeColorBuffer( screenWidth, screenHeight )
						context.viewport( viewportPositionX, viewportPositionY, screenWidth, screenHeight )
					},
					this
				)
			)
		}

		Renderer.prototype = {
			cleanup : cleanUp,
			init : init,
			process : process
		}

		return Renderer
	}
)

define(
	'spell/zone/default',
	[
		'spell/shared/util/Events',

		'spell/shared/util/platform/underscore'
	],
	function(
		Events,

		_
	) {
		'use strict'


		/**
		 * public
		 */

		return {
			cleanup : {},
			init : function( globals, zoneEntityManager, zoneConfig ) {
				var eventManager     = globals.eventManager,
					resourceLoader   = globals.resourceLoader,
					resourceBundleId = zoneConfig.name

				if( _.size( zoneConfig.resources ) === 0 ) {
					zoneEntityManager.createEntities( zoneConfig.entities )

				} else {
					eventManager.subscribe(
						[ Events.RESOURCE_LOADING_COMPLETED, resourceBundleId ],
						function() {
							zoneEntityManager.createEntities( zoneConfig.entities )
						}
					)

					// trigger loading of zone resources
					resourceLoader.addResourceBundle( resourceBundleId, zoneConfig.resources )
					resourceLoader.start()
				}
			}
		}
	}
)
