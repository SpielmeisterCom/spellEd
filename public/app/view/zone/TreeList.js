Ext.define('Spelled.view.zone.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.zonetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Zones',
    store : 'ZonesTree',

    rootVisible: false,

    tbar: [
        {
            text: "Create Zone",
            action: "showCreateZone",
            tooltip: {
                text:'Create a new Zone',
                title:'Create'
            }
        },
		{
			text: "Create Entity",
			action: "showCreateEntity",
			tooltip: {
				text:'Create a new Entity',
				title:'Create'
			}
		}
	]
});