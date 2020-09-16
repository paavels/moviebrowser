using Microsoft.Extensions.Configuration;
using libs.Dtos;
using libs.Exceptions;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace libs.Services
{
    public class OmdbApiService : IOmdbApiService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public OmdbApiService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<MovieDto> GetMovie(string imdbID)
        {
            if (string.IsNullOrEmpty(imdbID)) throw new OmdbApiNoIdProvidedExpection("imdbID not provided");

            string apiLink = GetApiLink() + $"&i={imdbID}";

            MovieDto result = new MovieDto();
            using (var response = await _httpClient.GetAsync(apiLink))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                result = JsonConvert.DeserializeObject<MovieDto>(apiResponse);
            }
            return result;
        }

        public async Task<MovieListResponseDto> SearchMovie(string search)
        {
            if (search.Length < 5) throw new OmdbApiSearchMustBeLongerExpection("Search must contain at least 5 characters");

            string apiCall = GetApiLink() + $"&s={search}";

            MovieListResponseDto result = new MovieListResponseDto();
            using (var response = await _httpClient.GetAsync(apiCall))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                result = JsonConvert.DeserializeObject<MovieListResponseDto>(apiResponse);
            }

            return result;
        }

        private string GetApiLink()
        {
            // no secrets here :)
            // https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1&tabs=windows

            string apiKey = _configuration.GetSection("OMDBApiKey")?.Value;

            if (string.IsNullOrEmpty(apiKey)) throw new OmdbApiKeyNotFoundExpection("OMDBApiKey not defined in configuration file");

            return $"http://www.omdbapi.com/?apikey=" + apiKey;
        }
    }
}
