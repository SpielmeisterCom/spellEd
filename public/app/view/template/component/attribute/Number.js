Ext.define('Spelled.view.template.component.attribute.Number', {
    extend: 'Ext.form.field.Number',
    alias : 'widget.spellednumberfield',
	mixins: [ 'Spelled.base.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
