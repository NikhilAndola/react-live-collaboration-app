import React, { useEffect, useRef } from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import { ACTIONS } from '../../actions';

function Editor({ socketRef, roomId, onCodeChange }: any) {
  const editorRef: any = useRef(null);
  const textAreaRef: any = useRef(null);

  console.log({ socketRef, roomId, onCodeChange });

  useEffect(() => {
    const init = async () => {
      const editor: any = CodeMirror.fromTextArea(textAreaRef.current, {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      // for sync the code
      editorRef.current = editor;

      editor.setSize(null, '100%');
      editorRef.current?.on('change', (instance: { getValue: () => any }, changes: { origin: any }) => {
        // console.log("changes", instance ,  changes );
        const { origin } = changes;
        const code = instance.getValue(); // code has value which we write
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  // data receive from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }: any) => {
        if (code !== null) {
          editorRef.current?.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: '600px' }}>
      <textarea ref={textAreaRef} id='realtimeEditor'></textarea>
    </div>
  );
}

export default Editor;
