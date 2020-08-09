import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

class SearchBar extends React.Component {
    render() {
        return (
            <Form>
                <FormControl type="text" placeholder="Search for songs" className="mr-sm-2 form-control-md" onChange={this.props.onSearch}/>              
            </Form>
        );
    }
}

export default SearchBar;