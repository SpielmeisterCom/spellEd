Ext.define('Spelled.view.template.component.attribute.String', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledtextfield',
	mixins: [ 'Spelled.base.grid.Property', 'Spelled.base.validator.General' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
