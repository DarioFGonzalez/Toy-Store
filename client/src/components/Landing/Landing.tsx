import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () =>
{

    return(
        <div>
            Soy la LANDING PAGE
            <Link to='/home'> HOME </Link>
        </div>
    )
};