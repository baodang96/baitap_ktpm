package danggiabao_22709051.component;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class ChatConsoleRunner implements CommandLineRunner {

    private final ChatPublisher publisher;

    public ChatConsoleRunner(ChatPublisher publisher) {
        this.publisher = publisher;
    }

    @Override
    public void run(String... args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String username = scanner.nextLine();

        System.out.println("=== Chat started ===");

        while (true) {
            System.out.print("You: ");
            String message = scanner.nextLine();
            publisher.sendMessage(username + ": " + message);
        }
    }
}

