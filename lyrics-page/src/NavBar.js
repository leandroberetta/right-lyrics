import React from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import Brand from './Brand';
import SearchBar from './SearchBar';
import UserInfo from './UserInfo';

class NavBar extends React.Component {

    render() {
        var loginSection = null;
        var userSection = null;
        var searchSection = null;
        
        if (this.props.keycloak) {
            if (this.props.authenticated) { 
                loginSection = <Button onClick={() => this.props.keycloak.logout()} className="float-right main-color" variant="link">Logout</Button>;
                userSection = <UserInfo keycloak={this.props.keycloak} />;
                searchSection = <SearchBar onSearch={this.props.onSearch}></SearchBar>;
            } else {
                loginSection = <Button onClick={() => this.props.keycloak.login()} className="float-right main-color" variant="link">Login</Button>;
            }
        } else {
            searchSection = <SearchBar onSearch={this.props.onSearch}></SearchBar>;
        }

        return (
            <Row>
                <Col className="col-12 col-sm-12 col-lg-8 center">
                    <Brand/>
                </Col>
                <Col className="col-12 col-sm-12 col-lg-4 center">
                    { loginSection }                    
                    { userSection }                   
                    { searchSection }
                </Col>
            </Row>
        );
    }
}

export default NavBar;