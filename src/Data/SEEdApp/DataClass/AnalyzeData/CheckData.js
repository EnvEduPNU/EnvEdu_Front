import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function CheckAnalyzeData() {
    let active = 1;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
    }

    let data =  {
        labels: ['7-8', '8-9', '9-10', '10-11'],
        datasets: [
          {
            type: 'bar',
            label: '탑승인원',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [1, 10, 4, 8, 6],
            borderColor: 'red',
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: '하차인원',
            backgroundColor: 'rgb(75, 192, 192)',
            data: [3, 7, 1, 2, 9],
          },
        ],
    };

    return(
        <div>
            <label style={{fontWeight: 'bold', marginTop: '2rem'}}>학생들이 전송한 의견</label>

            <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student1</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
                        </Card.Text>
                    </Card.Body>
                </Card>
                
                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student2</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student3</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student4</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student5</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Card.Title>student6</Card.Title>
                        <Card.Text>
                        ~에 대한 설명입니다.
                        <Line type="line" data={data} />
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