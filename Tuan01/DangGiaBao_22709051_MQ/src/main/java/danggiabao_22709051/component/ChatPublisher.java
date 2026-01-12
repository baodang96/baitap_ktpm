package danggiabao_22709051.component;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class ChatPublisher {

    private final RedisTemplate<String, String> redisTemplate;

    public ChatPublisher(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void sendMessage(String message) {
        redisTemplate.convertAndSend("chat-channel", message);
    }
}
