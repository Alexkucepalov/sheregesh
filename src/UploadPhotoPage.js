import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin-top: 30px;
`;

const UploadBox = styled.div`
  border: 2px dashed #bbb;
  border-radius: 10px;
  width: 50%;
  padding: 50px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: background-color 0.3s;

  &:hover {
    background-color: #eee;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadText = styled.div`
  font-size: 18px;
  color: #888;
  margin-bottom: 20px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #45A049;
  }
`;

const MapContainerStyled = styled.div`
  width: 30%;
  height: 80%;
  position: relative;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const UploadPhotoPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Ошибка при получении постов:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    const formData = new FormData();
    formData.append('author', 1); // Укажите актуальный ID автора
    formData.append('image', file);
    formData.append('likes', 0);
    formData.append('views', 0);

    const token = '548edc3d13dc18e88730f5a5a0e967463acfd241'.replace(/[^\x20-\x7E]/g, ''); // Удаляем любые невалидные символы

    try {
      const response = await fetch('http://localhost:8000/posts/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${token}`, // Проверяем токен на корректность
        },
      });

      if (response.ok) {
        setUploadStatus('Фотография успешно загружена!');
        setShowMap(true); // Показать карту после успешной загрузки
        await fetchPosts(); // Обновить список постов после успешной загрузки
      } else {
        setUploadStatus('Ошибка загрузки фотографии.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setUploadStatus('Ошибка загрузки фотографии.');
    }
  };

  useEffect(() => {
    if (showMap) {
      fetchPosts(); // Загружаем посты только если карта должна быть показана
    }
  }, [showMap]);

  return (
    <UploadContainer>
      <UploadBox onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <UploadInput
          type="file"
          id="upload"
          onChange={handleFileChange}
        />
        <UploadText>
          {file ? `Файл выбран: ${file.name}` : 'Переместите фотографию на поле'}
        </UploadText>
        <label htmlFor="upload">Выберите файл</label>
      </UploadBox>
      <UploadButton onClick={handleUpload}>Загрузить фото</UploadButton>
      {uploadStatus && <p>{uploadStatus}</p>}

      {showMap && (
        <MapContainerStyled>
          <MapContainer center={[52.950112, 87.932473]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {posts.map((post, index) => (
              post.latitude && post.longitude ? (
                <Marker key={index} position={[post.latitude, post.longitude]}>
                  <Popup>
                    <img src={`http://localhost:8000${post.image}`} alt="Uploaded" width="100" />
                    <div>местоположение</div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </MapContainerStyled>
      )}
    </UploadContainer>
  );
};

export default UploadPhotoPage;
