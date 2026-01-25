package iuh.tinhthue.state;

import iuh.tinhthue.strategy.LuxuryTax;
import iuh.tinhthue.strategy.TaxStrategy;

public class LuxuryProduct implements ProductState {
    public TaxStrategy getTaxStrategy() {
        return new LuxuryTax();
    }
}

