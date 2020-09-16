import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface MovieDetailsState {
    isLoading: boolean;
    imdbID: string;
    movie: MovieDetailsEntry;
}

export interface MovieDetailsRatingEntry {
    Source: string;
    Value: string;
}

export interface MovieDetailsEntry {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: MovieDetailsRatingEntry[];
    Metascore: string;
    imdbRating: number;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;

    Response: boolean;
    Error: string;
}

// ACTIONS

export interface RequestMovieDetailsAction {
    type: 'REQUEST_MOVIE_DETAILS';
    imdbID: string;
}

export interface ReceiveMovieDetailsAction {
    type: 'RECEIVE_MOVIE_DETAILS';
    imdbID: string;
    movie: MovieDetailsEntry;
}

export interface RequestMovieErrorAction {
    type: 'RECEIVE_MOVIE_DETAILS_ERROR';
    imdbID: string;
}

type KnownAction = RequestMovieDetailsAction | ReceiveMovieDetailsAction | RequestMovieErrorAction;

// ACTION CREATORS

export const actionCreators = {
    loadMovie: (imdbID: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.movieDetails && imdbID !== appState.movieDetails.imdbID) {
            dispatch({ type: 'REQUEST_MOVIE_DETAILS', imdbID: imdbID });

            return fetch(`api/movies/` + imdbID)
                .then(response => response.json() as Promise<MovieDetailsEntry>)
                .then(
                    data => {
                        dispatch({ type: 'RECEIVE_MOVIE_DETAILS', imdbID: imdbID, movie: data });
                    },
                    error => {
                        console.log("Received error", error);
                        dispatch({ type: 'RECEIVE_MOVIE_DETAILS_ERROR', imdbID: imdbID });
                    }
            );
        }
    }
};

// REDUCER

const unloadedState: MovieDetailsState = { isLoading: false, imdbID: "", movie: {} as any };

export const reducer: Reducer<MovieDetailsState> = (state: MovieDetailsState | undefined, incomingAction: Action): MovieDetailsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_MOVIE_DETAILS':
            return {
                imdbID: action.imdbID,
                movie: state.movie,
                isLoading: true
            };
        case 'RECEIVE_MOVIE_DETAILS':
            if (action.imdbID === state.imdbID) {
                return {
                    imdbID: action.imdbID,
                    movie: action.movie,
                    isLoading: false
                };
            }
            break;
        case 'RECEIVE_MOVIE_DETAILS_ERROR':
            if (action.imdbID === state.imdbID) {
                return {
                    imdbID: action.imdbID,
                    movie: { Response: false, Error: "Failed to retrieve data from server" },
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
