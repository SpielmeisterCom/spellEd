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
			var projectInEngineFormat = projectConverter.toEngineFormat( project.getProxy().getWriter().getRecordData( project ) )

			// WORKAROUND: The list of templates and assets is included statically. The editor should actually keep these updated. Until this is implemented
			// this workaround is necessary for the implementation of the development mode.

			projectInEngineFormat.templateIds = [
				'spell.component.2d.graphics.animatedAppearance',
				'spell.component.2d.graphics.appearance',
				'spell.component.2d.graphics.camera',
				'spell.component.2d.physics.inertialObject',
				'spell.component.2d.transform',
				'spell.component.actor',
				'spell.component.entityComposite.children',
				'spell.component.entityComposite.root',
				'spell.component.inputDefinition',
				'spell.component.physics.collisionSphere',
				'spell.component.visualObject',
				'spell.entity.2d.graphics.camera',
				'spell.entity.inputDefinition',
				'spell.system.keyInput',
				'spell.system.render',
				'spellReferenceProject.component.spacecraft',
				'spellReferenceProject.entity.alienSpacecraft',
				'spellReferenceProject.entity.asteroid',
				'spellReferenceProject.entity.spacecraft',
				'spellReferenceProject.system.aiControl',
				'spellReferenceProject.system.collisionDetector',
				'spellReferenceProject.system.endlessPlayingField',
				'spellReferenceProject.system.spacecraftIntegrator'
			]

			projectInEngineFormat.assetIds = [
				'spell.defaultAppearance',
				'spellReferenceProject.asteroid1',
				'spellReferenceProject.asteroid2',
				'spellReferenceProject.pixelShip1',
				'spellReferenceProject.pixelShip2',
				'spellReferenceProject.shield',
				'spellReferenceProject.spelljsLogo',
				'spellReferenceProject.threeRingsAnimation',
				'spellReferenceProject.threeRingsSpriteSheet'
			]

			return projectInEngineFormat
		}
	}
)
