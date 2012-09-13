Ext.define('Spelled.view.template.component.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.componenttemplateedit',
    closable: true,

    layout: {
        align: 'stretch',
        type: 'vbox',
		padding: 5
    },

	items: [
		{
			xtype: "componenttemplatedetails",
			flex: 3
		},
		{
			xtype: 'componenttemplateattributeslist',
			flex: 4
		},
		{
			xtype: 'componenttemplateproperty',
			flex: 3
		}
	]
});
