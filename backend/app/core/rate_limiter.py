from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import redis
import logging

logger = logging.getLogger(__name__)

# Try to connect to Redis for distributed rate limiting
# Fallback to in-memory if Redis is not available
try:
    redis_client = redis.Redis(
        host='localhost',
        port=6379,
        decode_responses=True,
        socket_connect_timeout=2
    )
    redis_client.ping()
    logger.info("Connected to Redis for rate limiting")
    use_redis = True
except Exception as e:
    logger.warning(f"Redis not available, using in-memory rate limiting: {str(e)}")
    redis_client = None
    use_redis = False

# Create limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379" if use_redis else "memory://",
    default_limits=["200 per day", "50 per hour"]
)

def get_limiter():
    """Get the rate limiter instance."""
    return limiter
