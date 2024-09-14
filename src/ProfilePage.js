import React, { useState } from 'react';
import styled from 'styled-components';
import logo from './img/Mask group.svg'; // Replace with the correct path
import gridIcon from './img/Group 2085662233.svg'; // Replace with the correct path
import searchIcon from './img/Group 2085662232.svg'; // Replace with the correct path
import userIcon from './img/Group 2085662231.svg'; // Replace with the correct path
import addIcon from './img/Group 2085662234.svg'; // Replace with the correct path
import profilePic from './img/photo_2024-09-13_22-50-16.jpg'; // Replace with the correct path
import mapSample from './img/maps1.png'; // Replace with the correct path

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const Icons = styled.div`
  display: flex;
  gap: 15px;
`;

const Icon = styled.img`
  height: 24px;
  cursor: pointer;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProfilePic = styled.div`
  margin-bottom: 20px;
`;

const ProfilePicImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ProfileMap = styled.div`
  width: 100%;
  max-width: 600px;
`;

const ProfileMapImg = styled.img`
  width: 100%;
  height: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const Button = styled.button`
  background-color: #C6FF39;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;

  &:hover {
    background-color: #A4E137;
  }
`;

const GalleryContainer = styled.div`
  flex: 1;
  padding: 20px;
  padding-bottom: 70px; /* Added padding to account for margin below */
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 columns
  gap: 20px; // Adjust spacing between photos
`;

const PhotoSlot = styled.div`
  width: 400px; // Updated size
  height: 400px; // Updated size
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Modal = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 500px;
  width: 80%;
  margin: auto;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const PhotoViewModal = ({ show, onClose, photo }) => (
  <Modal show={show}>
    <ModalContent>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <img src={photo} alt="Viewed" style={{ width: '100%' }} />
    </ModalContent>
  </Modal>
);

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos([...photos, event.target.result]);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="Logo" />
        <Title>по следам россии</Title>
        <Icons>
          <Icon src={gridIcon} alt="Grid" />
          <Icon src={searchIcon} alt="Search" />
          <Icon src={userIcon} alt="User" />
          <Icon src={addIcon} alt="Add" onClick={() => setShowModal(true)} />
        </Icons>
      </Header>

      <Profile>
        <ProfilePic>
          <ProfilePicImg src={profilePic} alt="Profile" />
        </ProfilePic>
        <ProfileInfo>
          <h1>Оля Останина</h1>
          <p>Россия, такая обл., такой город</p>
        </ProfileInfo>
        <ProfileMap>
        </ProfileMap>
        <ButtonsContainer>
          <Button onClick={() => setShowModal(true)}>Добавить место</Button>
          <Button>Мои баллы</Button>
        </ButtonsContainer>
      </Profile>

      <GalleryContainer>
        <PhotoGrid>
          {photos.map((photo, index) => (
            <PhotoSlot key={index} onClick={() => setCurrentPhoto(photo)}>
              <PhotoImg src={photo} alt={`Photo ${index}`} />
            </PhotoSlot>
          ))}
        </PhotoGrid>
      </GalleryContainer>

      <PhotoViewModal
        show={Boolean(currentPhoto)}
        onClose={() => setCurrentPhoto(null)}
        photo={currentPhoto}
      />

      {/* Upload Photo Modal */}
      <Modal show={showModal} onClick={() => setShowModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
          <h2>Добавить фотографию</h2>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
