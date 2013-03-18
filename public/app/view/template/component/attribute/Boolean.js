Ext.define('Spelled.view.template.component.attribute.Boolean', {
    extend: 'Ext.form.field.Checkbox',
    alias : 'widget.spelledbooleanfield',
	mixins: [ 'Spelled.base.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
