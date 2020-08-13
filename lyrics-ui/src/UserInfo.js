import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

class UserInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            email: null,
            id: null
        };

        this.props.keycloak.loadUserInfo().then(userInfo => {
            this.setState({
                name: userInfo.name,
                email: userInfo.email,
                id: userInfo.sub
            })
        });
    }

    render() {
        return ( <
            div >
            <
            Button className = "float-right main-color"
            variant = "link"
            disabled > { this.state.name } < /Button> <
            /div>
        );
    }
}
export default UserInfo;