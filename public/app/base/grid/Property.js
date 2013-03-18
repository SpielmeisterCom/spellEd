Ext.define('Spelled.base.grid.Property', {
	addEditPropertyEvent: function() {
		this.addEvents(
			'editproperty'
		)
		this.enableBubble( 'editproperty' )
		this.addListener( 'change', this.handleChange, this )
	},

	transformOriginalValue: function() {
		return this.componentValue
	},

	handleChange: function( field, newValue, oldValue ) {
		if( this.isValid() ) this.fireEvent( 'editproperty', field, newValue, oldValue )
	}
})
