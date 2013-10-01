Ext.define('Spelled.view.template.component.attribute.List', {
	extend: 'Ext.form.field.Text',
    alias : 'widget.spelledlistfield',

	mixins: [ 'Spelled.base.grid.Property' ],

	vtype: 'list',

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
