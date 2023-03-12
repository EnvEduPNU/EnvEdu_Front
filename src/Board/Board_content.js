import React, { Component } from 'react';
import './Board_content.css';

function Board_content(){
    return(
        <>
           <div className="container"><br/><br/><br/>
                <h4>제목</h4>

                <hr/>
                <div className="content">
                    글 내용
                </div>

                <div className="content_footer">

                </div>

                <div className="button">


                </div>

           </div>



        </>
    );
}
export default Board_content;