import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/search/:search?' component={Home} />
        <Route path='/movie/:imdbID?' component={MovieDetails} />
    </Layout>
);
