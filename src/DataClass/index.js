import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import cardImg from './card.jpg'

export default function EClassList() {
    return(
        <div>
            <h3 style={{ marginBottom: '2rem' }}>E-class 목록</h3>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={cardImg} />
                <Card.Body>
                    <Card.Title style={{ fontWeight: 'bold' }}>우리 학교의 공기질 측정하기</Card.Title>
                    <Card.Text style={{ marginTop: '1rem' }}>
                        1차시:  교실의 공기질 측정하기
                        <br/>
                        <small>[탐구] 센서를 활용하여 교실의 공기질을 측정해보자.</small>
                    </Card.Text>
                    <a href="/slide" target="_blank">
                        <Button variant="primary">Start</Button>
                    </a>
                </Card.Body>
            </Card>
        </div>
    )
}