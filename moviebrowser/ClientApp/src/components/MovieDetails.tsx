import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as MovieDetailsStore from '../store/MovieDetails';

type MovieDetailsProps =
    MovieDetailsStore.MovieDetailsState 
    & typeof MovieDetailsStore.actionCreators 
    & RouteComponentProps<{ imdbID: string }>; 

class MovieDetails extends React.PureComponent<MovieDetailsProps> {

    public componentDidMount() {
        this.loadData();
    }

    public componentDidUpdate() {
        this.loadData();
    }

    private loadData() {
        let imdbID = this.props.match?.params?.imdbID;
        if (imdbID) this.props.loadMovie(imdbID);
    }

    public render() {
        if (this.props.isLoading) {
            return (
                <div>
                    <Row>
                        <Col>
                            <p className="text-center">Movie details is loading...</p>
                        </Col>
                    </Row>
                </div>
            );
        }

        const movie = this.props.movie;

        if (!movie || !movie.Response) {
            return (
                <div>
                    <Row>
                        <Col>
                            <p className="text-center">{movie && movie.Error ? movie.Error : "Unknown error occured during load"} </p>
                        </Col>
                    </Row>
                </div>
            );
        }

        let shortDescription: string = "";

        shortDescription += (movie.Rated    ? (shortDescription !== "" ? "&nbsp;|&nbsp;" : "") + movie.Rated : "");
        shortDescription += (movie.Runtime  ? (shortDescription !== "" ? "&nbsp;|&nbsp;" : "") + movie.Runtime : "");
        shortDescription += (movie.Genre    ? (shortDescription !== "" ? "&nbsp;|&nbsp;" : "") + movie.Genre : "");
        shortDescription += (movie.Released ? (shortDescription !== "" ? "&nbsp;|&nbsp;" : "") + movie.Released : "");

        return (
            <div>
                <Row>
                    <Col xs="9">
                        <h1>{movie.Title} {movie.Year && <small> ({movie.Year})</small>}</h1>
                        <small dangerouslySetInnerHTML={{ __html: shortDescription }}></small>


                    </Col>
                    <Col xs="3">
                        {movie.imdbRating ? <h3 className="text-right">{movie.imdbRating}/<small>10</small></h3> : ""}
                        <div className="text-right">{movie.imdbVotes}</div>
                    </Col>
                </Row>
                <Row>
                    <Col xs="7">
                        {this.renderMovieDetails(movie)}
                        {this.renderMovieRatings(movie.Ratings)}

                    </Col>
                    <Col xs="5">
                        {movie.Poster ? <img src={movie.Poster} title={movie.Title} alt={movie.Title} className="img-thumbnail float-right" /> : ""}
                    </Col>
                </Row>
            </div>
        );


    }

    private renderMovieDetails(movie: MovieDetailsStore.MovieDetailsEntry) {
        return (
            <div style={{ marginTop: 10 }}>
                <button />
                <p>{movie.Plot}</p>

                <dl className="row">
                    <dt className="col-sm-3">Director</dt>
                    <dd className="col-sm-9">{movie.Director}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Writer</dt>
                    <dd className="col-sm-9">{movie.Writer}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Actors</dt>
                    <dd className="col-sm-9">{movie.Actors}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Language</dt>
                    <dd className="col-sm-9">{movie.Language}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Country</dt>
                    <dd className="col-sm-9">{movie.Country}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Awards</dt>
                    <dd className="col-sm-9">{movie.Awards}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Metascore</dt>
                    <dd className="col-sm-9">{movie.Metascore}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Type</dt>
                    <dd className="col-sm-9">{movie.Type}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">DVD</dt>
                    <dd className="col-sm-9">{movie.DVD}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">BoxOffice</dt>
                    <dd className="col-sm-9">{movie.BoxOffice}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Production</dt>
                    <dd className="col-sm-9">{movie.Production}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-sm-3">Website</dt>
                    <dd className="col-sm-9">{movie.Website}</dd>
                </dl>
            </div>
        );
    }

    private renderMovieRatings(ratings: MovieDetailsStore.MovieDetailsRatingEntry[]) {
        if (!ratings || !ratings.length) {
            return (
                <p>Movie have not received any ratings</p>
            );
        }

        return (
            <div>
                Ratings:
                <ul>
                    {ratings.map((rating: MovieDetailsStore.MovieDetailsRatingEntry, i) =>
                        <li key={i}>
                            {rating.Source} : {rating.Value}
                        </li>
                    )}
                </ul>
            </div>
        );
    }


}

export default connect(
    (state: ApplicationState) => state.movieDetails,
    MovieDetailsStore.actionCreators
)(MovieDetails as any);
