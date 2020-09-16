using System;

namespace libs.Exceptions
{
    public class OmdbApiKeyNotFoundExpection : Exception
    {
        public OmdbApiKeyNotFoundExpection(string msg) : base(msg) { }
    }

    public class OmdbApiSearchMustBeLongerExpection : Exception
    {
        public OmdbApiSearchMustBeLongerExpection(string msg) : base(msg) { }
    }

    public class OmdbApiNoIdProvidedExpection : Exception
    {
        public OmdbApiNoIdProvidedExpection(string msg) : base(msg) { }
    }
}
