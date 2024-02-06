import React, { Component } from 'react';
import './Find.scss'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

class Find extends Component {
    render() {
        return (
            <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Tabs
                    defaultActiveKey="find-id"
                >
                    <Tab eventKey="find-id" title={<span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#000' }}>아이디 찾기</span>}>
                        <div className='find-id-pw'>
                            <form style={{ marginTop: '3rem' }}>
                                <fieldset>
                                    {/*<h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>아이디 찾기</h4>*/}
                                    <div className="id-find">
                                        <input type="text" placeholder='이름' className="loginInput" />
                                    </div>
                                    <div className="id-find">
                                        <input type="email" placeholder='이메일' className="loginInput" />
                                    </div>

                                    <button type="button" class="btn login-btn">인증번호 받기</button>
                                </fieldset>
                            </form>
                        </div>
                    </Tab>
                    
                    <Tab eventKey="find-pw" title={<span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#000' }}>비밀번호 찾기</span>}>
                        <div className='find-id-pw'>
                            <form style={{ marginTop: '3rem' }}>
                                <fieldset>
                                    {/*<h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>비밀번호 찾기</h4>*/}
                                    <div className="password-find">
                                        <input type="text" placeholder='아이디' className="loginInput"/>
                                    </div>
                                    <div className="password-find">
                                        <input type="text" placeholder='이름' className="loginInput"/>
                                    </div>
                                    <div className="password-find">
                                        <input type="email" placeholder='이메일' className="loginInput"/>
                                    </div>

                                    <button type="button" class="btn login-btn">인증번호 받기</button>
                                </fieldset>
                            </form>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}


export default Find;



