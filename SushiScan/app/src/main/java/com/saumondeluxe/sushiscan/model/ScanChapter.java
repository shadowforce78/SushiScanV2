package com.saumondeluxe.sushiscan.model;

public class ScanChapter {
    private String name;
    private int totalChapters;

    public ScanChapter() {
        // Default constructor
    }

    public ScanChapter(String name, int totalChapters) {
        this.name = name;
        this.totalChapters = totalChapters;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalChapters() {
        return totalChapters;
    }

    public void setTotalChapters(int totalChapters) {
        this.totalChapters = totalChapters;
    }
}
