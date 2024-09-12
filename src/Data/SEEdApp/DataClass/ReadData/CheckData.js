import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

export default function CheckReadData() {
    let active = 1;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
    }
    return(
        <div>
            <label style={{fontWeight: 'bold', marginTop: '2rem'}}>학생들이 전송한 의견</label>

            <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                <Card style={{ width: '30rem', height: '10rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>
                
                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', height: '10rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', height: '10rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>

            <div>
                <Pagination>{items}</Pagination>
            </div>
        </div>
    )
}