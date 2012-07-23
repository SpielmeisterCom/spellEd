Ext.define('Spelled.view.template.component.Attributes' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.componenttemplateattributeslist',

    title: 'Attributes',
	frame: true,
    rootVisible: false,
    flex: 1,

    bbar: [
        {
            text: "Add Attribute",
            action: "addAttribute"
        }
    ],

	setReadonly: function() {
		Ext.each( this.getDockedItems(), function( item ) {
			if( item.xtype === 'toolbar' ) item.hide()
		})

		this.down('actioncolumn').hide()
	}
});
