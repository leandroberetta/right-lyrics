import React from 'react';
import Brand from './Brand';
import SearchBar from './SearchBar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class NavBar extends React.Component {
    render() {
        return (
            <Row>
                <Col className="col-12 col-sm-8 center">
                    <Brand/>
                </Col>
                <Col className="col-12 col-sm-4 center">
                    <SearchBar onSearch={this.props.onSearch}></SearchBar>
                </Col>
            </Row>
        );
    }
}

export default NavBar;