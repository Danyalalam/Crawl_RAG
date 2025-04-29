import asyncio
import time
from collections import deque
import logging

class RateLimiter:
    """Rate limiter that respects both token and request limits for different services."""
    
    def __init__(self, name="default", requests_per_minute=60, tokens_per_minute=10000):
        self.name = name
        self.requests_per_minute = requests_per_minute
        self.tokens_per_minute = tokens_per_minute
        
        # Tracking for requests
        self.request_timestamps = deque()
        self.request_lock = asyncio.Lock()
        
        # Tracking for tokens
        self.token_usage = deque()
        self.token_lock = asyncio.Lock()
        
        logging.info(f"Initialized {name} rate limiter: {requests_per_minute} RPM, {tokens_per_minute} TPM")
        
    async def wait_for_capacity(self, token_count=0):
        """Wait until there's capacity for both requests and tokens."""
        await self._wait_for_request_capacity()
        if token_count > 0:
            await self._wait_for_token_capacity(token_count)
    
    async def _wait_for_request_capacity(self):
        """Wait until there's capacity for another request."""
        while True:
            async with self.request_lock:
                # Remove timestamps older than 1 minute
                current_time = time.time()
                while self.request_timestamps and self.request_timestamps[0] < current_time - 60:
                    self.request_timestamps.popleft()
                
                # Check if we're under the limit
                if len(self.request_timestamps) < self.requests_per_minute:
                    self.request_timestamps.append(current_time)
                    return
            
            # Wait and try again
            wait_time = max(5.0, 60 / self.requests_per_minute)  # Dynamic wait time
            logging.warning(f"{self.name} rate limit approaching for requests ({len(self.request_timestamps)}/{self.requests_per_minute}), waiting {wait_time}s")
            await asyncio.sleep(wait_time)
    
    async def _wait_for_token_capacity(self, token_count):
        """Wait until there's capacity for the specified number of tokens."""
        while True:
            async with self.token_lock:
                # Remove token usage older than 1 minute
                current_time = time.time()
                while self.token_usage and self.token_usage[0][0] < current_time - 60:
                    self.token_usage.popleft()
                
                # Calculate current token usage
                current_usage = sum(usage for _, usage in self.token_usage)
                
                # Check if we have capacity for the new tokens
                if current_usage + token_count <= self.tokens_per_minute:
                    self.token_usage.append((current_time, token_count))
                    return
            
            # Wait and try again
            wait_time = max(3.0, 60 * token_count / self.tokens_per_minute)
            logging.warning(f"{self.name} token rate limit approaching ({current_usage}/{self.tokens_per_minute}), waiting {wait_time}s")
            await asyncio.sleep(wait_time)