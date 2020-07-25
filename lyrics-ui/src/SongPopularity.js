import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidFaStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularFaStar } from '@fortawesome/free-regular-svg-icons'


class SongPopularity extends React.Component {
    render() {
        var blackStars = [];
        var whiteStars = [];

        for (var i=0; i<this.props.popularity; i++)
            blackStars.push(i);

        for (i=0; i<(5-this.props.popularity); i++)
            whiteStars.push(i);
        
        return (
            <div className="float-right">
                { 
                    blackStars.map(pop => (
                        <FontAwesomeIcon key={pop} icon={solidFaStar} className="secondary-color" size="lg"/>  
                    ))
                }
                {
                    whiteStars.map(pop => (
                        <FontAwesomeIcon key={pop} icon={regularFaStar} className="secondary-color" size="lg"/>  
                    ))
                }
            </div>           
        );
    }
}

export default SongPopularity;