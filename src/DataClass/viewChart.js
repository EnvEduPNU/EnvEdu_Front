import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';



export default function ViewChart() {
    let active = 1;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
    }
    let data = [
        {
            "id": 1,
            "username": "Student1",
            "classId": 1,
            "chapterId": 1,
            "sequenceId": 1,
            "chartType": "LINE",
            "uuid": "39e633da-b226-43c9-9ecb-4ac2ecae72cb",
            "x": {
                "id": 1,
                "axisName": "온도",
                "axisType": "CATEGORIAL",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "TOP",
                "labelPosition": "END"
            },
            "y1": {
                "id": 2,
                "axisName": "습도1",
                "axisType": "CATEGORIAL",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "LEFT",
                "labelPosition": "START"
            },
            "y2": {
                "id": 3,
                "axisName": "습도2",
                "axisType": "NUMERIC",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "RIGHT",
                "labelPosition": "CENTER"
            },
            "z": {
                "id": 4,
                "axisName": "시간",
                "axisType": "NUMERIC",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "BOTTOM",
                "labelPosition": "END"
            }
        },
        {
            "id": 2,
            "username": "Student2",
            "classId": 1,
            "chapterId": 1,
            "sequenceId": 1,
            "chartType": "LINE",
            "uuid": "39e633da-b226-43c9-9ecb-4ac2ecae72cb",
            "x": {
                "id": 5,
                "axisName": "온도",
                "axisType": "CATEGORIAL",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "TOP",
                "labelPosition": "END"
            },
            "y1": {
                "id": 6,
                "axisName": "습도1",
                "axisType": "CATEGORIAL",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "LEFT",
                "labelPosition": "START"
            },
            "y2": {
                "id": 7,
                "axisName": "습도2",
                "axisType": "NUMERIC",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "RIGHT",
                "labelPosition": "CENTER"
            },
            "z": {
                "id": 8,
                "axisName": "시간",
                "axisType": "NUMERIC",
                "minimumValue": 0.5,
                "maximumValue": 1.6,
                "stepSize": 0.2,
                "legendPosition": "BOTTOM",
                "labelPosition": "END"
            }
        }
    ]
    console.log(data)
    return(
        <div>
            <label style={{fontWeight: 'bold', marginTop: '2rem'}}>학생들이 전송한 의견</label>

            <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {data.map((chartData, index) => {
                    <Card style={{ width: '30rem', margin: '0.5rem' }}>
                        <Card.Body>
                            <Card.Title>student1</Card.Title>
                            <Card.Text>
                            ~에 대한 설명입니다.
                            {/*<Line type="line" data={data} />*/}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })}
            </div>

            <div>
                <Pagination>{items}</Pagination>
            </div>
        </div>
    )
}