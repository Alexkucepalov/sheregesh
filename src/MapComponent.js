import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PhotosModal = styled.div`
  width: 400px;
  height: 100%;
  background-color: white;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  font-size: 16px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
`;

const Photo = styled.img`
  width: 80%;
  height: auto;
  margin-bottom: 20px;
  object-fit: cover;
`;

const NavButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 10px;
`;

const GeoButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  font-size: 16px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 20;
`;

const MapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [map, setMap] = useState(null);

  const locations = [
    {
      coordinates: [87.932473, 52.950112],
      photos: [
        'https://via.placeholder.com/400x100',
        'https://via.placeholder.com/400x200',
        'https://via.placeholder.com/400x300',
      ],
    },
    {
      coordinates: [87.956106, 52.95057],
      photos: [
        'https://via.placeholder.com/400x100',
        'https://via.placeholder.com/400x200',
        'https://via.placeholder.com/400x300',
      ],
    },
  ];

  useEffect(() => {
    const mapgl = window.mapgl;

    const mapInstance = new mapgl.Map('map', {
      center: [87.932473, 52.950112],
      zoom: 11,
      key: 'dfa042d5-5608-43fe-b209-f870f5c8d91a',
      style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
    });

    locations.forEach((location) => {
      const marker = new mapgl.Marker(mapInstance, {
        coordinates: location.coordinates,
      });

      marker.on('click', () => {
        setSelectedLocation(location);
        setCurrentPhotoIndex(0);
      });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.destroy();
    };
  }, []);

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = [pos.coords.longitude, pos.coords.latitude];
          map.setCenter(center);

          new window.mapgl.Marker(map, {
            coordinates: center,
            icon: 'https://via.placeholder.com/30x30',
            label: { text: 'Вы здесь', color: 'blue' },
          });
        },
        () => {
          alert('Не удалось определить местоположение');
        }
      );
    }
  };

  const closeModal = () => {
    setSelectedLocation(null);
  };

  const nextPhoto = () => {
    if (selectedLocation) {
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex < selectedLocation.photos.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const prevPhoto = () => {
    if (selectedLocation) {
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : selectedLocation.photos.length - 1
      );
    }
  };

  return (
    <Container>
      <MapContainer id="map"></MapContainer>
      <GeoButton onClick={geoFindMe}>Моё местоположение</GeoButton>

      {selectedLocation && (
        <PhotosModal>
          <CloseButton onClick={closeModal}>Закрыть</CloseButton>

          <Photo
            src={selectedLocation.photos[currentPhotoIndex]}
            alt={`Photo ${currentPhotoIndex + 1}`}
          />

          <div>
            <NavButton onClick={prevPhoto}>Назад</NavButton>
            <NavButton onClick={nextPhoto}>Вперед</NavButton>
          </div>
        </PhotosModal>
      )}
    </Container>
  );
};

export default MapComponent;
