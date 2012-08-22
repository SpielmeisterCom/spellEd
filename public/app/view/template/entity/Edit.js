Ext.define('Spelled.view.template.entity.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.entitytemplateedit',
    closable: true,

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items: [
        {
			xtype: 'container',
			autoEl:{
				tag: 'h1',
				cls: "no-animation-text",
				html: 'Entity preview is not available.'
			}
		}
	]
});
