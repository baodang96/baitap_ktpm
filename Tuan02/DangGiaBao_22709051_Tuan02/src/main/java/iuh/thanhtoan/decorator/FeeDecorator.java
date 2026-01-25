package iuh.thanhtoan.decorator;

import iuh.thanhtoan.strategy.PaymentStrategy;

public class FeeDecorator extends PaymentDecorator {
    public FeeDecorator(PaymentStrategy payment) {
        super(payment);
    }
    public void pay(double amount) {
        payment.pay(amount + 10);
    }
}

