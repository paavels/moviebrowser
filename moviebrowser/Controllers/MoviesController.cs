using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using libs.Dtos;
using libs.Services;

namespace moviebrowser.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly ILogger<MoviesController> _logger;
        private readonly IOmdbApiService _apiService;

        public MoviesController(
            IOmdbApiService apiService,
            ILogger<MoviesController> logger)
        {
            _apiService = apiService;
            _logger = logger;
        }

        [HttpGet("{imdbID}")]
        public async Task<MovieDto> Get(string imdbID)
        {
            try
            {
                return await _apiService.GetMovie(imdbID);
            }
            catch (Exception ex)
            {
                return new MovieDto { Response = false, Error = ex.Message };
            }
        }

        [HttpGet("search/{search}")]
        public async Task<MovieListResponseDto> Search(string search)
        {
            try
            {
                return await _apiService.SearchMovie(search);
            }
            catch(Exception ex)
            {
                return new MovieListResponseDto { Response = false, Error = ex.Message };
            }
        }
    }
}
