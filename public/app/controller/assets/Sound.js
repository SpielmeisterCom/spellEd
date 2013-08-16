Ext.define('Spelled.controller.assets.Sound', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.store.asset.Sounds',
		'Spelled.model.assets.Sound',
		'Spelled.view.asset.create.Sound'
	],

    views: [
		'asset.create.Sound'
    ],

    stores: [
        'asset.Sounds'
    ],

    models: [
		'assets.Sound'
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

    init: function() {
        this.control({
			'soundfilefield': {
				soundchange: this.updateInfoField,
				play: this.playSound,
				stop: this.stopSound
			}
        })
    },

	stopSound: function( soundFileField, asset, extension, language ) {
		var audio = soundFileField.audio

		if( audio ) audio.pause()
	},

	playSound: function( soundFileField, asset, extension, language ) {
		var projectName = this.application.getActiveProject().get( 'name'),
			src         = asset.getFilePath( projectName )

		if( language != 'default' ) {
			src = Spelled.Converter.getLocalizedFilePath( src, language )
		}

		var parts = src.split('.')

		parts.pop()
		parts.push( extension )

		if( soundFileField.audio ) soundFileField.audio.pause()

		var audio = new Audio( parts.join('.') )
		soundFileField.audio = audio

		audio.play()
	},

	updateInfoField: function( view, fileField ) {
		var localizationContainer = view.up( 'localizedfilefield' ),
			oggFileField          = localizationContainer.down( 'soundfilefield[extension="ogg"]' ).down( 'assetfilefield' ),
			mp3FileField          = localizationContainer.down( 'soundfilefield[extension="mp3"]' ).down( 'assetfilefield' ),
			infoText              = localizationContainer.down( 'text' ),
			hasMp3File            = !Ext.isEmpty( mp3FileField.getValue() ),
			hasOggFile            = !Ext.isEmpty( oggFileField.getValue() )

		if( hasMp3File && hasOggFile ) {
			infoText.setText( 'Mp3 and Ogg inserted manually' )

		} else if( hasMp3File ) {
			infoText.setText( 'Automatically Generating ogg file from mp3' )

		} else if( hasOggFile ) {
			infoText.setText( 'Automatically Generating mp3 file from ogg' )
		}
	}

})

