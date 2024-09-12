import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function StudentAnalyzeData() {
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
            <label style={{fontWeight: 'bold'}}>공유된 데이터</label>
            <Table striped bordered hover style={{marginTop: '1rem'}}>
                <thead>
                    <tr>
                    <th style={{ color: 'black' }}>일시</th>
                    <th style={{ color: 'black' }}>데이터 종류</th>
                    <th style={{ color: 'black' }}>메모</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>2023-12-12</td>
                    <td>seed</td>
                    <td>.</td>
                    </tr>
                    <tr>
                    <td>2023-12-12</td>
                    <td>수질</td>
                    <td>.</td>
                    </tr>
                    <tr>
                    <td>2023-12-12</td>
                    <td>대기질</td>
                    <td>.</td>
                    </tr>
                </tbody>
            </Table>

            <label style={{fontWeight: 'bold'}}>그래프 그리기</label>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div>
                    <Card style={{ width: '30rem', margin: '0.5rem' }}>
                    <Card.Body>
                        <Line type="line" data={data} />
                    </Card.Body>
                    </Card>
                </div>

                <div>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">그래프 제목</InputGroup.Text>
                        <Form.Control
                        placeholder="최대값"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">x축 이름</InputGroup.Text>
                        <Form.Control
                        placeholder="x축 이름"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">y축 이름</InputGroup.Text>
                        <Form.Control
                        placeholder="y축 이름"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">최소</InputGroup.Text>
                        <Form.Control
                        placeholder="최소"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">최대</InputGroup.Text>
                        <Form.Control
                        placeholder="최대"
                        />
                    </InputGroup>
                </div>

            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}> 
                <Button variant="primary">확인</Button>
            </div>
        </div>
    )
}