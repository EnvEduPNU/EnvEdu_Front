import React, { useState, useEffect } from 'react';
import './OpenApi.scss';
import { Link } from 'react-router-dom';
import earthImg from "./earth.png";
import Water from './water';
import Air from './air';

export default function OpenApi() {
    const [category, setCategory] = useState('water');

    // 선택한 카테고리에 따라 스타일을 동적으로 설정하는 함수
    const changeStyle = (selectedCategory) => {
        return {
            backgroundColor: category === selectedCategory ? '#FFF' : '#027c2b',
            color: category === selectedCategory ? '#027c2b' : '#fff',
            border: category === selectedCategory ? '2px solid #027c2b' : 'none'
        };
    };

    return (
        <div>
            <div id="wrap-openapi-div">
                <h3 className="air-div-full">
                    <img src={earthImg} 
                        style={{
                            width: '3.125rem', 
                            marginRight: '0.625rem'
                            }}/>
                    {category === "water" && "수질 데이터 조회"}
                    {category === "air" && "대기질 데이터 조회"}
                </h3>

                <div className="wrap-select-type">
                    <div 
                        className="select-type" 
                        onClick={() => setCategory('water')}
                        style={changeStyle('water')}>
                        수질 데이터
                    </div>
                    <div 
                        className="select-type" 
                        onClick={() => setCategory('air')}
                        style={changeStyle('air')}>
                        대기질 데이터
                    </div>
                </div>

                {category === 'water' && <Water />}
                {category === 'air' && <Air />}
            </div>
        </div>
    );
}
