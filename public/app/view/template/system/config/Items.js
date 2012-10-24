Ext.define('Spelled.view.template.system.config.Items' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemtemplateconfigitems',

    title: 'Default configuration',
	margins: '0 0 5 0',
	frame: true,

	initComponent: function() {
		var me = this;

		me.tools = [{
			xtype: 'tool-documentation',
			docString: "#!/guide/concepts_systems"
		}]

		me.callParent( arguments )
	}

})
