import { useState, useEffect } from 'react';
import ReadData from './ReadData/ReadData';
import ManipulateData from './ManipulateData/ManipulateData';
import AnalyzeData from './AnalyzeData/AnalyzeData';
import CompareData from './CompareData/CompareData';

import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

export default function DataClass() {
    const [activity, setActivity] = useState('data 열람');
    
    return(
        <div>
            <Nav fill variant="tabs" defaultActiveKey="/home">
                <Nav.Item onClick={()=>setActivity('data 열람')}>
                    <Nav.Link eventKey="link-1">data 열람</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={()=>setActivity('data 조작')}>
                    <Nav.Link eventKey="link-2">data 조작</Nav.Link> 
                </Nav.Item>
                <Nav.Item onClick={()=>setActivity('data 분석')}>
                    <Nav.Link eventKey="link-3">data 분석</Nav.Link> 
                </Nav.Item>
                <Nav.Item onClick={()=>setActivity('data 비교')}>
                    <Nav.Link eventKey="link-4">data 비교</Nav.Link> 
                </Nav.Item>
            </Nav>

            {activity === 'data 열람' && <ReadData />}
            {activity === 'data 조작' && <ManipulateData />}
            {activity === 'data 분석' && <AnalyzeData />}
            {activity === 'data 비교' && <CompareData />}

        </div>
    )
}