import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import {
  getAllAccount,
  putPassword,
  deleteUser,
  addUser,
} from './api/userAccout';

const rolePriority = {
  ROLE_ADMIN: 1,
  ROLE_EDUCATOR: 2,
  ROLE_RESEARCHER: 3,
  ROLE_STUDENT: 4,
};

function UserManagement() {
  // 상태 초기화
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'ROLE_STUDENT',
  });

  // 계정 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const allAcountResponse = await getAllAccount();
      setUsers(
        allAcountResponse.data.sort(
          (a, b) => rolePriority[a.role] - rolePriority[b.role],
        ),
      );
    };
    fetchData();
  }, []);

  // Modal functions
  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowModal(false);
  };

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUserClose = () => {
    setShowAddUserModal(false);
  };

  const handleAddUserShow = () => {
    setShowAddUserModal(true);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 다릅니다');
      return;
    }

    try {
      await putPassword(
        selectedUser.username,
        selectedUser.password,
        newPassword,
      );

      const allAcountResponse = await getAllAccount();
      setUsers(
        allAcountResponse.data.sort(
          (a, b) => rolePriority[a.role] - rolePriority[b.role],
        ),
      );

      alert('비밀번호가 정상적으로 변경되었습니다.');
    } catch (e) {
      console.log(e);
      alert('비밀번호 변경 중 문제가 발생했습니다.');
    } finally {
      setNewPassword('');
      setConfirmPassword('');
      handleClose();
    }
  };

  // 계정 삭제 처리
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      // 사용자 목록 갱신
      const allAcountResponse = await getAllAccount();
      setUsers(
        allAcountResponse.data.sort(
          (a, b) => rolePriority[a.role] - rolePriority[b.role],
        ),
      );
      alert('사용자가 삭제되었습니다.');
    } catch (e) {
      console.log(e);
      alert('사용자 삭제 중 문제가 발생했습니다.');
    }
  };

  // 계정 추가 처리
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser.username, newUser.password, newUser.role); // addUser API 호출 (username, password, role)
      const allAcountResponse = await getAllAccount();
      setUsers(
        allAcountResponse.data.sort(
          (a, b) => rolePriority[a.role] - rolePriority[b.role],
        ),
      );
      alert('새 계정이 추가되었습니다.');
      setNewUser({
        username: '',
        password: '',
        role: 'ROLE_STUDENT',
      });
      handleAddUserClose();
    } catch (e) {
      console.log(e);
      alert('계정 추가 중 문제가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>전체 계정 관리</h2>
      <Button
        variant="success"
        onClick={handleAddUserShow}
        style={{ marginBottom: '20px' }}
      >
        계정 추가
      </Button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              이름
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              역할
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              비밀번호(숨겨짐)
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              비밀번호 변경
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {user.username}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {user.role}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                *********
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Button variant="primary" onClick={() => handleShow(user)}>
                  비밀번호 변경
                </Button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(user.username)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Password Change Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onHide={handleAddUserClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                required
              >
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_EDUCATOR">Educator</option>
                <option value="ROLE_RESEARCHER">Researcher</option>
                <option value="ROLE_STUDENT">Student</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserManagement;
