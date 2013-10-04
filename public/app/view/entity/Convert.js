Ext.define('Spelled.view.entity.Convert' ,{
    extend: 'Spelled.view.template.Create',
    alias: 'widget.convertentity',

    title : 'Create Template from Entity',
	autoShow: true,

	initComponent: function() {
		this.callParent( arguments )
		var form = this.down( 'form' )
		form.add( {
			xtype: 'hiddenfield',
			name: 'owner'
		} )
	}
});
