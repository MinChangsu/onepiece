package onepiece.bounty.rush.service;

import onepiece.bounty.rush.repository.SERVERRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduleService {

    private static final Logger LOG = LoggerFactory.getLogger(ScheduleService.class);

    private final SERVERRepo serverRepo;

    public ScheduleService(SERVERRepo serverRepo) {
        this.serverRepo = serverRepo;
    }

    // 10분 간격 DB 조회 처리
    @Scheduled(cron = "0 0/10 * * * ?")   // 10분
//    @Scheduled(cron = "0/10 * * * * ?")  // 10초
    public void dbConnectJob() {

        LOG.info("■■■■■■■■■■■■■■■ DB 접속 스케줄러 (매 10분 실행) 시작 : dbConnectJob()");

        try {

            String rtn = this.serverRepo.SELECT_CONN_TEST();

        } catch (Exception e) {
            LOG.error("■■■■■■■■■■■■■■■ DB 접속 스케줄러 (매 10분 실행) 오류 : {}", e.getMessage());
        }

    }
}
