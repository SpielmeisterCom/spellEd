Ext.define('Spelled.view.entity.HasTemplateHeader' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.entityhastemplateheader',

	tools: [{
		type: 'search',
		handler: function( event, target, owner, tool ) {
			this.fireEvent( 'showTemplateEntity', owner.ownerCt.entityTemplateId )
		}
	}],

	frame: true,
	title: ' Entity linked with template:',
	cls:   'entity-based-on-template'


});