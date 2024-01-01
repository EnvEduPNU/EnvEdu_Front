import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function EClassList() {
    return(
        <div>
            <h3 style={{ marginBottom: '2rem' }}>E-class 목록</h3>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>우리 학교의 공기질 측정하기</Card.Title>
                    <Card.Text>
                        공기질 측정 수업 (설명)
                    </Card.Text>
                    <Link to="/">
                        <Button variant="primary">Start</Button>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    )
}