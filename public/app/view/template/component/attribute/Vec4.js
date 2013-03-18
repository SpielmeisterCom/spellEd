Ext.define('Spelled.view.template.component.attribute.Vec4', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledvec4field',

	mixins: [ 'Spelled.base.grid.Property' ],

	validator: function( value ) {
		var regexp = /^\[ ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d*?\]$/

		if( !regexp.test( value ) )	return "This is not a valid vec4. Vec4 Example: '[1,2,3,4]'"
		else return true
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
