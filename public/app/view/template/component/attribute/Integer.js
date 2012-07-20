Ext.define('Spelled.view.template.component.attribute.Integer', {
    extend: 'Ext.form.field.Number',
    alias : 'widget.spelledintegerfield',

	decimalPrecision: 0,

	initComponent: function() {
		this.callParent()
	}
});
