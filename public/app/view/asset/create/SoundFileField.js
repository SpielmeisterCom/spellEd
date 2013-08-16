Ext.define('Spelled.view.asset.create.SoundFileField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.soundfilefield',

	width: '100%',

	layout: 'hbox',

	fireChangeEvent: function( fileField ) {
		this.fireEvent( 'soundchange', this, fileField )
	},

	initComponent: function() {
		var language = this.isContained.name,
			me       = this

		Ext.applyIf(
			this,
			{
				items: [
					{ xtype: 'assetfilefield', hideLabel: true, flex: 2, vtype: 'audioFileUpload', name: language,
						validator: function( value ) {
							var extension = this.up( 'soundfilefield' ).extension,
								rgx       = new RegExp( "^.*\.(" + extension + ")$", "i" )

							if( rgx.test( value ) ) {
								var soundfilefield = this.up( 'soundfilefield' )
								soundfilefield.fireChangeEvent( soundfilefield )

								return true
							} else {
								return "This audio file must be in ."+extension+ " format."
							}
						}
					},
					{ xtype: 'splitter' },
					{
						hidden: !this.showToolbar,
						text: 'toolbar', items: [
						{
							xtype: 'button',
							text: 'Play',
							handler: function() {
								me.fireAudioEvent( "play" )
							}
						},
						{
							xtype: 'button',
							text: 'Stop',
							handler: function() {
								me.fireAudioEvent( "stop" )
							}
						}
					]
					}
				]
			}
		)

		this.callParent()
	},

	fireAudioEvent: function( name ) {
		var language = this.up( 'fieldset' ).name

		this.fireEvent(
			name,
			this,
			this.up( 'form').getForm().getRecord(),
			this.extension,
			language
		)
	}

});
