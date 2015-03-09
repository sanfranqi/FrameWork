package com.greenleaf.crm.config;

import java.util.Map;

public class SystemConfig {
    private String martixUrl;

    private String admins;

    private String domainUrl;

    private String fileImagePath;

    private String rewardUrl;

    private Map<String, String> addItionMap;

    public String getTempPath() {
        return addItionMap.get("tempPath");
    }
    public Integer getFileSize() {
        return Integer.parseInt(addItionMap.get("fileSize"));
    }

    public Map<String, String> getAddItionMap() {
        return addItionMap;
    }

    public void setAddItionMap(Map<String, String> addItionMap) {
        this.addItionMap = addItionMap;
    }

    public String getRewardUrl() {
        return rewardUrl;
    }

    public void setRewardUrl(String rewardUrl) {
        this.rewardUrl = rewardUrl;
    }

    public String getFileImagePath() {
        return fileImagePath;
    }

    public void setFileImagePath(String fileImagePath) {
        this.fileImagePath = fileImagePath;
    }

    public String getDomainUrl() {
        return domainUrl;
    }

    public void setDomainUrl(String domainUrl) {
        this.domainUrl = domainUrl;
    }

    public String getAdmins() {
        return admins;
    }

    public void setAdmins(String admins) {
        this.admins = admins;
    }

    public String getMartixUrl() {
        return martixUrl;
    }

    public void setMartixUrl(String martixUrl) {
        this.martixUrl = martixUrl;
    }

    public String getMatrixUrl() {
        return martixUrl;
    }
}
