Ext.define('Spelled.view.project.settings.Language' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectlanguagesettings',

    title : 'Languages',

	initComponent: function() {

		Ext.applyIf( this, {
				items: [
					{
						xtype: 'combo',
						name: 'defaultLanguage',
						fieldLabel: 'Select default language',
						queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						forceSelection: true,
						typeAhead: true
					},
					{
						xtype: 'grid',
						tbar: [ {
								text: "Add",
								icon: 'images/icons/add.png',
								scope: this,
								handler: this.addHandler
							}
						],
						name: 'supportedLanguages',
						columns: {
							items: [
								{
									text: "Supported languages",
									dataIndex: "name"
								}
							],
							defaults: {
								flex: 1
							}
						}
					}
				]
			}
		)

		this.callParent( arguments )
	},

	addHandler: function() {
		this.fireEvent( 'showAddLanguage', this )
	}
})