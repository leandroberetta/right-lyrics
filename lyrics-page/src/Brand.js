import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'

class Brand extends React.Component {
    render() {
        return (
            <h1 className="main-color"><FontAwesomeIcon icon={faPlayCircle} /> Right Lyrics</h1>                
        );
    }
}

export default Brand;