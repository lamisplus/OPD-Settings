package org.lamisplus.modules.opd_setting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/opd-setting")
public class OPDSettingController {

    @GetMapping("/get")
    public void getOPDService(){
        System.out.println("OPD SETTINGS");
    }

}
