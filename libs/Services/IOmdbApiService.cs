using libs.Dtos;
using System.Threading.Tasks;

namespace libs.Services
{
    public interface IOmdbApiService
    {
        Task<MovieDto> GetMovie(string imdbID);
        Task<MovieListResponseDto> SearchMovie(string search);
    }
}
