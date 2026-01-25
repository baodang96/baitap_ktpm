package iuh.thanhtoan.strategy;

public class PaypalPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " bằng PayPal");
    }
}

