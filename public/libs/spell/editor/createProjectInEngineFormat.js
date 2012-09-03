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
			project.syncAssetIds()
			project.syncTemplateIds()

			return projectConverter.toEngineFormat(
				project.getProxy().getWriter().getRecordData( project ),
				{
					includeEntityIds : true
				}
			)
		}
	}
)
