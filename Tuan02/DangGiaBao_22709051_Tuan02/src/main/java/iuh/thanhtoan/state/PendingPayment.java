package iuh.thanhtoan.state;

public class PendingPayment implements PaymentState {
    public void handle() {
        System.out.println("Thanh toán đang chờ xử lý");
    }
}

