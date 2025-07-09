package com.saumondeluxe.sushiscan.network;

import com.saumondeluxe.sushiscan.model.Manga;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class ApiService {
    private static final String API_URL = "http://127.0.0.1:63246"; // Local development server
    private static ApiService instance;

    private ApiService() {
    }

    public static ApiService getInstance() {
        if (instance == null) {
            instance = new ApiService();
        }
        return instance;
    }

    public CompletableFuture<List<Manga>> getMangaList() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/mangaList");
                return parseMangaListResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        });
    }

    public CompletableFuture<List<Manga>> searchManga(String query) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
                String response = makeHttpRequest(API_URL + "/scans/manga?query=" + encodedQuery);
                return parseSearchResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        });
    }

    public CompletableFuture<Manga> getMangaDetails(String encodedTitle) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/manga/" + encodedTitle);
                return parseMangaDetailsResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        });
    }

    private String makeHttpRequest(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(10000);

        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();
        connection.disconnect();

        return response.toString();
    }

    private List<Manga> parseMangaListResponse(String response) throws JSONException {
        List<Manga> mangaList = new ArrayList<>();
        JSONObject jsonObject = new JSONObject(response);
        JSONArray mangasArray = jsonObject.getJSONArray("mangas");

        for (int i = 0; i < mangasArray.length(); i++) {
            JSONObject mangaJson = mangasArray.getJSONObject(i);
            Manga manga = new Manga();
            manga.setTitle(mangaJson.getString("title"));
            manga.setImageUrl(mangaJson.optString("image_url", ""));
            mangaList.add(manga);
        }

        return mangaList;
    }

    private List<Manga> parseSearchResponse(String response) throws JSONException {
        List<Manga> mangaList = new ArrayList<>();
        JSONObject jsonObject = new JSONObject(response);
        JSONArray resultsArray = jsonObject.getJSONArray("results");

        for (int i = 0; i < resultsArray.length(); i++) {
            JSONObject mangaJson = resultsArray.getJSONObject(i);
            Manga manga = new Manga();
            manga.setTitle(mangaJson.getString("title"));
            manga.setImageUrl(mangaJson.optString("image_url", ""));
            mangaList.add(manga);
        }

        return mangaList;
    }

    private Manga parseMangaDetailsResponse(String response) throws JSONException {
        JSONObject jsonObject = new JSONObject(response);
        Manga manga = new Manga();
        manga.setTitle(jsonObject.getString("title"));
        manga.setImageUrl(jsonObject.optString("image_url", ""));
        return manga;
    }
}
