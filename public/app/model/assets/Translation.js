Ext.define('Spelled.model.assets.Translation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_translation',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'translation'
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
		{ name: 'subtype', type: 'string', defaultValue: 'translation' },
		{ name: 'config', type: 'object' }
	],

	createTranslationStore: function() {
		var config = this.get( 'config'),
			data   = [],
			each   = Ext.Object.each

		each(
			config,
			function( key, translations ) {
				each(
					translations,
					function( language, translation ) {
						data.push(
							{
								key: key,
								language: language,
								translation: translation
							}
						)
					}
				)
			}
		)

		this.translationStore = Ext.create( 'Ext.data.Store', {
			fields: [ 'key', 'translation', 'language' ],
			data: data
		})

		return this.translationStore
	},

	updateTranslation: function() {
		var store  = this.getTranslationStore(),
			config = {}

		store.each(
			function( record ) {
				var key         = record.get( 'key' ),
					language    = record.get( 'language' ) ,
					translation = record.get( 'translation' )

				config[ key ] = config[ key ] || {}
				config[ key ][ language ] = config[ key ][ language ] || {}
				config[ key ][ language ] = translation
			}
		)

		this.set( 'config', config )
	},

	getTranslationStore: function() {
		return ( this.translationStore ) ? this.translationStore : this.createTranslationStore()
	},

	save: function() {
		this.getTranslationStore().commitChanges()
		return this.callParent( arguments )
	}
})