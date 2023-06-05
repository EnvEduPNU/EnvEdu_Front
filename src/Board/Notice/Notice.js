import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';

import './Notice.css';

function Notice(){
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');

    const handleAddNotice = () => {
        if (newNotice !== '') {
            setNotices([...notices, newNotice]);
            setNewNotice('');
        }
    };

    return (
        <div id="wrap-form">
            <form action="/board" method="POST">
                <label htmlFor="title">제목:</label>
                <input type="text" id="title" name="title" required/><br/><br/>

                <label htmlFor="author">작성자:</label>
                <input type="text" id="author" name="author" required/><br/><br/>

                <label htmlFor="date">작성일:</label>
                <input type="date" id="date" name="date" required/><br/><br/>

                <label htmlFor="content">내용:</label><br/>
                <textarea id="content" name="content" rows="10" cols="50" required></textarea><br/><br/>

                <input type="submit" value="등록"/>
                <input type="reset" value="취소"/>
            </form>
        </div>
    );
}
export default Notice;
