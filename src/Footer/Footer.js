import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div id="bottomMenu">
          <ul>
            <li>
              <a href="#">개인정보처리방침</a>
            </li>
            <li>
              <a href="#">저작권보호정책</a>
            </li>
            <li>
              <a href="#">이메일무단수집거부</a>
            </li>
          </ul>
        </div>
        <div id="company">
          <p>(46241) 부산광역시 금정구 부산대학로63번길 2 (장전동)<br/>
          TEL : 051. 510. 1642</p>
        </div>
        <div id="right">
          <p>Copyright ⓒ 2019 Younkyeong Nam (SEEd project PI). All rights reserved..</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
