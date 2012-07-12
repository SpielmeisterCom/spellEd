Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

	margin: '0 0 5 0',
	collapsible: true,
	titleCollapse: true,

	hideHeaders: true,
	deferRowRender: false,

	initComponent: function() {
		var me = this

		me.tools = [{
			type:'help',
			tooltip: 'Get Help',
			handler:  Ext.bind( me.handleDocClick, me)
		}]

		me.customEditors = {
			assetId:  new Ext.grid.CellEditor({ field: 'assetidproperty' })
		}

		if( this.isAdditional === true ) this.closable = true

		this.callParent( arguments )
	},

	handleDocClick: function( event, toolEl, panel ) {
		this.fireEvent( 'showDocumentation', event, toolEl, panel );
	}
});