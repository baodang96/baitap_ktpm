package iuh.fit.loadbalancing_demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
public class HelloController {
    @GetMapping("/")
    public String hello() throws UnknownHostException {
        String hostName = InetAddress.getLocalHost().getHostName();
        return "Hello from instance: " + hostName;
    }
}