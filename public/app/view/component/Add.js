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
			features: [ {
				ftype:'grouping',
				groupHeaderTpl: [
					'Group: ',
					'{name:this.formatName}',
					{
						formatName: function( value ) {
							var store  = Ext.getStore( 'grouping.Components' ),
								record = store.findRecord( 'name', value),
								name   = ( value == 'zzz' ) ? 'No Group assigned' : value

							return ( record && record.get( 'icon' ) ) ?  '<img src="' + record.get( 'icon' ) + '"/>' + name : name
						}
					}
				]
			} ],
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