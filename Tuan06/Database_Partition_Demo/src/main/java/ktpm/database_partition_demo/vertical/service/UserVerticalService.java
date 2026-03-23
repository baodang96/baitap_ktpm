package ktpm.database_partition_demo.vertical.service;

import ktpm.database_partition_demo.vertical.entity.UserBasic;
import ktpm.database_partition_demo.vertical.entity.UserDetail;
import ktpm.database_partition_demo.vertical.repository.UserBasicRepository;
import ktpm.database_partition_demo.vertical.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserVerticalService {

    @Autowired
    private UserBasicRepository basicRepo;

    @Autowired
    private UserDetailRepository detailRepo;

    public void saveUser(Long id, String name, String email, String address) {
        UserBasic basic = new UserBasic();
        basic.setId(id);
        basic.setName(name);

        UserDetail detail = new UserDetail();
        detail.setId(id);
        detail.setEmail(email);
        detail.setAddress(address);

        basicRepo.save(basic);
        detailRepo.save(detail);
    }
}
