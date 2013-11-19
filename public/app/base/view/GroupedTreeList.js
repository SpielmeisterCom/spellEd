Ext.define('Spelled.base.view.GroupedTreeList' ,{
    extend: 'Spelled.base.view.TreeList',
	alias: 'widget.groupedtree',

	requires: [ 'Spelled.base.view.GroupedTreeView', 'Ext.grid.feature.Grouping' ],

	viewType: 'groupedtreeview',
	hideHeaders: true,

	features: [ {
		ftype:'grouping',
		groupHeaderTpl: [
			'Group: ',
			'{name:this.formatName}',
			{
				formatName: function( value ) {
					var store  = Ext.getStore( 'grouping.Components' ),
						record = store.findRecord( 'name', value, null, null, null, true ),
						name   = ( value == 'zzz' ) ? 'No Group assigned' : value

					return ( record && record.get( 'icon' ) ) ?  '<img src="' + record.get( 'icon' ) + '"/>' + name : name
				}
			}
		]
	} ],

	groupTreeNodes: function() {
		var view = this.getView()
		view.store.model = this.store.model

		view.store.group( 'group' )
	}
});


