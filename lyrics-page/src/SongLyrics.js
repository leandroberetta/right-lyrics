import React from 'react';
import MDReactComponent from 'markdown-react-js';

class SongLyrics extends React.Component {

    handleIterate(Tag, props, children, level) {
        if (Tag === 'p') {
            props = {
                ...props,
                style: {fontStyle: "italic"}
            };
        }

        return <Tag {...props}>{children}</Tag>;
    }

    render() {
        return (
            <div style={{borderLeft: "5px solid #5E548E", paddingLeft: "10px"}}>
                <MDReactComponent text={this.props.lyrics} onIterate={this.handleIterate} />
            </div>
        );
    }
}

export default SongLyrics;