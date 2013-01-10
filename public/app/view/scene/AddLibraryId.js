Ext.define('Spelled.view.scene.AddLibraryId', {
    extend: 'Ext.window.Window',
    alias : 'widget.sceneaddlibraryid',
	closable: true,

	autoShow: true,

	title: "Add a new library item to scene",

	initComponent: function() {
		var me    = this,
			all   = Ext.getStore( 'Library' ).getAllLibraryIds(),
			excluded = this.excludingIds,
			store = Ext.create( 'Ext.data.Store', {
				fields: [ 'id', 'type' ]
			})

		Ext.Array.each(
			all,
			function( item ) {
				if( !Ext.Array.contains( excluded, item.id ) ) store.add( item )
			}
		)

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'form',
					padding: 5,
					border: false,
					items: [
						{
							xtype: 'combo',
							listeners: {
								beforequery: function(qe){
									qe.query = new RegExp(qe.query, 'i')
									qe.forceAll = true
								}
							},
							growToLongestValue: true,
							grow: true,
							emptyText: ' -- Select a library item -- ',
							forceSelection  : true,
							store: store,
							queryMode: 'local',
							valueField: 'id',
							displayField: 'id',
							fieldLabel: 'Library ID',
							name: 'id',
							allowBlank: false
						}
					],
					buttons: [
						{
							xtype: 'button', text: 'Add',
							handler: Ext.bind( me.handleAddClick, me )
						},
						{
							xtype: 'button', text: 'Cancel',
							handler: function() { me.close() }
						}
					]
				}
			]
		})

		me.callParent( arguments )
	},

	handleAddClick: function() {
		var combo = this.down( 'combo[name="id"]' )

		this.fireEvent( 'addToLibrary', this, combo.findRecordByValue( combo.getValue() ) )
	}
})
