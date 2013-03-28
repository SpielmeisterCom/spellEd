Ext.define('Spelled.controller.assets.Translations', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.store.asset.Translations',
		'Spelled.model.assets.Translation',
		'Spelled.model.Language',
		'Spelled.store.Languages',
		'Spelled.view.asset.create.Translation'
	],

    views: [
		'asset.create.Translation'
    ],

    stores: [
        'asset.Translations',
		'Languages'
    ],

    models: [
		'assets.Translation'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'AssetEditor',
			selector: '#SceneEditor'
		},
		{
			ref : 'Navigator',
			selector: '#LibraryTree'
		}
    ],

	messageBus: {},

    init: function() {
        this.control({
			'translationasset': {
				edit: this.editTranslation,
				languageChange: this.filterLanguage,
				addNewTranslation: this.addItem
			}
        })

		this.application.on({
			scope: this,
			addedLanguage: this.createLanguageTokens,
			removedLanguage: this.removeLanguageTokens
		})
    },

	createLanguageTokens: function( language ) {
		var store           = this.getAssetTranslationsStore(),
			languageKey     = language.getId(),
			defaultLanguage = this.application.getActiveProject().getDefaultLanguageKey()

		store.each(
			function( asset ) {
				var translations = asset.getTranslationStore(),
					keys         = translations.query( 'language', defaultLanguage )

				keys.each(
					function( translation ) {
						var key = translation.get( 'key' )

						translations.add( { key: key, language: languageKey, translation: '' } )
					}
				)

				asset.updateTranslation()
			}
		)
	},

	removeLanguageTokens: function( language ) {
		var store = this.getAssetTranslationsStore()

		store.each(
			function( asset ) {
				var translations = asset.getTranslationStore(),
					keys         = translations.query( 'language', language.getId() )

				translations.remove( keys )

				asset.updateTranslation()
			}
		)
	},

	editTranslation: function( view, asset, field, value, originalValue ) {
		var store    = asset.getTranslationStore(),
			language = view.getSelectedLanguage()

		if( field === 'key' && originalValue ) {
			var translations = store.query( 'key', originalValue )

			if( translations )
				translations.each( function( record ) { record.set( field, value ) } )
		}

		store.clearFilter( true )
		asset.updateTranslation()
		this.filterLanguage( view, language )
	},

	addItem: function( view, language ) {
		var grid  = view.down( 'grid'),
			store = grid.getStore(),
			edit  = grid.getPlugin('cellplugin')

		store.insert( 0, { 'language': language } )

		edit.startEditByPosition({
			row: 0,
			column: 0
		})
	},

	filterLanguage: function( view, language ) {
		if( !language ) return

		var grid  = view.down( 'grid'),
			store = grid.getStore()

		store.clearFilter()
		store.filter( 'language', language )
	}
})
