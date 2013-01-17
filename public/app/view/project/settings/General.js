Ext.define('Spelled.view.project.settings.General' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectgeneralsettings',

    title : 'General',

	initComponent: function() {

		Ext.applyIf( this, {
			items: [
				{
					xtype: 'displayfield',
					name: 'name',
					fieldLabel: 'Name',
					anchor: '100%',
					allowBlank: false,
					vtype: 'alphanum'
				},
				{
					xtype: 'fieldcontainer',
					fieldLabel: "Screen size",
					layout: 'hbox',
					defaults: {
						flex: 1,
						hideLabel: true
					},
					items: [
						{
							xtype     : 'numberfield',
							name      : 'screenSizeX',
							margin    : '0 5 0 0',
							allowBlank: false
						},{
							xtype :'displayfield',
							value : 'x',
							margin: '5 5 0 0'
						},
						{
							xtype     : 'numberfield',
							name      : 'screenSizeY',
							allowBlank: false
						}
					]
				},
				{
					xtype: 'numberfield',
					name: 'quadTreeSize',
					fieldLabel: 'Quad tree size',
					anchor: '100%',
					allowBlank: false
				}
			]
		})

		this.callParent( arguments )
	},

	addLanguageHandler: function( combo, newValue, oldValue ) {
		this.fireEvent( 'addLanguage', this, combo.findRecordByValue( newValue ) )
	}
})