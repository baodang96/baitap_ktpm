package iuh.tinhthue.strategy;

public class LuxuryTax implements TaxStrategy {
    public double calculate(double price) {
        return price * 0.2;
    }
}

