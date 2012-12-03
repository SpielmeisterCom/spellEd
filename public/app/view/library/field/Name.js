Ext.define('Spelled.view.library.field.Name', {
    extend: 'Ext.form.field.Text',
    alias : 'widget.spellednamefield',

	requires: [ 'Spelled.abstract.validator.General' ],

	mixins: [ 'Spelled.abstract.validator.General' ],

	checkTreeNode: function( node, parts ) {
		var text = parts.shift()

		if( text ) {
			var childNode = node.findChild( 'text', text )

			if( !childNode ) return false
			else if( childNode && parts.length === 0 ) return true
			else return this.checkTreeNode( childNode, parts )
		} else {
			return false
		}
	},

	validator: function( value, field ) {
		var rootNode  = Ext.getStore( 'Library' ).getRootNode(),
			form      = this.up( 'form'),
			namespace = ( form ) ? form.down( 'libraryfolderpicker' ) : field,
			parts     = [ value.toString() ]

		if( namespace && namespace.getValue() ) {
			parts = namespace.getValue().split( "." ).concat( parts )
			parts.shift()
		}

		var found = this.checkTreeNode( rootNode, parts )

		if( found ) return "This identifier is already in use! Use another name or delete the existing item."
		else return true
	}
})
