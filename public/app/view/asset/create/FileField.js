Ext.define('Spelled.view.asset.create.FileField', {
    extend: 'Ext.form.field.File',
    alias: 'widget.assetfilefield',

	name: 'asset',
	fieldLabel: 'File',
	msgTarget: 'side',
	buttonText: 'Select a File...',
	listeners: {
		render: function() {
			this.addChangeEventToFileField( this.getDomFileUploadElement() )
		}
	},

	addChangeEventToFileField: function( domElement ) {
		var me = this

		if( domElement && !domElement.onChange ) {
			domElement.addEventListener( 'change',
				function(event) {
					me.fileRawInput = event.target.files[0]
					me.fireEvent( 'filechanged', me )
				}
			)
		}
	},

	getDomFileUploadElement: function() {
		return this.getEl().dom.querySelector('input[type="file"]')
	},

	clearFileUpload: function() {
		var fileField = this.getDomFileUploadElement(),
			parentNod = fileField.parentNode,
			tmpForm   = document.createElement("form")

		parentNod.replaceChild( tmpForm, fileField )
		tmpForm.appendChild( fileField )
		tmpForm.reset()

		parentNod.replaceChild( fileField, tmpForm )

		this.reset()
		this.addChangeEventToFileField( this.getDomFileUploadElement() )
	},

	validator: function( value ) {
		if( !value )
			return "You need to select a new File"
		else
			return true
	},

	initComponent: function() {
		this.addEvents( 'filechanged' )

		this.callParent( arguments )
	}
})
