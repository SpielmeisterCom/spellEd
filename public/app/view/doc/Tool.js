Ext.define('Spelled.view.doc.Tool' ,{
    extend: 'Ext.panel.Tool',
	alias: 'widget.tool-documentation',

	cls: "doc-tool",
	type:'help',
	tooltip: 'Get Help',
	docString: "",
	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			handler:  function( event, toolEl, panel ) {
				me.fireEvent( 'showDocumentation', this.docString, toolEl, panel  )
			}
		})

		this.addEvents(
			'showDocumentation'
		)

		me.callParent()
	}
});
