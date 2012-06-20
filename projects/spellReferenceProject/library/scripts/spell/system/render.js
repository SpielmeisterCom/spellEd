define(
	'spell/system/render',
	[
		'spell/shared/util/Events',

		'glmatrix/vec2',
		'glmatrix/vec3',
		'glmatrix/mat4',

		'spell/shared/util/platform/underscore'
	],
	function(
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

		var tmp             = vec3.create(),
			currentCameraId = undefined

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

		var createSortedByPass = function( renderDatas ) {
			return _.reduce(
				renderDatas,
				function( memo, renderData, id ) {
					return memo.concat( {
						id : id,
						value : renderData
					} )
				},
				[]
			).sort(
				function( a, b ) {
					var passA = a.value.pass
					var passB = b.value.pass

					return ( passA < passB ? -1 : ( passA > passB ? 1 : 0 ) )
				}
			)
		}

		var createAnimationOffset = function( deltaTimeInMs, animationOffset, animationSpeedFactor, numFrames, frameDuration, loop ) {
			var animationLengthInMs = numFrames * frameDuration,
				animationOffsetInMs = Math.floor( numFrames * frameDuration * animationOffset ) + deltaTimeInMs * animationSpeedFactor

			if( animationOffsetInMs > animationLengthInMs ) {
				if( !loop ) return 1.0

				animationOffsetInMs = animationOffsetInMs % animationLengthInMs
			}

			return animationOffsetInMs / animationLengthInMs
		}

		var draw = function( context, deltaTimeInMs, assets, resources, transforms, appearances, animatedAppearances, renderComponentSorted ) {
			_.each(
				renderComponentSorted,
				function( renderComponent ) {
					var id              = renderComponent.id,
						renderComponent = renderComponent.value,
						transform       = transforms[ id ]

					context.save()
					{
						var appearance        = appearances[ id ] || animatedAppearances[ id ],
							asset             = assets[ appearance.assetId ],
							texture           = resources[ asset.resourceId ],
							appearanceOpacity = appearance.opacity

						if( !texture ) throw 'The resource id \'' + asset.resourceId + '\' could not be resolved.'


						if( appearanceOpacity !== 1.0 ) {
							context.setGlobalAlpha( appearanceOpacity )
						}

						// object to world space transformation go here
						vec2.set( transform.position, tmp )
						context.translate( tmp )

						context.rotate( transform.rotation )

						if( asset.type === 'appearance' ) {
							vec2.multiply( transform.scale, [ texture.width, texture.height ], tmp )
							context.scale( tmp )

							context.drawTexture( texture, -0.5, -0.5, 1, 1 )

						} else {
							var animation   = asset.animations[ appearance.animationId ],
								frameWidth  = asset.frameWidth,
								frameHeight = asset.frameHeight

							vec2.multiply( transform.scale, [ frameWidth, frameHeight ], tmp )
							context.scale( tmp )

							appearance.animationOffset = createAnimationOffset(
								deltaTimeInMs,
								appearance.animationOffset,
								appearance.animationSpeedFactor,
								animation.numFrames,
								animation.frameDuration,
								animation.loop
							)

							var frameId = Math.floor( appearance.animationOffset * ( animation.numFrames - 1 ) ),
								sourceOffset = animation.offsets[ frameId ]

							context.drawSubTexture( texture, sourceOffset[ 0 ], sourceOffset[ 1 ], frameWidth, frameHeight, -0.5, -0.5, 1, 1 )
						}
					}
					context.restore()
				}
			)
		}

		var setCamera = function( context, cameras, transforms, worldToView ) {
			if( _.size( cameras ) === 0 ) return

			// Gets the first active camera. More than one camera being active is an undefined state and the first found active is used.
			var activeCameraId = undefined

			var activeCamera = _.find(
				cameras,
				function( camera, id ) {
					if( camera.active ) {
						activeCameraId = id

						return true
					}

					return false
				}
			)

			if( currentCameraId === activeCameraId ) return

			currentCameraId = activeCameraId

			// setting up the camera geometry
			var halfWidth  = activeCamera.width / 2,
				halfHeight = activeCamera.height / 2

			mat4.ortho( -halfWidth, halfWidth, -halfHeight, halfHeight, 0, 100, worldToView )

			// translating with the inverse camera position
			vec2.set( transforms[ currentCameraId ].position, tmp )
			mat4.translate( worldToView, vec2.negate( tmp ) )

			context.setViewMatrix( worldToView )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			var context = this.context

			// clear color buffer
			context.clear()

			setCamera( context, this.cameras, this.transforms, this.worldToView )

			// TODO: renderComponents should be presorted on the component list level by a user defined index, not here on every rendering tick
			draw(
				context,
				deltaTimeInMs,
				this.assets,
				this.resources,
				this.transforms,
				this.appearances,
				this.animatedAppearances,
				createSortedByPass( this.renderComponents )
			)
		}

		var init = function( globals ) {}

		var cleanUp = function( globals ) {}


		/**
		 * public
		 */

		var Renderer = function( globals, transforms, appearances, animatedAppearances, renderComponents, cameras ) {
			this.assets              = globals.assets
			this.resources           = globals.resources
			this.context             = globals.renderingContext
			this.transforms          = transforms
			this.appearances         = appearances
			this.animatedAppearances = animatedAppearances
			this.renderComponents    = renderComponents
			this.cameras             = cameras

			var eventManager = globals.eventManager,
				context = this.context

			// setting up the view space matrix
			this.worldToView = mat4.create()
			mat4.identity( this.worldToView )
			createWorldToViewMatrix( this.worldToView, 4 / 3 )
			context.setViewMatrix( this.worldToView )

			// setting up the viewport
			var viewportPositionX = 0,
				viewportPositionY = 0,
				maxWidth = 1024,
				maxHeight = 768

			context.viewport( viewportPositionX, viewportPositionY, maxWidth, maxHeight )

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
