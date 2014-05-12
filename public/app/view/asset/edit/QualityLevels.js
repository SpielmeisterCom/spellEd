Ext.define('Spelled.view.asset.edit.QualityLevels', {
    extend: 'Ext.container.Container',
    alias: 'widget.qualitylevels',

	fileFields: false,

	generateQualityFileField: function( qualityLevels ) {
		qualityLevels.each(
			function( qualityLevel, value ){
				this.createLanguageTab( qualityLevel, value )
			},
			this
		)
	},

	createLanguageTabs: function( localized, qualityLevels ) {
		var me             = this,
			tabPanel       = this.down( 'tabpanel' ),
			languagesCount = Ext.isObject( qualityLevels ) ? Ext.Object.getKeys( qualityLevels ).length : 0

		tabPanel.removeAll()

		if( localized && languagesCount == 0 ) {
			tabPanel.add( { title: 'Error', html: 'Missing qualityLevels configuration. Check your project settings.' } )

		} else if( localized ) {
			me.generateQualityFileField( qualityLevels )

		} else {
			me.createLanguageTab( 'Default', 'default' )
		}

		if( tabPanel.up( 'form' ).getRecord() ) tabPanel.setActiveTab( 0 )
	},

	createLanguageTab: function( name, id ) {
		var panel     = this.down( 'tabpanel' ),
			fileField = { xtype: 'assetfilefield', name: id	},
			items     = []

		if( this.fileFields && Ext.isArray( this.fileFields ) ) {
			Ext.each(
				this.fileFields,
				function( item ) {
					item.name = id
					items.push( item )
				}
			)
		} else {
			items = [
				fileField,
				{ height: 5000, xtype: 'assetiframe', workspacePrefix: false }
			]
		}

		return panel.add({
			title: name,
			items: items
		})
	},

	fireChangeEvent: function( checkbox, newValue, oldValue ) {
		var cmp   = this.up( 'form' ),
			asset = cmp.getRecord()

		if( asset ) asset.set( 'qualityLevels', newValue )

		this.fireEvent( 'qualitylevelschange', cmp, newValue )
	},

	updatePreview: function( tabPanel, newCard ) {
		var form   = tabPanel.up( 'form' ),
			asset  = form.getRecord(),
			iframe = newCard.down( 'assetiframe'),
			field  = newCard.down( 'assetfilefield')

		if( field && asset && iframe ) this.fireEvent( 'updatepreview', iframe, asset, field.getName() )
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'checkbox',
					fieldLabel: 'Quality Levels',
					name: 'qualityLevel',
					listeners: {
						change: Ext.bind( me.fireChangeEvent, me )
					}
				},
				{
					xtype: 'tabpanel',
					listeners: {
						tabchange: Ext.bind( me.updatePreview, me ),
						afterrender: function() {
							this.setActiveTab( 0 )
						}
					}
				}
			]
		})

		this.callParent( arguments )
	}
})
