Ext.define('Spelled.view.asset.create.Translation', {
    extend: 'Ext.container.Container',
    alias: 'widget.translationasset',

	initLanguage: 'en',
	projectLanguages: 'Languages',

	padding: 5,

	initComponent: function() {

		if( this.project ) {
			this.initLanguage     = this.project.getDefaultLanguageKey()
			this.projectLanguages =	Ext.create('Ext.data.Store', {
				fields: [ 'name', 'id'],
				data : this.project.getSupportedLanguages().data.items
			})
		}

		Ext.applyIf( this, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_translation",
					width: 'null'
				},
				{
					xtype: 'combo',
					name: 'language',
					fieldLabel: 'Select language',
					queryMode: 'local',
					displayField: 'name',
					editable: false,
					valueField: 'id',
					forceSelection: true,
					value: this.initLanguage,
					allowBlank: false,
					store: this.projectLanguages,
					listeners: {
						change: Ext.bind( this.changeLanguageHandler, this )
					}
				},
				{
					xtype: 'grid',
					tbar: [
						{
							icon: 'resources/images/icons/add.png',
							text: 'Add',
							scope: this,
							handler: this.onAddClick
						}
					],
					columns:[
						{
							text: 'Key',
							dataIndex: 'key',
							editor: {
								allowBlank: false
							}
						},
						{
							text: 'Translation',
							dataIndex: 'translation',
							flex: 1,
							editor: {
								allowBlank: false
							}
						}
					],
					listeners: {
						edit: Ext.bind( this.editHandler, this )
					},
					store: this.getAsset().getTranslationStore(),
					plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
						pluginId: 'cellplugin'
					}) ]
				}
			]
		})

		this.callParent( arguments )

		this.fireEvent( 'languageChange', this, this.initLanguage )
	},

	onAddClick: function() {
		this.fireEvent( 'addNewTranslation', this, this.getSelectedLanguage() )
	},

	changeLanguageHandler: function( combo, newValue, oldValue ) {
		this.fireEvent( 'languageChange', this, newValue )
	},

	getSelectedLanguage: function() {
		return this.down( 'combo[name="language"]' ).getValue()
	},

	getAsset: function() {
		return this.asset
	},

	editHandler: function( editor, e ) {
		this.fireEvent( 'edit', this, this.getAsset(), e.field, e.value, e.originalValue )
	}
})
