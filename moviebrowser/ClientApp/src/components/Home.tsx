import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, InputGroup, InputGroupAddon, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as MovieSearchStore from '../store/MovieSearch';

type MovieSearchProps =
    MovieSearchStore.MovieSearchState 
    & typeof MovieSearchStore.actionCreators 
    & RouteComponentProps<{ search: string }>; 

class Home extends React.PureComponent<MovieSearchProps> {

    public componentDidMount() {
        this.loadData();
    }

    public componentDidUpdate() {
        this.loadData();
    }

    private loadData() {
        let searchParam = this.props.match?.params?.search;
        if (searchParam) this.props.searchMovies(searchParam);
    }

    private searchInputChanged(event: React.FormEvent<HTMLInputElement>) {
        this.props.updateSearchValue(event.currentTarget.value);
    }

    private validate(): boolean {
        if (this.props.searchInput.length < 5) return false;
        return true;
    }

    private doSearch(event: React.FormEvent<HTMLFormElement>) {
        if (this.validate()) {
            this.props.searchMovies(this.props.searchInput);
            this.props.history.push({ pathname: '/search/' + this.props.searchInput, state: { search: this.props.search } });
        } else {
            this.props.invalidateSearch();
        }
        event.preventDefault();
    }

    public render() {
        return (
            <div>
                <Row>
                    <Col>
                        {this.renderSearchBar()}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.renderResults()}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.renderSearchHistory()}
                    </Col>
                </Row>
            </div>
        );
    }

    private renderSearchBar() {
        return (
            <Form onSubmit={evt => this.doSearch(evt)}>
                <InputGroup>
                    <Input invalid={!this.props.isSearchValid} id="search" name="search" value={this.props.searchInput} onChange={evt => this.searchInputChanged(evt)} placeholder="Search for movies.." />
                    <InputGroupAddon addonType="prepend"><Button id="search_button" disabled={this.props.isLoading} className="btn btn-primary"> Search</Button></InputGroupAddon>
                </InputGroup>
            </Form>
        );
    }

    private renderResults() {
        let rows;

        if (!this.props.search) {
            return (
                <p className="text-center">Use searchbar to search for movies! Minimum 5 characters required</p>
            );
        }

        if (this.props.isLoading) {
            rows = <tr><td colSpan={4} className="text-center">Loading...</td></tr>;
        } else if (!this.props.results.Response) {
            rows = <tr><td colSpan={4} className="text-center">{this.props.results.Error}</td></tr>;
        } else if (this.props.results.Search) {
            rows = this.props.results.Search.map((movie: MovieSearchStore.MovieListEntry) => 
                <tr key={movie.imdbID}>
                    <td className="text-center">
                        {movie.Poster && movie.Poster !== 'N/A' ? <img src={movie.Poster} alt="{movie.Title}" title="{movie.Title}" className="img-thumbnail" width="50" height="50" /> : ''}
                    </td>
                    <td style={{ width: '60%' }}><Link to={`/movie/${movie.imdbID}`}>{movie.Title}</Link></td>
                    <td className="text-right">{movie.Year}</td>
                    <td>{movie.Type}</td>
                </tr>
            );
        }

        return (
            <div>
                <p>Showing results for <strong>"{this.props.search}"</strong></p>
                <Table bordered hover className="table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th>&nbsp;</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>
        );
    }

    private renderSearchHistory() {
        if (!this.props.searchHistory?.length) return <div></div>;

        return (
            <div>
                <p>Your search history:</p>
                <ul>
                    {this.props.searchHistory.map((r: MovieSearchStore.MovieSearchHistoryRecord) => <li key={r.id}><Link to={`/search/${r.searchTerm}`}>{r.searchTerm}</Link></li>)}
                </ul>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.movieSearch,
    MovieSearchStore.actionCreators
)(Home as any);
