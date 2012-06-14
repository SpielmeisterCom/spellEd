Ext.define('Spelled.view.zone.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.zonesnavigator',

    title: "Zones",
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    items:[
        {
            id: "ZonesTree",
			flex: 1,
            xtype: 'zonetreelist'
        },
		{
			flex: 2,
			layout: {
				type: 'accordion'
			},
			items: [
				{
					layout: {
						align: 'stretch',
						type: 'vbox'
					},
					title: 'Zone Default Entities',
					items: [
						{
							id: "EntityList",
							flex: 2,
							xtype: 'entiteslist'
						},
						{
							id: "ComponentProperty",
							flex: 1,
							xtype: 'componentproperties'
						}
					]
				},
				{
					layout: {
						align: 'stretch',
						type: 'vbox'
					},
					title: 'Zone Systems',
					items: [
						{
							id: "SystemList",
							flex: 1,
							xtype: 'systemlist'
						}
					]
				},
				{
					layout: {
						align: 'stretch',
						type: 'vbox'
					},
					title: 'Zone Script',
					items: [
						{
							id: "ZoneScript",
							flex: 1,
							xtype: 'zonescript'
						}
					]
				}
			]
		}
    ]

});