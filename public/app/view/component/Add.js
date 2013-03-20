Ext.define('Spelled.view.component.Add' ,{
	extend: 'Ext.window.Window',
	alias: 'widget.addcomponent',

	requires: [ 'Ext.grid.feature.Grouping' ],

	title: "Add Components to the Entity",
	modal: true,
	closable: true,

	layout: 'fit',
	width : 550,
	height: 450,

	items: [
		{
			features: [ { ftype:'grouping' } ],
			hideHeaders: true,
			xtype: 'groupedtree',
			title: 'Available Components',
			singleExpand: true,
			columns: [
				{
					xtype: 'treecolumn',
					flex: 1,
					sortable: false,
					dataIndex: 'text'
				},
				{
					hidden: true,
					text: "Component group",
					renderer: function( value ) {
						var store  = Ext.getStore( 'grouping.Components' ),
							record = store.findRecord( 'name', value),
							name   = ( record ) ? record.get( 'name' ) : 'No Group assigned'

						return ( record && record.get( 'icon' ) ) ?  '<img src="' + record.get( 'icon' ) + '"/>' + name : name
					},
					dataIndex: 'group',
					sortable: true
				}
			],
			rootVisible: false
		}
	],

	buttons: [
		{
			text: 'Add',
			action: 'addComponent'
		}
	]

});