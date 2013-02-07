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
						hideLabel: true
					},
					items: [
						{
							xtype     : 'numberfield',
							name      : 'screenSizeX',
                            flex: 1,
							allowBlank: false
						},{
							xtype :'displayfield',
							value : 'x',
							margin: '5 5 0 5'
						},
						{
							xtype     : 'numberfield',
							name      : 'screenSizeY',
                            flex: 1,
							allowBlank: false
						}
					]
				},
				{
					xtype: 'numberfield',
					name: 'quadTreeSize',
					fieldLabel: 'Quad tree size',
					decimalPrecision: 0,
					minValue: 0,
					value: 1048576,
					anchor: '100%',
					allowBlank: false
				},
				{
					xtype: 'textfield',
					name: 'projectId',
					fieldLabel: 'Project ID',
					anchor: '100%'
				}
			]
		})

		this.callParent( arguments )
	}
})