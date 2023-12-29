import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function StudentManipulateData() {

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

            <label style={{fontWeight: 'bold'}}>데이터 수정</label>
            <Table striped bordered hover style={{marginTop: '1rem'}}>
                <thead>
                    <tr>
                    <th style={{ color: 'black' }}><input /></th>
                    <th style={{ color: 'black' }}><input /></th>
                    <th style={{ color: 'black' }}><input /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td><input /></td>
                    <td><input /></td>
                    <td><input /></td>
                    </tr>
                    <tr>
                    <td><input /></td>
                    <td><input /></td>
                    <td><input /></td>
                    </tr>
                    <tr>
                    <td><input /></td>
                    <td><input /></td>
                    <td><input /></td>
                    </tr>
                </tbody>
            </Table>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}> 
                <Button variant="primary">확인</Button>
            </div>
        </div>
    )
}