Ext.define('Spelled.view.ui.SpelledAboutComponents' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.spelledaboutcomponents',

    title : 'Components',

    initComponent: function() {

        Ext.applyIf( this, {
            items: [

            ]
        })

        this.callParent( arguments )
    }
})