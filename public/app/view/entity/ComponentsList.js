Ext.define('Spelled.view.entity.ComponentsList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.entitycomponentslist',

	docString: "#!/guide/entity_documentation",

	padding: '5px',

	border: false,

	autoScroll: true,

	buttonAlign:'left',

	sortByTitle: function() {
		this.items.items = this.items.items.sort(
			function( a, b ) {
				if( !a.componentConfigId ) return -1

				var titleA = Ext.util.Format.stripTags(a.title),
					titleB = Ext.util.Format.stripTags(b.title)

				return ( titleA > titleB )
			}
		)
	}
});