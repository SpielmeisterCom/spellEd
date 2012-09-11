Ext.define('Spelled.view.template.component.attribute.Integer', {
    extend: 'Ext.form.field.Number',
    alias : 'widget.spelledintegerfield',

	decimalPrecision: 0,

	mixins: [ 'Spelled.abstract.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
