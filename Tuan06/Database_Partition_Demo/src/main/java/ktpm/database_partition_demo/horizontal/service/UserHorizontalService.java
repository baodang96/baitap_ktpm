package ktpm.database_partition_demo.horizontal.service;

import ktpm.database_partition_demo.horizontal.entity.UserAsia;
import ktpm.database_partition_demo.horizontal.entity.UserUS;
import ktpm.database_partition_demo.horizontal.repository.UserAsiaRepository;
import ktpm.database_partition_demo.horizontal.repository.UserUSRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserHorizontalService {

    @Autowired
    private UserUSRepository userUSRepo;

    @Autowired
    private UserAsiaRepository userAsiaRepo;

    public void saveUser(Long id, String name, String region) {
        if ("US".equalsIgnoreCase(region)) {
            UserUS user = new UserUS();
            user.setId(id);
            user.setName(name);
            user.setRegion(region);
            userUSRepo.save(user);
        } else {
            UserAsia user = new UserAsia();
            user.setId(id);
            user.setName(name);
            user.setRegion(region);
            userAsiaRepo.save(user);
        }
    }
}
