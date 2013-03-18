Ext.define('Spelled.view.template.component.attribute.Vec3', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spelledvec3field',

	mixins: [ 'Spelled.base.grid.Property' ],

	validator: function( value ) {
		var regexp = /^\[ ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?, ?-?\d+\.?\d* ?\]$/

		if( !regexp.test( value ) )	return "This is not a valid vec3. Vec3 Example: '[1,2,3]'"
		else return true
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
