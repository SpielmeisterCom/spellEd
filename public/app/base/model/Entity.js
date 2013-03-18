Ext.define( 'Spelled.base.model.Entity', {
	checkForComponentChanges : function() {
		this.getComponents().each(
			function( component ) {
				component.markChanges()
			}
		)

		this.getChildren().each( function( entity ) { entity.checkForComponentChanges() } )
	}
})
