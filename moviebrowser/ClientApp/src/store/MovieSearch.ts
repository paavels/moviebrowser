import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface MovieSearchHistoryRecord {
    id: number;
    searchTerm: string;
}

export interface MovieSearchState {
    isLoading: boolean;
    isSearchValid: boolean;
    search?: string;
    searchInput: string;
    results: MovieListResponse;
    searchHistory: MovieSearchHistoryRecord[];
}

export interface MovieListResponse {
    Search: MovieListEntry[];

    Response: boolean;
    Error?: string;
}

export interface MovieListEntry {
    imdbID: string;
    Title: string;
    Year: string,
    Type: string;
    Poster: string;
}

// ACTIONS

export interface InvalidateSearchAction {
    type: 'INVALIDATE_SEARCH';
}

export interface SearchTextChangedAction {
    type: 'SEARCH_CHANGED';
    search: string;
}

export interface SearchMoviesAction {
    type: 'SEARCH_MOVIES';
    search: string;
}

export interface ReceiveSearchResultsAction {
    type: 'RECEIVE_MOVIE_SEARCH_RESULTS';
    search: string;
    results: MovieListResponse;
}

export interface ReceiveSearchErrorAction {
    type: 'RECEIVE_MOVIE_SEARCH_ERROR';
    search: string;
}

type KnownAction = SearchMoviesAction | ReceiveSearchResultsAction | SearchTextChangedAction | InvalidateSearchAction | ReceiveSearchErrorAction;

// ACTION CREATORS

export const actionCreators = {
    updateSearchValue: (search: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'SEARCH_CHANGED', search: search } );
    },

    invalidateSearch: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'INVALIDATE_SEARCH' });
    },

    searchMovies: (search: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.movieSearch && search !== appState.movieSearch.search) {

            dispatch({ type: 'SEARCH_MOVIES', search: search });

            return fetch(`api/movies/search/` + search)
                .then(response => response.json() as Promise<MovieListResponse>)
                .then(
                    data => {
                        dispatch({ type: 'RECEIVE_MOVIE_SEARCH_RESULTS', search: search, results: data });
                    },
                    error => {
                        console.log("Received error", error);
                        dispatch({ type: 'RECEIVE_MOVIE_SEARCH_ERROR', search: search });
                    }
                );
        }
    }
};

// REDUCER

const unloadedState: MovieSearchState = { results: { Response: false, Search: [] }, isLoading: false, searchInput: "", searchHistory: [], isSearchValid: true };

export const reducer: Reducer<MovieSearchState> = (state: MovieSearchState | undefined, incomingAction: Action): MovieSearchState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'INVALIDATE_SEARCH':
            return {
                searchInput: state.searchInput,
                search: state.search,
                results: state.results,
                isLoading: state.isLoading,
                searchHistory: state.searchHistory,
                isSearchValid: false
            }
        case 'SEARCH_CHANGED':
            return {
                searchInput: action.search,
                search: state.search,
                results: state.results,
                isLoading: state.isLoading,
                searchHistory: state.searchHistory,
                isSearchValid: state.isSearchValid
            }
        case 'SEARCH_MOVIES':

            // not really sure if saving here would be best place and if localStorage would not be better
            // solution, but requirements did not define how persistent the storage should be :)

            let newId: number = 0;
            if (state.searchHistory.length > 0) newId = state.searchHistory[state.searchHistory.length - 1].id + 1;

            let found: boolean = false;
            state.searchHistory.forEach((v) => {
                if (v.searchTerm == action.search) found = true; 
            });

            // you can eliminate duplicates here otherwise nasty side effect occurs
            // where your history can consist of two searches only if you do it intentionally
            // like case of 12345, 54321, 12345, 54321, 12345

            //if (!found) {
                state.searchHistory.push({ id: newId, searchTerm: action.search });
                state.searchHistory.splice(0, state.searchHistory.length - 5);
            //}

            return {
                search: action.search,
                searchInput: action.search ?? "",
                results: state.results,
                isLoading: true,
                searchHistory: state.searchHistory,
                isSearchValid: true
            };
        case 'RECEIVE_MOVIE_SEARCH_RESULTS':
            if (action.search === state.search) {
                return {
                    search: action.search,
                    searchInput: action.search,
                    results: action.results,
                    isLoading: false,
                    searchHistory: state.searchHistory,
                    isSearchValid: true
                };
            }
            break;
        case 'RECEIVE_MOVIE_SEARCH_ERROR':
            if (action.search === state.search) {
                return {
                    search: action.search,
                    searchInput: action.search,
                    results: { Response: false, Error: "Failed to retrieve data from server", Search: [] },
                    isLoading: false,
                    searchHistory: state.searchHistory,
                    isSearchValid: true
                };
            }
            break;
    }

    return state;
};
