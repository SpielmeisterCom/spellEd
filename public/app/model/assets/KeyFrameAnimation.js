Ext.define('Spelled.model.assets.KeyFrameAnimation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_key_frame_animation',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'keyFrameAnimation'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'keyFrameAnimation' },
		{ name: 'length', type: 'int' },
		{ name: 'animate', type: 'object' },
		{ name: 'assetId', type: 'string' }
	],

	getCalculatedDependencies: function() {
		var componentStore  = Ext.getStore( 'template.Components' ),
			cmpDependencies = [ 'spell.component.2d.transform', 'spell.component.visualObject' ],
			dependencies    = []

		Ext.Array.each(
			cmpDependencies,
			function( componentId ) {
				dependencies.push( componentId )

				var component = componentStore.getByTemplateId( componentId )
				Ext.Array.push( dependencies, component.getDependencies() )
			}
		)

		return Ext.Array.clean( dependencies )
	},

	getKeyFrameFromComponentAttribute: function( componentId, attributeName ) {
		var animate = this.get( 'animate')

		if( animate[ componentId ] && animate[ componentId ][ attributeName ] )
			return animate[ componentId ][ attributeName ].keyFrames
		else
			return []
	},

	setKeyFrames: function( config ) {
		var newConfig = {}

		Ext.Object.each(
			config,
			function( key, component ) {

				var tmpConfig = {}
				newConfig[ key ] = tmpConfig

				Ext.Object.each(
					component,
					function( key, attribute ) {
						if( attribute.tmpStore ) {
							var keyFrames = []
							tmpConfig[ key ] = {}
							tmpConfig[ key ].keyFrames = keyFrames
							attribute.tmpStore.each(
								function( item ) {
									var cloned        = Ext.clone( item.data ),
										value         = item.get( 'value'),
										interpolation = item.get('interpolation')

									cloned.value = Ext.decode( item.get( 'value'), true ) || item.get( 'value')
									if( !interpolation || Ext.Array.contains( [ "Linear" ], interpolation ) ) delete cloned.interpolation

									keyFrames.push( cloned )
								}
							)
						} else if( attribute.keyFrames ) {
							tmpConfig[ key ] = {}
							tmpConfig[ key ].keyFrames = attribute.keyFrames
						}

						if( Ext.isEmpty( tmpConfig[ key ].keyFrames ) ) delete tmpConfig[ key ]
					}
				)

				if( Ext.isEmpty( Ext.Object.getKeys( newConfig[ key ] ) ) ) delete newConfig[ key ]
			}
		)

		this.set( 'animate', newConfig )
	}
})