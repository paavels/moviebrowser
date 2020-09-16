import * as React from 'react';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import App from '../App';
import Home from '../components/Home';
import MovieDetails from '../components/MovieDetails';
import * as MovieDetailsStore from '../store/MovieDetails';
import * as MovieSearchStore from '../store/MovieSearch';

let searchTestResult: MovieSearchStore.MovieListResponse = { Response: true, Error: "123", Search: [] };

let detailsTestResult: MovieDetailsStore.MovieDetailsEntry = {
    Actors: "",
    Awards: "",
    BoxOffice: "",
    Country: "",
    Director: "",
    DVD: "",
    Error: "",
    Genre: "",
    imdbID: "test",
    imdbRating: 9.9,
    imdbVotes: "",
    Language: "",
    Metascore: "",
    Plot: "",
    Poster: "",
    Production: "",
    Rated: "",
    Ratings: [],
    Released: "",
    Response: true,
    Runtime: "",
    Title: "test",
    Type: "",
    Website: "",
    Writer: "",
    Year: "2020"
};

describe('render tests', () => {

    function getStore() {
        const storeFake = (state: any) => ({
            default: () => { },
            subscribe: () => { },
            dispatch: () => { },
            getState: () => ({ ...state })
        });
        const store = storeFake({}) as any;

        return store;
    }

    it('app renders', () => {
        shallow(<Provider store={getStore()}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>);
    });

    it('movie details renders', () => {
        mount(
            <Provider store={getStore()}>
                <MemoryRouter>
                    <MovieDetails />
                </MemoryRouter>
            </Provider>
        );
    });

    it('search page renders', () => {
        mount(
            <Provider store={getStore()}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>
        );
    });

    it('search page should contain search button', () => {
        let obj = mount(
            <Provider store={getStore()}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>
        );

        expect(obj.find('button#search_button')).toHaveLength(1);
    });

    it('search page should contain search text', () => {
        let obj = mount(
            <Provider store={getStore()}>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </Provider>
        );

        expect(obj.find('input#search')).toHaveLength(1);
    });

});

describe('state tests', () => {

    it('search page default state is correct set', () => {
        var state = MovieSearchStore.reducer(undefined, {} as any);

        expect(state.isLoading).toEqual(false);
        expect(state.isSearchValid).toEqual(true);
        expect(state.search).toBeUndefined();
        expect(state.searchInput).toEqual("");
        expect(state.results).toBeDefined();
        expect(state.results.Response).toEqual(false);
        expect(state.results.Search).toHaveLength(0);
    });

    it('search page INVALIDATE_SEARCH state sets flag correctly', () => {
        var state = MovieSearchStore.reducer(
            {} as MovieSearchStore.MovieSearchState,
            { type: 'INVALIDATE_SEARCH' } as MovieSearchStore.InvalidateSearchAction);

        expect(state.isSearchValid).toEqual(false);
    });

    it('search page SEARCH_CHANGED state set value correctly', () => {
        var state = MovieSearchStore.reducer(
            {} as MovieSearchStore.MovieSearchState,
            { type: 'SEARCH_CHANGED', search: 'test' } as MovieSearchStore.SearchTextChangedAction);

        expect(state.searchInput).toEqual('test');
    });

    it('search page SEARCH_MOVIES state set isLoading correctly', () => {
        var state = MovieSearchStore.reducer(
            { searchHistory: [] as any } as MovieSearchStore.MovieSearchState,
            { type: 'SEARCH_MOVIES', search: 'test' } as MovieSearchStore.SearchMoviesAction);

        expect(state.isLoading).toEqual(true);
    });

    it('search page RECEIVE_MOVIE_SEARCH_RESULTS state sets values correctly', () => {
        var state = MovieSearchStore.reducer(
            { search: 'test' } as MovieSearchStore.MovieSearchState,
            { type: 'RECEIVE_MOVIE_SEARCH_RESULTS', search: 'test', results: searchTestResult } as MovieSearchStore.ReceiveSearchResultsAction);

        expect(state.isLoading).toEqual(false);
        expect(state.results).toEqual(searchTestResult);
    });

    it('movie details RECEIVE_MOVIE_SEARCH_ERROR state sets values correctly', () => {
        var state = MovieSearchStore.reducer(
            { search: 'test' } as MovieSearchStore.MovieSearchState,
            { type: 'RECEIVE_MOVIE_SEARCH_ERROR', search: 'test' } as MovieSearchStore.ReceiveSearchErrorAction);

        expect(state.isLoading).toEqual(false);
        expect(state.results.Response).toEqual(false);
        expect(state.results.Error).toBeDefined();
    });

    it('movie details REQUEST_MOVIE_DETAILS state set isLoading correctly', () => {
        var state = MovieDetailsStore.reducer(
            {} as MovieDetailsStore.MovieDetailsState,
            { type: 'REQUEST_MOVIE_DETAILS', imdbID: 'test' } as MovieDetailsStore.RequestMovieDetailsAction);

        expect(state.isLoading).toEqual(true);
    });

    it('movie details RECEIVE_MOVIE_DETAILS state sets values correctly', () => {
        var state = MovieDetailsStore.reducer(
            { imdbID: 'test' } as MovieDetailsStore.MovieDetailsState,
            { type: 'RECEIVE_MOVIE_DETAILS', imdbID: 'test', movie: detailsTestResult } as MovieDetailsStore.ReceiveMovieDetailsAction);

        expect(state.isLoading).toEqual(false);
        expect(state.movie).toEqual(detailsTestResult);
    });

    it('movie details RECEIVE_MOVIE_DETAILS_ERROR state sets values correctly', () => {
        var state = MovieDetailsStore.reducer(
            { imdbID: 'test' } as MovieDetailsStore.MovieDetailsState,
            { type: 'RECEIVE_MOVIE_DETAILS_ERROR', imdbID: 'test' } as MovieDetailsStore.RequestMovieErrorAction);

        expect(state.isLoading).toEqual(false);
        expect(state.movie.Response).toEqual(false);
        expect(state.movie.Error).toBeDefined();
    });

});


