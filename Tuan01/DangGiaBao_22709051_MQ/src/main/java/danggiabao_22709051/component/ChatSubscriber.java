package danggiabao_22709051.component;

import org.springframework.stereotype.Component;

@Component
public class ChatSubscriber {

    public void receiveMessage(String message) {
        System.out.println("\n[New Message] " + message);
        System.out.print("You: ");
    }
}

