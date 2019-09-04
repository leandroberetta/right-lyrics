import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

class NavBar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">Right Lyrics</Navbar.Brand>                    
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;