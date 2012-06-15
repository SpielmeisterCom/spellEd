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
			init : function( globals, entityManager, zoneConfig ) {
				var eventManager     = globals.eventManager,
					resourceLoader   = globals.resourceLoader,
					resourceBundleId = zoneConfig.name

				if( _.size( zoneConfig.resources ) === 0 ) {
					entityManager.createEntities( zoneConfig.entities )

				} else {
					eventManager.subscribe(
						[ Events.RESOURCE_LOADING_COMPLETED, resourceBundleId ],
						function() {
							entityManager.createEntities( zoneConfig.entities )
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