describe('async actions', () => {

    const middlewares = [thunk]
    const mockStore = configureStore(middlewares)

    afterEach(() => {
        fetchMock.restore()
    })

    it('invalidateSearch() triggers INVALIDATE_SEARCH', () => {
        let expectedActions = [{ type: "INVALIDATE_SEARCH" }];
        const store = mockStore({});

        store.dispatch(MovieSearchStore.actionCreators.invalidateSearch());

        var result = store.getActions();
        expect(result).toEqual(expectedActions);
    });

    it('updateSearchValue() triggers SEARCH_CHANGED', () => {
        let expectedActions = [{ type: "SEARCH_CHANGED", search: "test" }];
        const store = mockStore({});

        store.dispatch(MovieSearchStore.actionCreators.updateSearchValue("test"));

        var result = store.getActions();
        expect(result).toEqual(expectedActions);
    });

    it('searchMovies() triggers correct actions', () => {

        fetchMock.getOnce('api/movies/search/1', {
            body: searchTestResult,
            headers: { 'content-type': 'application/json' }
        })

        const expectedActions = [
            { type: 'SEARCH_MOVIES', search: "1" },
            { type: 'RECEIVE_MOVIE_SEARCH_RESULTS', search: "1", results: searchTestResult }
        ]
        const store = mockStore({ movieSearch: { search: "2" } });

        store.dispatch(MovieSearchStore.actionCreators.searchMovies("1")).then(() => {
            var result = store.getActions();
            expect(result).toEqual(expectedActions)
        });
    });

    it('loadMovie() triggers correct actions', () => {
        fetchMock.getOnce('api/movies/1', {
            body: detailsTestResult,
            headers: { 'content-type': 'application/json' }
        })

        const expectedActions = [
            { type: 'REQUEST_MOVIE_DETAILS', imdbID: "1" },
            { type: 'RECEIVE_MOVIE_DETAILS', imdbID: "1", movie: detailsTestResult }
        ]
        const store = mockStore({ movieDetails: { imdbID: "2" } });

        store.dispatch(MovieDetailsStore.actionCreators.loadMovie("1")).then(() => {
            var result = store.getActions();
            expect(result).toEqual(expectedActions)
        });
    });


})