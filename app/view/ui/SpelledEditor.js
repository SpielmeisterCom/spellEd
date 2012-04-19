Ext.define('Spelled.view.ui.SpelledEditor', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.aceeditor',
    closeAction: 'hide',

    closable: true,

    onRender: function(  ) {
        this.callParent(arguments); // call the superclass onRender method
        this.aceEditor = ace.edit( this.id )

        var JavaScriptMode = require("ace/mode/javascript").Mode;
        this.aceEditor.getSession().setMode( new JavaScriptMode() );
        this.aceEditor.getSession().setValue( this.html );

        this.aceEditor.commands.addCommand({
            name: 'saveCommand',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S'
            },
            exec: function( editor ) {
                console.log( editor.getSession().getValue() )
            }
        });

    }
});