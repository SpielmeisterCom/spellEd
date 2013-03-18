Ext.define( 'Spelled.base.field.AssetId' ,{
	clickedDeepLink: function( event, toolEl, owner, tool ) {
		var assetCombo = owner.down( 'assetidproperty' )

		owner.up( 'editasset').fireEvent( 'assetdeeplink', assetCombo.getValue() )
	}
})
