import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import MapComponent from './MapComponent';
import UploadPhotoPage from './UploadPhotoPage'; // Import the new component
import ProfilePage from './ProfilePage'; // Import the new profile component
import logo from './img/logo.svg'; // Ensure the logo file is in this path

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: #C6FF39;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

const Logo = styled.img`
  height: 40px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavItem = styled(Link)`
  margin: 0 15px;
  color: #333;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileIcon = styled.div`
  background-color: #D9D9D9;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SearchBar = styled.input`
  background-color: #fff;
  border: none;
  padding: 10px;
  border-radius: 20px;
  width: 300px;
  margin: 0 20px;
  font-size: 16px;
`;

const Filters = styled.div`
  display: flex;
  justify-content: center;
  background-color: #B95FFF;
  padding: 10px;
`;

const FilterButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
`;

const App = () => {
  return (
    <Router>
      <Container>
        <Header>
          <Logo src={logo} alt="Logo" />
          <SearchBar placeholder="Поиск..." />
          <Nav>
            <NavItem to="/">Карта</NavItem>
            <NavItem to="/upload">Загрузить Фото</NavItem> {/* New menu item */}
            <NavItem to="/profile">Профиль</NavItem> {/* New profile menu item */}
          </Nav>
          <ProfileIcon />
        </Header>
        <Filters>
          <FilterButton>Еда</FilterButton>
          <FilterButton>Кино</FilterButton>
          <FilterButton>Спорт</FilterButton>
          <FilterButton>Музеи</FilterButton>
          <FilterButton>Памятники</FilterButton>
          <FilterButton>Галереи</FilterButton>
        </Filters>
        <Routes>
          <Route path="/" element={<MapComponent />} /> {/* Main map component */}
          <Route path="/upload" element={<UploadPhotoPage />} /> {/* Route to new upload page */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Route to new profile page */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
