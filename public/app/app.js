requirejs(
	[
		'requireToExt/inject',
		'spell/editor/createProjectInEngineFormat',
		'spell/editor/converter/asset',
		'spell/editor/converter/project',
		'spell/editor/converter/scene',
		'spell/editor/converter/script',
		'spell/editor/converter/component',
		'spell/editor/converter/system',
		'spell/editor/converter/entity',
		'spell/editor/converter/entityTemplate',
		'spell/editor/createCacheContent',
		'spell/editor/createFontGenerator',
		'spell/editor/systemFontDetector',

		'underscore'
	],
	function(
		injectModulesIntoExt,

		createProjectInEngineFormat,
		assetConverter,
		projectConverter,
		sceneConverter,
		scriptConverter,
		componentConverter,
		systemConverter,
		entityConverter,
		entityTemplateConverter,
		createCacheContent,
		createFontGenerator,
		systemFontDetector,

		_
	) {


		injectModulesIntoExt( {
			'assetConverter'              : assetConverter,
			'createProjectInEngineFormat' : createProjectInEngineFormat,
			'createCacheContent'          : createCacheContent,
			'createFontGenerator'         : createFontGenerator,
			'componentConverter'          : componentConverter,
			'sceneConverter'              : sceneConverter,
			'scriptConverter'             : scriptConverter,
			'systemConverter'             : systemConverter,
			'entityConverter'             : entityConverter,
			'entityTemplateConverter'     : entityTemplateConverter,
			'projectConverter'            : projectConverter,
			'systemFontDetector'          : systemFontDetector,
			'underscore'                  : _
		} )



		startApplication();
	}
)

var startApplication = function() {
	Ext.application('Spelled.Application');
};
