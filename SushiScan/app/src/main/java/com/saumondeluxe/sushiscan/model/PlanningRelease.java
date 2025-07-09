package com.saumondeluxe.sushiscan.model;

public class PlanningRelease {
    private String name;
    private Integer chapter;
    private String image;
    private String day;
    private String status;
    private String time;
    private String language;

    public PlanningRelease() {
        // Default constructor
    }

    public PlanningRelease(String name, Integer chapter, String image, String day, String status, String time, String language) {
        this.name = name;
        this.chapter = chapter;
        this.image = image;
        this.day = day;
        this.status = status;
        this.time = time;
        this.language = language;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getChapter() {
        return chapter;
    }

    public void setChapter(Integer chapter) {
        this.chapter = chapter;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
