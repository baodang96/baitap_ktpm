package iuh.thanhtoan.state;

public class CompletedPayment implements PaymentState {
    public void handle() {
        System.out.println("Thanh toán hoàn tất");
    }
}

