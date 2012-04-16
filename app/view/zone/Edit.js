Ext.define('Spelled.view.zone.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.zoneedit',

    layout: 'fit',
    closable: true,

    initComponent: function() {
        var me = this;
        me.callParent(arguments);


    },

    onRender: function() {
        this.callParent(arguments); // call the superclass onRender method

        this.aceEditor = ace.edit( this.id )

        var JavaScriptMode = require("ace/mode/javascript").Mode;
        this.aceEditor.getSession().setMode( new JavaScriptMode() );

        this.aceEditor.getSession().setValue( this.id );

        // perform additional rendering tasks here.


    }
});