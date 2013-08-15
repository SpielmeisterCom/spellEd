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
				play: this.playSound
			}
        })
    },

	playSound: function( soundFileField, asset, extension ) {
		var projectName = this.application.getActiveProject().get( 'name'),
			filePath    = asset.getFilePath( projectName ),
			parts       = filePath.split('.')

		parts.pop()
		parts.push( extension )

		var audio = new Audio( parts.join('.') )

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

