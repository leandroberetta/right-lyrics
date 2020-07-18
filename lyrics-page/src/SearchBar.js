import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container'

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            results: []
		};

    }
    render() {
        return (
            <Container className="padding">
                <Form>
                    <FormControl type="text" placeholder="Search for songs" className="mr-sm-2 form-control-lg" onChange={this.props.onSearch}/>              
                </Form>
            </Container>
        );
    }
}

export default SearchBar;