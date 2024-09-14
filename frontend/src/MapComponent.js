import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import logo from './img/logo.svg'; // Ensure the logo file is in this path
import photo1 from './img/photo1.jpg';
import photo2 from './img/photo2.jpg';

const Container = styled.div`
  width: 100vw; // Correcting the typo from 100vр to 100vw
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; // To prevent any potential horizontal scrolling
`;


const MapContainer = styled.div`
  width: 100%;
  height: 70vh;
  position: relative;
`;

const GeoButton = styled.button`
  position: absolute;
  top: 150px;
  left: 20px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;

  &:hover {
    background-color: #45A049;
  }
`;

const PhotosModal = styled.div`
  width: 60vw;
  max-width: 800px;
  height: 70vh;
  background-color: white;
  position: fixed;
  right: 0;
  top: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: -2px 0px 20px rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 15px;
  z-index: 1000;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #FF5C5C;
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
  margin: 10px 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
  max-width: 80%;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  .slick-slide img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

const PhotoBlocksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1300px;
  margin-top: 30px;
`;

const PhotoBlock = styled.div`
  width: 417px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;

`;

const BlockButton = styled.button`
  margin-top: -20px;
  padding: 10px 20px;
  background-color: white;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  background-color: #C6FF39;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const locations = [
    {
      coordinates: [87.932473, 52.950112],
      photos: [photo1, photo2],
      title: 'Место 1',
      description: 'Описание места 1. Здесь можно подробно описать, что интересного можно увидеть и сделать в этом месте.',
    },
    {
      coordinates: [87.956106, 52.95057],
      photos: [photo1, photo2],
      title: 'Место 2',
      description: 'Описание места 2. Подробности о достопримечательностях и активностях, которые можно сделать в этом месте.',
    },
  ];

  useEffect(() => {
    const mapgl = window.mapgl;

    const mapInstance = new mapgl.Map('map', {
      center: [87.932473, 52.950112],
      zoom: 13,
      key: '97350a6c-bdfe-429c-aec8-1b6a724f2053',
      style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
    });

    locations.forEach((location) => {
      const marker = new mapgl.Marker(mapInstance, {
        coordinates: location.coordinates,
      });

      marker.on('click', () => {
        setSelectedLocation(location);
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

  return (
    <Container>
      <MapContainer id="map"></MapContainer>
      <GeoButton onClick={geoFindMe}>Моё местоположение</GeoButton>

      {selectedLocation && (
        <PhotosModal>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <Title>{selectedLocation.title}</Title>
          <Description>{selectedLocation.description}</Description>
          <StyledSlider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
          >
            {selectedLocation.photos.map((photo, index) => (
              <div key={index}>
                <PhotoImage src={photo} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </StyledSlider>
        </PhotosModal>
      )}

      <PhotoBlocksContainer>
        <PhotoBlock>
          <PhotoImage src={photo1} alt="Photo 1" />
          <BlockButton>Получить</BlockButton>
        </PhotoBlock>
        <PhotoBlock>
          <PhotoImage src={photo2} alt="Photo 2" />
          <BlockButton>Участвовать</BlockButton>
        </PhotoBlock>
        <PhotoBlock>
          <PhotoImage src={photo1} alt="Photo 3" />
          <BlockButton>Получить</BlockButton>
        </PhotoBlock>
      </PhotoBlocksContainer>
    </Container>
  );
};

export default MapComponent;
