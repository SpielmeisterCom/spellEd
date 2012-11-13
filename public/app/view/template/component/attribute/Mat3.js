Ext.define('Spelled.view.template.component.attribute.Mat3', {
	extend: 'Ext.form.field.Text',
	alias : 'widget.spelledmat3field',

	mixins: [ 'Spelled.abstract.grid.Property' ],

	validator: function( value ) {
		var regexp = /^\[ ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?\]$/

		if( !regexp.test( value ) )	return "This is not a valid mat3. Mat3 example: '[1,2,3,4,5,6,7,8,9]'"
		else return true
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
