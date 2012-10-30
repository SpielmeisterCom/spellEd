define(
	'spell/editor/createProjectInEngineFormat',
	[
		'spell/editor/converter/project'
	],
	function(
		projectConverter
	) {
		'use strict'

		return function( project ) {
			return projectConverter.toEngineFormat(
				project.getProxy().getWriter().getRecordData( project ),
				{
					includeEntityIds : true
				}
			)
		}
	}
)
