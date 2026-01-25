package iuh.thanhtoan.strategy;

public class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " bằng thẻ tín dụng");
    }
}

