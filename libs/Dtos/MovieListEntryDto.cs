using System.Collections.Generic;

namespace libs.Dtos
{
    public class MovieListResponseDto
    {
        public List<MovieListEntryDto> Search { get; set; }

        public bool Response { get; set; }
        public string Error { get; set; }
    }

    public class MovieListEntryDto
    {
        public string Title { get; set; }
        public string Year { get; set; }
        public string imdbID { get; set; }

        public string Type { get; set; }
        public string Poster { get; set; }
    }
}
