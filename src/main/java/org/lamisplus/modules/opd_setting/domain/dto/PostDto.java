package org.lamisplus.modules.opd_setting.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PostDto {
    private Long facilityId;
    private String moduleServiceName;
    private String moduleServiceCode;
    private String encounterType;

    public Long getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public String getModuleServiceName() {
        return moduleServiceName;
    }

    public void setModuleServiceName(String moduleServiceName) {
        this.moduleServiceName = moduleServiceName;
    }

    public String getModuleServiceCode() {
        return moduleServiceCode;
    }

    public void setModuleServiceCode(String moduleServiceCode) {
        this.moduleServiceCode = moduleServiceCode;
    }

    public String getEncounterType() {
        return encounterType;
    }

    public void setEncounterType(String encounterType) {
        this.encounterType = encounterType;
    }

    public PostDto(Long facilityId, String moduleServiceName, String moduleServiceCode, String encounterType) {
        this.facilityId = facilityId;
        this.moduleServiceName = moduleServiceName;
        this.moduleServiceCode = moduleServiceName;
        this.encounterType = encounterType;
    }
    public PostDto() {
    }
}
