import React, { useRef, useEffect, useState } from "react";
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); 

const CodeEditor = ({groupId}) => {
    const editorRef = useRef(null);
    const [code, setCode] = useState("// Write your code here");
    const [isTyping, setIsTyping] = useState(false);
    const [output, setOutput] = useState("");

    useEffect(() => {
        // Join the room for this group
        socket.emit('joinRoom', groupId);

        socket.on('codeUpdate', (newCode) => {
            // Prevent the update if the change came from this client
            if (isTyping) return;

            setCode(newCode);
            if (editorRef.current) {
                editorRef.current.setValue(newCode);
            }
        });

        return () => {
            // Leave the room when the component unmounts
            socket.emit('leaveRoom', groupId);
            socket.off('codeUpdate');
        };
    }, [groupId, isTyping]);

    const handleEditorChange = (value) => {
        setCode(value);
        setIsTyping(true);
        socket.emit('codeChange', { groupId, code: value });
        setTimeout(() => setIsTyping(false), 500); // Debounce typing status
    };

    // const saveCode = () => {
    //     axios.post('http://localhost:5000/api/save', { content: code, group_id: groupId }) // Update URL to use your local IP
    //         .then(response => {
    //             alert(response.data);
    //         }).catch(error => {
    //             console.error('There was an error saving the code', error);
    //         });
    // };

    const runCode = () => {
        axios.post('http://localhost:5000/api/run', { code })
            .then(response => {
                setOutput(response.data.output);
                console.log(response.data);
            }).catch(error => {
                console.error('There was an error running the code', error);
            });
    };

    return (
        <>
            <Editor
                height="80vh"
                language="javascript"
                value={code}
                theme="hc-black"
                onMount={(editor) => (editorRef.current = editor)}
                onChange={handleEditorChange}
            />
            {/* <button onClick={saveCode}>Save Code</button> */}
            <button onClick={runCode}>Run Code</button>
            <pre>{output}</pre>
        </>
    );
};

export default CodeEditor;