import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

const MapContainer = styled.div`
  width: 100%;
  height: 70vh;
  position: relative;
  margin-top: 20px;
`;

const UploadPhotoPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

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
      updateMap(data); // Обновить маркеры на карте с новыми данными
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
    formData.append('author', 1); // Replace with the actual author ID or get it dynamically if needed
    formData.append('image', file);
    formData.append('likes', 0);
    formData.append('views', 0);

    try {
      const response = await fetch('http://localhost:8000/posts/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Token ' + '75e7c6ddd85b410f9bc50f74e4d443b6349877d9',
        },
      });

      if (response.ok) {
        setUploadStatus('Фотография успешно загружена!');
        await fetchPosts(); // Обновить список постов после успешной загрузки
      } else {
        setUploadStatus('Ошибка загрузки фотографии.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setUploadStatus('Ошибка загрузки фотографии.');
    }
  };

  const updateMap = (posts) => {
    if (map) {
      // Удаление старых маркеров
      markers.forEach(marker => marker.destroy());
      const newMarkers = [];

      posts.forEach((post) => {
        const marker = new window.mapgl.Marker(map, {
          coordinates: [post.longitude, post.latitude],
          icon: post.image,
          label: { text: 'Загруженная фотография', color: 'blue' },
        });
        newMarkers.push(marker);
      });

      setMarkers(newMarkers); // Сохранение новых маркеров
    }
  };

  useEffect(() => {
    const mapgl = window.mapgl;

    const mapInstance = new mapgl.Map('map', {
      center: [87.932473, 52.950112],
      zoom: 13,
      key: '97350a6c-bdfe-429c-aec8-1b6a724f2053',
      style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
    });

    setMap(mapInstance);
    fetchPosts(); // Загрузка постов при инициализации карты

    return () => {
      mapInstance.destroy();
    };
  }, []);

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
      <MapContainer id="map"></MapContainer>
    </UploadContainer>
  );
};

export default UploadPhotoPage;
    