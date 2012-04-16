Ext.define('Spelled.view.ui.SpelledEditor', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.aceeditor',

    onRender: function() {
        this.callParent(arguments); // call the superclass onRender method

        this.aceEditor = ace.edit( this.id )

        var JavaScriptMode = require("ace/mode/javascript").Mode;
        this.aceEditor.getSession().setMode( new JavaScriptMode() );

        this.aceEditor.getSession().setValue( this.id );

        // perform additional rendering tasks here.
    }
});