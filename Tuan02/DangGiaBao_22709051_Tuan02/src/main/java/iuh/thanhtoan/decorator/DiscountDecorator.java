package iuh.thanhtoan.decorator;

import iuh.thanhtoan.strategy.PaymentStrategy;

public class DiscountDecorator extends PaymentDecorator {
    public DiscountDecorator(PaymentStrategy payment) {
        super(payment);
    }
    public void pay(double amount) {
        payment.pay(amount - 20);
    }
}

