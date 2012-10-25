Ext.define('Spelled.view.template.component.attribute.String', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledtextfield',
	mixins: [ 'Spelled.abstract.grid.Property', 'Spelled.abstract.validator.General' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
