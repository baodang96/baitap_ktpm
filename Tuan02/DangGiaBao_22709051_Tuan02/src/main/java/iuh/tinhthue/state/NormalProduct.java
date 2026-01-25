package iuh.tinhthue.state;

import iuh.tinhthue.strategy.TaxStrategy;
import iuh.tinhthue.strategy.VATTax;

public class NormalProduct implements ProductState {
    public TaxStrategy getTaxStrategy() {
        return new VATTax();
    }
}

