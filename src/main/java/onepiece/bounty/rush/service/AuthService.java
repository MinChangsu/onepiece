package onepiece.bounty.rush.service;

import onepiece.bounty.rush.domain.USRDomain;

import javax.servlet.http.HttpSession;

public class AuthService {

    public static boolean checkAuth(HttpSession session, boolean isAdmin, int level ) {

        boolean rtn = false;
        USRDomain authVO = (USRDomain) session.getAttribute("gisLogin");
        if (authVO != null) {
            if (authVO.getUseYn().equals("Y")) {
                if (isAdmin) {
                    if (authVO.getLvl() <= level) {
                        rtn = true;
                    }
                } else {
                    if (authVO.getLvl() <= level) {
                        rtn = true;
                    }
                }
            }
        }
        return rtn;
    }
}
