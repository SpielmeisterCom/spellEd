Ext.define('Spelled.view.asset.create.SoundFileField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.soundfilefield',

	width: '100%',

	layout: 'hbox',

	fireChangeEvent: function( fileField ) {
		this.fireEvent( 'soundchange', this, fileField )
	},

	initComponent: function() {
		var language = this.isContained.name

		Ext.applyIf(
			this,
			{
				items: [
					{ xtype: 'assetfilefield', hideLabel: true, flex: 1, vtype: 'audioFileUpload', name: language,
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
						text: 'toolbar', flex: 1, items: [
						{
							xtype: 'button',
							text: 'Play',
							handler: function() {
								var soundfilefield = this.up( 'soundfilefield' )

								soundfilefield.fireEvent(
									'play',
									soundfilefield,
									this.up( 'form').getForm().getRecord(),
									soundfilefield.extension
								)
							}
						}
					]
					}
				]
			}
		)

		this.callParent()
	}

});
