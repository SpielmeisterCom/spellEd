define(
	'spell/editor/createRuntimeModule',
	[
		'spell/editor/converter/project'
	],
	function(
		projectConverter
	) {
		'use strict'

		/**
		 * Creates a runtime module out of a project in editor format.
		 */
		return function( project ) {
			return projectConverter.toEngineFormat( project.getProxy().getWriter().getRecordData( project ) )
		}
	}
)
