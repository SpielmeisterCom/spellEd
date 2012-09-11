Ext.define('Spelled.view.template.component.attribute.List', {
    extend: 'Ext.form.field.Base',
    alias : 'widget.spelledlistfield',

	mixins: [ 'Spelled.abstract.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
