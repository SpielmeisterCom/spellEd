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
						name: 'supportedLanguages',
						tbar: [ {
								text: "Add",
								icon: 'images/icons/add.png',
								scope: this,
								handler: this.addHandler
							}
						],
						columns: {
							items: [
								{
									text: "Supported languages",
									dataIndex: "name",
									flex: 1
								},
								{
									xtype: 'actioncolumn',
									width: 30,
									icon: 'images/icons/wrench-arrow.png',
									iconCls: 'x-hidden edit-action-icon',
									handler: Ext.bind( this.handleEditClick, this)
								}
							]
						}
					}
				]
			}
		)

		this.callParent( arguments )
	},

	handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
		this.fireEvent( 'showContextMenu', record, e )
	},

	addHandler: function() {
		this.fireEvent( 'showAddLanguage', this )
	}
})