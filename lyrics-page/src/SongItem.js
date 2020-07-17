import React from 'react';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidFaStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularFaStar } from '@fortawesome/free-regular-svg-icons'


class SongItem extends React.Component {

    componentDidMount() {
        console.log("llamar al album service");
    }

    render() {
        var blackStars = [];
        var whiteStars = [];

        for (var i=0; i<this.props.song.popularity; i++)
            blackStars.push(i);

        for (var i=0; i<(5-this.props.song.popularity); i++)
            whiteStars.push(i);

        return (
            <Media key={this.props.song.id} className="my-4" as="li">
                <img src={process.env.PUBLIC_URL + '/icon64.png'} className="mr-3" alt="..."></img>
                <Media.Body>
                    <Row>
                        <Col>
                            <h5 className="mt-0 mb-1"><a onClick={this.props.onSelectSong.bind(this, this.props.song)} className="text-dark" href="#">{this.props.song.name}</a></h5>
                            <p>{this.props.song.artist}</p>
                        </Col>
                        <Col>
                        <div className="float-right">
                            { 
                                blackStars.map(pop => (
                                    <FontAwesomeIcon icon={solidFaStar} />  
                                ))
                            }
                            {
                                 whiteStars.map(pop => (
                                    <FontAwesomeIcon icon={regularFaStar} />  
                                ))
                            }
                        </div>
                        </Col>
                    </Row>
                </Media.Body>
            </Media>
        );
    }
}

export default SongItem;