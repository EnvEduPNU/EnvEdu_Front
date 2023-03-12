import React, { Component } from 'react';
import './Find.css'

class Find extends Component {
    render() {
        return (
            <>
                <form>
                    <fieldset>
                    <legend>아이디 찾기</legend><br></br>
                    <div className="id-find">
                    <input type="text" placeholder='이름'/>
                    </div>
                    <div className="id-find">
                    <input type="email" placeholder='이메일' />
                    </div>
                    <button type="button" class="btn btn-secondary">인증번호 받기</button>
                    </fieldset>
                </form>
                <form>
                    <fieldset>
                    <legend>비밀번호 찾기</legend><br></br>
                    <div className="password-find">
                    <input type="text" placeholder='이름'/>
                    </div><div className="password-find">
                    <input type="text" placeholder='아이디'/>
                    </div><div className="password-find">
                    <input type="email" placeholder='이메일'/>
                    </div>
                    <button type="button" class="btn btn-secondary">인증번호 받기</button>
                    </fieldset>
                </form>
            </>
                




            
        );
    }
}


export default Find;



