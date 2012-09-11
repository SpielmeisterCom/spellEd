Ext.define('Spelled.view.template.component.attribute.Boolean', {
    extend: 'Ext.form.field.Checkbox',
    alias : 'widget.spelledbooleanfield',
	mixins: [ 'Spelled.abstract.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
