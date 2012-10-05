define(
	'spell/editor/converter/entity',
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
		 * @param {Object} entity
		 * @param {Object} config
		 * @return {*}
		 */
		var toEngineFormat = function( entity, config ) {
			var includeEntityIds = config && !!config.includeEntityIds,
				attributeNames   = [ 'name' ]

			if( includeEntityIds ) attributeNames.push( 'id' )

			var entityResult = _.pick( entity, attributeNames )

			if( _.has( entity, 'templateId' ) &&
				!!entity.templateId ) {

				entityResult.entityTemplateId = entity.templateId
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
					var result = toEngineFormat( entityChildren, config )

					if( !includeEntityIds && !_.has( result, "config" ) && !_.has( result, "children" ) ) return memo

					return memo.concat( result )
				},
				[]
			)

			if( _.isEmpty( entityResult.config ) ) delete entityResult.config
			if( _.isEmpty( entityResult.children ) ) delete entityResult.children

			// delete templateId on anonymous entities
			if( _.isEmpty( entityResult.entityTemplateId ) ) delete entityResult.entityTemplateId

			return entityResult
		}

		/**
		 * Transforms the supplied entity config from the spell engine format to the editor format.
		 *
		 * @param entity
		 * @return {*}
		 */
		var toEditorFormat = function( entity ) {
			var result = _.pick( entity, 'name' )

			if( _.has( entity, 'entityTemplateId' ) &&
				!!entity.entityTemplateId ) {

				result.templateId = entity.entityTemplateId
			}

			result.components = _.reduce(
				entity.config,
				function( memo, componentConfig, componentId ) {
					return memo.concat( {
						templateId : componentId,
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
			toEditorFormat : toEditorFormat
		}
	}
)
