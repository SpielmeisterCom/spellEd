Ext.define('Spelled.view.asset.create.LocalizedFileField', {
    extend: 'Ext.container.Container',
    alias: 'widget.localizedfilefield',

	fileFields: false,

	generateLanguageFileField: function( languages ) {
		var tabPanel = this.down( 'tabpanel' )

		languages.each(
			function( language ){
				this.createAssetFileFieldTab( tabPanel, language.get( 'name' ), language.get( 'id' ) )
			},
			this
		)
	},

	createQualityTabs: function( hasQualityLevel, qualityLevels ) {
		var me       = this,
			tabPanel = this.down( 'tabpanel' )

		tabPanel.items.each(
			function( tab ) {
				tab.removeAll()

				if( hasQualityLevel ) {

					var qualityTabPanel = tab.add(
						{
							xtype: 'tabpanel',
							name: 'qualityLevels',
							listeners: {
								tabchange: Ext.bind( me.updatePreview, me ),
								afterrender: function() {
									this.setActiveTab( 0 )
								}
							}
						}
					)

					qualityLevels.each(
						function( qualityLevel ) {
							this.createAssetFileFieldTab( qualityTabPanel, qualityLevel.get( 'name' ), qualityLevel.get( 'name' ), [ tab.key, qualityLevel.get( 'level' ) ].join( '.' ) )
						},
						this
					)

					qualityTabPanel.setActiveTab( 0 )

				} else {
					this.fireEvent( 'localizechange', this.up( 'form' ), this.down( 'checkbox[name="localized"]').getValue() )
				}
			},
			this
		)
	},

	createLanguageTabs: function( localized, languages ) {
		var me             = this,
			tabPanel       = this.down( 'tabpanel' ),
			languagesCount = languages.getCount()

		tabPanel.removeAll()

		if( localized && languagesCount == 0 ) {
			tabPanel.add( { title: 'Error', html: 'Missing language configuration. Check your project settings.' } )

		} else if( localized ) {
			me.generateLanguageFileField( languages )

		} else {
			me.createAssetFileFieldTab( tabPanel, 'Default', 'default' )
		}

		if( tabPanel.up( 'form' ).getRecord() ) tabPanel.setActiveTab( 0 )
	},

	createAssetFileFieldTab: function( panel, name, id, assetFieldId ) {
		assetFieldId = ( assetFieldId ) ? assetFieldId : id

		var fileField = { xtype: 'assetfilefield', name: assetFieldId },
			items     = []

		if( this.fileFields && Ext.isArray( this.fileFields ) ) {
			Ext.each(
				this.fileFields,
				function( item ) {
					item.name = assetFieldId
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
			key: id,
			items: items
		})
	},

	fireChangeEvent: function( checkbox, newValue, oldValue, event, isQualityLevelChange ) {
		var cmp   = this.up( 'form' ),
			asset = cmp.getRecord()

		if( asset && !isQualityLevelChange ) asset.set( 'localized', newValue )
		if( asset && isQualityLevelChange ) asset.set( 'qualityLevels', newValue )

		if( isQualityLevelChange )  {
			this.fireEvent( 'qualitychange', cmp, newValue )
		} else {
			this.fireEvent( 'localizechange', cmp, newValue )
			this.fireEvent( 'qualitychange', cmp, cmp.down( 'checkbox[name="qualityLevels"]').getValue() )
		}
	},

	updatePreview: function( tabPanel, newCard ) {
		var form        = tabPanel.up( 'form' ),
			asset       = form.getRecord(),
			languageTab = form.down( 'tabpanel[name="localization"]').getActiveTab()

		if( !languageTab ) return

		var	language    = languageTab.key,
			qualityLevelTabPanel = languageTab.down( 'tabpanel[name="qualityLevels"]'),
			activeTab   = languageTab,
			qualityLevel

		if( qualityLevelTabPanel ) {
			activeTab = qualityLevelTabPanel.getActiveTab()
			qualityLevel = activeTab.key
		}

		var iframe = activeTab.down( 'assetiframe')

		if( asset && iframe ) this.fireEvent( 'updatepreview', iframe, asset, language, qualityLevel )
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'checkbox',
					fieldLabel: 'Localized',
					name: 'localized',
					listeners: {
						change: Ext.bind( me.fireChangeEvent, me, [false], true )
					}
				},
				{
					xtype: 'checkbox',
					fieldLabel: 'Quality Levels',
					name: 'qualityLevels',
					listeners: {
						change: Ext.bind( me.fireChangeEvent, me, [true], true )
					}
				},
				{
					xtype: 'tabpanel',
					name: 'localization',
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
