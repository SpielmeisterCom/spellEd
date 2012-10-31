Ext.define('Spelled.view.entity.Convert' ,{
    extend: 'Spelled.view.template.Create',
    alias: 'widget.convertentity',

    title : 'Convert to template',
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
