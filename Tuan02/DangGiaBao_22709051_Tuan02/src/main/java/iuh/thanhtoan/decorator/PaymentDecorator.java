package iuh.thanhtoan.decorator;

import iuh.thanhtoan.strategy.PaymentStrategy;

public abstract class PaymentDecorator implements PaymentStrategy {
    protected PaymentStrategy payment;
    public PaymentDecorator(PaymentStrategy payment) {
        this.payment = payment;
    }
}

