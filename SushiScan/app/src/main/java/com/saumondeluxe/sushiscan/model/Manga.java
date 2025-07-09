package com.saumondeluxe.sushiscan.model;

import java.util.List;

public class Manga {
    private String title;
    private String imageUrl;
    private String encodedTitle;
    private List<ScanChapter> scanChapters;

    public Manga() {
        // Default constructor required for some serialization libraries
    }

    public Manga(String title, String imageUrl) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.encodedTitle = java.net.URLEncoder.encode(title, java.nio.charset.StandardCharsets.UTF_8);
    }

    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        if (title != null) {
            this.encodedTitle = java.net.URLEncoder.encode(title, java.nio.charset.StandardCharsets.UTF_8);
        }
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getEncodedTitle() {
        return encodedTitle;
    }

    public void setEncodedTitle(String encodedTitle) {
        this.encodedTitle = encodedTitle;
    }

    public List<ScanChapter> getScanChapters() {
        return scanChapters;
    }

    public void setScanChapters(List<ScanChapter> scanChapters) {
        this.scanChapters = scanChapters;
    }
}
