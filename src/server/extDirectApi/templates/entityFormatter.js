define(
	'server/extDirectApi/templates/entityFormatter',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * Transforms the supplied entity config from the editor format to the spell engine format.
		 *
		 * @param entity
		 * @param includeEmptyComponents
		 * @return {*}
		 */
		var toEngineFormat = function( entity, includeEmptyComponents ) {
			var entityResult = _.pick( entity, 'id', 'name' )

			if( _.has( entity, 'templateId' ) &&
				!!entity.templateId ) {

				entityResult.templateId = entity.templateId
			}

			entityResult.config = _.reduce(
				entity.getComponents,
				function( memo, component ) {
					if( !component.additional && ( !component.changed || _.size( component.config ) === 0 ) ) return memo

					memo[ component.templateId ] = component.config

					return memo
				},
				{}
			)

			entityResult.children = _.reduce(
				entity.getChildren,
				function( memo, entityChildren ) {
					var result = toEngineFormat( entityChildren, includeEmptyComponents )

					if( !_.has( result, "config" ) && !_.has( result, "children" ) && !includeEmptyComponents ) return memo

					return memo.concat( result )
				},
				[]
			)

			if( _.isEmpty( entityResult.config ) ) delete entityResult.config
			if( _.isEmpty( entityResult.children ) ) delete entityResult.children

			// delete templateId on anonymous entities
			if( _.isEmpty( entityResult.templateId ) ) delete entityResult.templateId

			return entityResult
		}

		/**
		 * Transforms the supplied entity config from the spell engine format to the editor format.
		 *
		 * @param entity
		 * @return {*}
		 */
		var toEditorFormat = function( entity ) {
			var result = _.pick( entity, 'id', 'name' )

			if( _.has( entity, 'templateId' ) &&
				!!entity.templateId ) {

				result.templateId = entity.templateId
			}

			result.components = _.reduce(
				entity.config,
				function( memo, componentConfig, componentTemplateId ) {
					return memo.concat( {
						templateId : componentTemplateId,
						config : componentConfig
					} )
				},
				[]
			)

			result.children = _.map(
				entity.children,
				function( entityChild ) {
					return toEditorFormat( entityChild )
				}
			)

			return result
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat,
		}
	}
)
