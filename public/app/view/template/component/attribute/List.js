Ext.define('Spelled.view.template.component.attribute.List', {
	extend: 'Ext.form.field.Text',
    alias : 'widget.spelledlistfield',

	mixins: [ 'Spelled.base.grid.Property' ],

	validator: function( value ) {
//		var regexp = /^\[ ?\w*?\]$/
//		if( !regexp.test( value ) )	return "This is not a valid list. List example: '[blue,green]'"
//		else return true
		return true
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
