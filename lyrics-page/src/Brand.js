import React from 'react';
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'

class Brand extends React.Component {
    render() {
        return (
            <Container className="padding text-center">
                <h1 className="main-color"><FontAwesomeIcon icon={faPlayCircle} /> Right Lyrics</h1>                
            </Container>
        );
    }
}

export default Brand;