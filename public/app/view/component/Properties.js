Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

	margin: '0 0 5 0',
	collapsible: true,
	titleCollapse: true,

	hideHeaders: true,
	deferRowRender: false,

	tools: [
		{
			type:'help',
			tooltip: 'Get Help',
			handler: function( event, toolEl, panel ){
				var componentGrid = panel.up( 'componentproperties' )

				if( !!componentGrid.componentConfigId ) {
					var component = Ext.getStore( 'config.Components' ).getById( componentGrid.componentConfigId ),
						template  = component.getTemplate()

					if( !Ext.isEmpty( template.get('doc') ) ) {
						window.open( template.get('doc'), '_blank')
					}
				}
			}
		}
	],

    customEditors: {
        //TODO: when a assigned asset gets removed, the field will disappear
        assetId: 'assetidproperty'
    },

	initComponent: function() {
		if( this.isAdditional === true ) this.closable = true

		this.callParent( arguments )
	}
});