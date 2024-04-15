import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PiGift } from "react-icons/pi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { HiMiniXMark } from "react-icons/hi2";
import { IoCloudUploadOutline } from "react-icons/io5";
import './UploadReward.scss';
import { customAxios } from "../../../Common/CustomAxios";

export default function UploadReward() {
    const location = useLocation();
    const state = location.state || {};

    console.log(state.code);

    const [showImages, setShowImages] = useState([]);

    const handleAddImages = (event) => {
        const imageLists = event.target.files;
        let imageUrlLists = [...showImages];
    
        for (let i = 0; i < imageLists.length; i++) {
            const currentFile = imageLists[i];
            const currentImageUrl = URL.createObjectURL(currentFile);

            imageUrlLists.push({
                file: currentFile, 
                url: currentImageUrl,
            });
        }
        /*
        if (imageUrlLists.length > 10) {
            imageUrlLists = imageUrlLists.slice(0, 10);
        }
        */
        setShowImages(imageUrlLists);
    };
  
    const handleDeleteImage = (id) => {
        setShowImages(showImages.filter((_, index) => index !== id));
    };

    const navigate = useNavigate();

    const uploadReward = () => {
        const formData = new FormData();
        showImages.forEach((image) => {
            formData.append("files", image.file);
        });

        customAxios.post(`/survey/reward/upload/${state.code}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }
        })
        .then(() => {
            alert("등록되었습니다.");
            navigate('/survey');
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className="upload-reward">
            <h4 style={{ fontWeight: 'bold' }}>
                <PiGift size="30" /> 상품권 업로드
            </h4>

            <span style={{ color: 'rgb(94, 44, 237)' }}>
                <AiOutlineExclamationCircle /> 상품권 이미지를 설문 참여자 수만큼 업로드 해주세요.
            </span>


            <div className="preview-container">
                <label htmlFor="input-file" onChange={handleAddImages}>
                    <input type="file" id="input-file" accept="image/*" multiple />
                    {showImages.length === 0 &&
                        <div style={{ cursor: 'pointer', fontFamily: 'Poppins', fontSize: '1.5em', textAlign: 'center', color: '#a2a2a2' }}>
                            <IoCloudUploadOutline size="60" /> 
                            <br />
                            Click <span style={{ color: 'rgb(94, 44, 237)', fontFamily: 'Poppins' }}>here</span> to upload!
                        </div> 
                    }
                </label>
                
                <div style={{ display: showImages.length === 0 ? "none" : "flex", width: '100%', flexWrap: 'wrap' }}>
                    {showImages.map((image, id) => (
                        <div className="individual-img-container" key={id}>
                            <div className="delete-btn" onClick={() => handleDeleteImage(id)}>
                                <HiMiniXMark style={{ cursor: 'pointer' }}/>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img src={image.url} alt={`${image.url}-${id}`} />
                            </div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label className="plus-btn" onChange={handleAddImages}>
                            <input type="file" id="input-file" accept="image/*" multiple />
                            +
                        </label>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button className="upload-btn" onClick={uploadReward}>
                    Upload {showImages?.length} files
                </button>
            </div>
        </div>
    )
}