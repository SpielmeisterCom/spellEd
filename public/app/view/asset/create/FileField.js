Ext.define('Spelled.view.asset.create.FileField', {
    extend: 'Ext.form.field.File',
    alias: 'widget.assetfilefield',

	name: 'asset',
	fieldLabel: 'File',
	msgTarget: 'side',
	buttonText: 'Select a File...',
	listeners: {
		render: function( file ) {
			var domElement = document.querySelector('input[type="file"]')
			if( domElement && !domElement.onChange ) {
				domElement.addEventListener( 'change',
					function(event) {
						file.fileRawInput = event.target.files[0]
					},
					false
				)
			}
		}
	},
	validator: function( value ) {
		if( !value )
			return "You need to select a new File"
		else
			return true
	}
})
