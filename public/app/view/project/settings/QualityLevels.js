Ext.define('Spelled.view.project.settings.QualityLevels' ,{
    extend: 'Spelled.view.project.settings.Form',
    alias: 'widget.projectqualitysettings',

    title : 'Quality Levels',

	initComponent: function() {

		Ext.applyIf( this, {
				items: [
					{
						xtype: 'grid',
						name: 'qualityLevels',
						tbar: [ {
								text: "Add",
								icon: 'resources/images/icons/add.png',
								scope: this,
								handler: this.addHandler
							}
						],
						selType: 'rowmodel',
						plugins: [{
							ptype: 'cellediting',
							clicksToEdit: 1
						}],
						columns: {
							items: [
								{
									text: "Description",
									dataIndex: "name",
									editor: {
										xtype: 'textfield',
										allowBlank: false
									},
									flex: 1
								},
								{
									text: "Level",
									dataIndex: "level",
									editor: {
										xtype: 'spelledintegerfield',
										allowBlank: false
									},
									flex: 1
								},
								{
									xtype: 'actioncolumn',
									width: 30,
									icon: 'resources/images/icons/wrench-arrow.png',
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

	getTransformedQualityData: function() {
		var qualityLevels = {}

		this.down('grid').getStore().each(
			function( record ) {
				qualityLevels[ record.get( 'name' ) ] = record.get( 'level' )
			}
		)

		return qualityLevels
	},

	handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
		this.fireEvent( 'showContextMenu', record, e )
	},

	addHandler: function() {
		this.fireEvent( 'addQualityLevel', this )
	}
})