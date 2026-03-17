package iuh.paymentservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
@RequestMapping("/payments")
@Slf4j
public class PaymentController {

    private final Random random = new Random();

    @GetMapping("/process")
    public String processPayment() throws InterruptedException {
        int chance = random.nextInt(10);

        log.info("PaymentService: processing payment, chance={}", chance);

        // 40% lỗi
        if (chance < 4) {
            log.error("PaymentService: simulated failure");
            throw new RuntimeException("Payment failed");
        }

        // 30% chậm
        if (chance < 7) {
            log.warn("PaymentService: simulated slow response");
            Thread.sleep(3000);
        }

        return "Payment success";
    }
}

