Ext.define('Spelled.view.ui.SpelledRightPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.rightpanel',

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
				title: "Inspector",
				defaultTitle: "Inspector",
				region:'east',
				layout: 'fit',
				width: 300,
				minSize: 100,
				tools: [
					{
						type:'help',
						tooltip: 'Get Help',
						handler:  Ext.bind( me.handleDocClick, me)
					}
				]
			}
		)

		me.callParent(arguments)
	},

	handleDocClick: function( event, toolEl, panel ) {
		this.fireEvent( 'showDocumentation', event, toolEl, panel );
	}
});