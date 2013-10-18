Ext.define('Spelled.view.entity.HasTemplateHeader' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.entityhastemplateheader',

	initComponent: function() {
		var me = this

		Ext.applyIf(
			me,
			{
				tools: [
					{
						type: 'search',
						handler: function( event, target, owner, tool ) {
							me.fireEvent( 'showtemplateentity', me.entityTemplateId )
						}
					}
				]
			}
		)

		if( me.entityId ) {
			me.tools.unshift({
				type: 'unlink',
				handler: function( event, target, owner, tool ) {
					me.fireEvent( 'unlink', me.entityId, me.entityTemplateId )
				}
			})
		}

		this.callParent()
	},

	frame: true,
	title: ' Entity linked with template',
	cls:   'entity-based-on-template'
});