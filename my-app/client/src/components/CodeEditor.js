import React, { useRef, useEffect, useState } from "react";
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.6:5000'); 

const CodeEditor = () => {
    const editorRef = useRef(null);
    const [code, setCode] = useState("// Write your code here");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        socket.on('codeUpdate', (newCode) => {
            // Prevent the update if the change came from this client
            if (isTyping) return;

            setCode(newCode);
            if (editorRef.current) {
                editorRef.current.setValue(newCode);
            }
        });

        return () => {
            socket.off('codeUpdate');
        };
    }, [isTyping]);

    const handleEditorChange = (value) => {
        setCode(value);
        setIsTyping(true);
        socket.emit('codeChange', value);
        setTimeout(() => setIsTyping(false), 500); // Debounce typing status
    };

    const saveCode = () => {
        axios.post('http://192.168.1.6:5000/save', { content: code }) // Update URL to use your local IP
            .then(response => {
                alert(response.data);
            }).catch(error => {
                console.error('There was an error saving the code', error);
            });
    };

    return (
        <>
            <Editor
                height="80vh"
                language="javascript"
                value={code}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
                onChange={handleEditorChange}
            />
            <button onClick={saveCode}>Save Code</button>
        </>
    );
};

export default CodeEditor;
