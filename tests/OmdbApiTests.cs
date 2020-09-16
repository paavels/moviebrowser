using Moq;
using libs.Exceptions;
using libs.Dtos;
using libs.Services;
using NUnit.Framework;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using System.Threading;
using Moq.Protected;
using System.Net;

namespace tests
{
    public class OmdbApiTests
    {
        private IOmdbApiService _apiService;
        private Mock<IConfiguration> _configurationMock;
        private Mock<IConfigurationSection> _configurationSectionMock;
        private Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _configurationMock = new Mock<IConfiguration>();
            _configurationSectionMock = new Mock<IConfigurationSection>();
            SetApiKey();
            _configurationMock.Setup(r => r.GetSection(It.IsAny<string>())).Returns(_configurationSectionMock.Object);

            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_httpMessageHandlerMock.Object);

            _apiService = new OmdbApiService(_configurationMock.Object, _httpClient);

        }

        private void ClearApiKey()
        {
            _configurationSectionMock.Setup(r => r.Key).Returns("OMDBApiKey");
            _configurationSectionMock.Setup(r => r.Value).Returns("");
        }

        private void SetApiKey()
        {
            _configurationSectionMock.Setup(r => r.Key).Returns("OMDBApiKey");
            _configurationSectionMock.Setup(r => r.Value).Returns("123");
        }

        [Test]
        public void OmdbApi_GetMovie_EmptyApiKeyShouldFail()
        {
            ClearApiKey();
            Assert.ThrowsAsync<OmdbApiKeyNotFoundExpection>(async () => await _apiService.GetMovie("1234"));
        }

        [Test]
        public void OmdbApi_SearchMovie_EmptyApiKeyShouldFail()
        {
            ClearApiKey();
            Assert.ThrowsAsync<OmdbApiKeyNotFoundExpection>(async () => await _apiService.SearchMovie("2222222222"));
        }

        [Test]
        public void OmdbApi_GetMovie_NoIdShouldFail()
        {
            Assert.ThrowsAsync<OmdbApiNoIdProvidedExpection>(async () => await _apiService.GetMovie(""));
        }

        [Test]
        public void OmdbApi_SearchMovie_LessThan5CharsShouldFail()
        {
            Assert.ThrowsAsync<OmdbApiSearchMustBeLongerExpection>(async () => await _apiService.SearchMovie("22"));
        }

        [Test]
        public void OmdbApi_SearchMovie_ApiCallIsMade()
        {
            // original source: https://gingter.org/2018/07/26/how-to-mock-httpclient-in-your-net-c-unit-tests/

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{'Response':'False', 'Error':'Test error'}"),
                })
                .Verifiable();

            SetApiKey();
            var result = _apiService.GetMovie("1234").Result;

            _httpMessageHandlerMock
                .Protected()
                .Verify(
                    "SendAsync",
                    Times.Exactly(1),
                    ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get),
                    ItExpr.IsAny<CancellationToken>()
                );
        }

        [Test]
        public void OmdbApi_GetMovie_ApiCallIsMade()
        {
            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{'Response':'False', 'Error':'Test error'}"),
                })
                .Verifiable();

            SetApiKey();
            var result = _apiService.GetMovie("1234").Result;

            _httpMessageHandlerMock
                .Protected()
                .Verify(
                    "SendAsync",
                    Times.Exactly(1),
                    ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get),
                    ItExpr.IsAny<CancellationToken>()
                );
        }
    }
}