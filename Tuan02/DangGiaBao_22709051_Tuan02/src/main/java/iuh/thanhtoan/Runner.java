package iuh.thanhtoan;

import iuh.thanhtoan.decorator.DiscountDecorator;
import iuh.thanhtoan.decorator.FeeDecorator;
import iuh.thanhtoan.strategy.CreditCardPayment;
import iuh.thanhtoan.strategy.PaymentStrategy;

public class Runner {
    public static void main(String[] args) {
        PaymentStrategy payment =
                new FeeDecorator(
                        new DiscountDecorator(
                                new CreditCardPayment()));

        payment.pay(200);
    }
}
