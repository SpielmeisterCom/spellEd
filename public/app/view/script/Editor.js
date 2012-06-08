Ext.define('Spelled.view.script.Editor', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.scripteditor',
    closeAction: 'hide',

    closable: true,

    model : undefined,

    setModel : function( model ) {
        this.model = model
		if( !!this.aceEditor ) {
			this.aceEditor.getSession().setValue( this.model.get('content') )
			this.aceEditor.scrollToRow( 0 )
		}
    },

    onRender: function(  ) {
        var me = this
        me.callParent(arguments); // call the superclass onRender method
        me.aceEditor = ace.edit( this.id )

        var JavaScriptMode = require("ace/mode/javascript").Mode;
        me.aceEditor.getSession().setMode( new JavaScriptMode() );
        me.aceEditor.getSession().setValue( me.model.get('content') );

        me.aceEditor.commands.addCommand({
            name: 'saveCommand',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S'
            },
            exec: function( editor ) {
                me.model.set( 'content', editor.getSession().getValue() )
                me.model.save()
            }
        });

    }
});