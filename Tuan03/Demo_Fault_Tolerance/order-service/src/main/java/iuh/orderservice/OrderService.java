package iuh.orderservice;

import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class OrderService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Retry(name = "paymentRetry", fallbackMethod = "retryFallback")
    @CircuitBreaker(name = "paymentCircuit", fallbackMethod = "circuitFallback")
//    @RateLimiter(name = "paymentRateLimiter")
//    @Bulkhead(name = "paymentBulkhead")
    public String createOrder() {

        log.info("OrderService: calling PaymentService");

        String response = restTemplate.getForObject(
                "http://localhost:8081/payments/process",
                String.class
        );

        log.info("OrderService: payment response={}", response);
        return response;
    }

    /* ===== FALLBACK METHODS ===== */

    public String retryFallback(Throwable ex) {
        log.error("Retry fallback triggered", ex);
        return "Retry fallback: payment failed";
    }

    public String circuitFallback(Throwable ex) {
        log.error("CircuitBreaker fallback triggered", ex);
        return "Circuit breaker open - payment service unavailable";
    }

}

