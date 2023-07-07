import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import './ckeditor.css'
import { useState } from "react";
import ReactHtmlParser from 'react-html-parser';
import './config.js';

export default function Editor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [show, setShow] = useState({ title: "", content: "" });
    console.log(show)
    const [isClick, setClick] = useState(false);

    /*
    const renderHtml = (html) => {
        return ReactHtmlParser(html, {
        transform: (node) => {
            if (node.type === 'tag' && node.name === 'blockquote') {
                return <blockquote>{node.children}</blockquote>;
            }
        },
        });
    };
    */

    return (
        
        <div className="">
            <div style={{marginBottom: '20px'}}>
                <input onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
            </div>

            <CKEditor
                editor={ ClassicEditor }
                //data="<p>Hello from CKEditor 5!</p>"
                onChange={ ( event, editor ) => {
                    const content = editor.getData();
                    console.log(content)
                    console.log( { event, editor, content } );
                    setContent(editor.getData());
                } }
                /*
                onBlur={ ( event, editor ) => { //editor 바깥 클릭했을 때 
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => { //editor 안쪽 클릭했을 때 
                    console.log( 'Focus.', editor );
                } } 
                */  
            />

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={() => {setShow({title: title, content: content}); setClick(true)}} style={{background: '#AEC0F0', border: 'none', color: 'white', borderRadius: '50px'}}>내용 보기</button>
            </div>
            
            {isClick &&
                <div className="parsing_editor">
                    <div style={{padding: '10px', borderBottom: '1px solid gray'}}>
                        {show.title}
                    </div>
                    <div style={{padding: '10px'}}>
                        {ReactHtmlParser(show.content)}
                    </div>
                    
                    {/*
                    {show.map((ele) => (
                        <div className="temp_postTest">
                            <h3>{ele.title}</h3>
                        <div>{ReactHtmlParser(ele.content)}</div>
                    </div>
                    ))}
                    */}
                </div>
            }
        </div>
    );
}