package com.saumondeluxe.sushiscan.network;

import com.saumondeluxe.sushiscan.model.Manga;
import com.saumondeluxe.sushiscan.model.ScanChapter;
import com.saumondeluxe.sushiscan.model.PlanningRelease;
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
    private static final String API_URL = "https://4c3dc2f91a80.ngrok-free.app"; // Local development server
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

    public CompletableFuture<Manga> getMangaDetailsWithInfo(String encodedTitle) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/manga/info?manga_name=" + encodedTitle);
                return parseMangaDetailsWithInfoResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        });
    }

    public CompletableFuture<List<String>> getScansPage(String encodedTitle, String encodedScanType, int chapterNumber) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/manga/" + encodedTitle + "/" + encodedScanType + "/" + chapterNumber);
                return parseScansPageResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        });
    }

    public CompletableFuture<Integer> getMangaCount() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/manga/count");
                return parseMangaCountResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return 0;
            }
        });
    }

    public CompletableFuture<List<Manga>> getMangaListPaginated(int limit, int skip) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/mangaList?limit=" + limit + "&skip=" + skip);
                return parseMangaListResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        });
    }

    public CompletableFuture<List<PlanningRelease>> getPlanning() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String response = makeHttpRequest(API_URL + "/scans/planning");
                return parsePlanningResponse(response);
            } catch (Exception e) {
                e.printStackTrace();
                // En cas d'erreur API, retourner des données mock comme dans votre JS
                return generateMockPlanningData();
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

    private Manga parseMangaDetailsWithInfoResponse(String response) throws JSONException {
        JSONObject jsonObject = new JSONObject(response);
        if (!jsonObject.has("manga")) {
            return null;
        }

        JSONObject mangaJson = jsonObject.getJSONObject("manga");
        Manga manga = new Manga();
        manga.setTitle(mangaJson.getString("title"));
        manga.setImageUrl(mangaJson.optString("image_url", ""));

        // Parser les scan_chapters
        if (mangaJson.has("scan_chapters")) {
            JSONArray scanChaptersArray = mangaJson.getJSONArray("scan_chapters");
            List<ScanChapter> scanChapters = new ArrayList<>();

            for (int i = 0; i < scanChaptersArray.length(); i++) {
                JSONObject scanJson = scanChaptersArray.getJSONObject(i);
                ScanChapter scanChapter = new ScanChapter();
                scanChapter.setName(scanJson.getString("name"));
                scanChapter.setTotalChapters(scanJson.getInt("total_chapters"));
                scanChapters.add(scanChapter);
            }

            manga.setScanChapters(scanChapters);
        }

        return manga;
    }

    private List<String> parseScansPageResponse(String response) throws JSONException {
        List<String> pages = new ArrayList<>();
        JSONObject jsonObject = new JSONObject(response);

        if (jsonObject.has("pages")) {
            JSONArray pagesArray = jsonObject.getJSONArray("pages");
            for (int i = 0; i < pagesArray.length(); i++) {
                pages.add(pagesArray.getString(i));
            }
        }

        return pages;
    }

    private int parseMangaCountResponse(String response) throws JSONException {
        JSONObject jsonObject = new JSONObject(response);
        return jsonObject.getInt("count");
    }

    private List<PlanningRelease> parsePlanningResponse(String response) throws JSONException {
        List<PlanningRelease> planningList = new ArrayList<>();
        JSONObject jsonObject = new JSONObject(response);

        if (jsonObject.has("planning")) {
            JSONArray planningArray = jsonObject.getJSONArray("planning");

            for (int i = 0; i < planningArray.length(); i++) {
                JSONObject releaseJson = planningArray.getJSONObject(i);
                PlanningRelease release = new PlanningRelease();
                release.setName(releaseJson.getString("name"));
                release.setChapter(releaseJson.optInt("chapter", 0));
                release.setImage(releaseJson.optString("image", ""));
                release.setDay(releaseJson.optString("day", "Autres"));
                release.setStatus(releaseJson.optString("status", "active"));
                release.setTime(releaseJson.optString("time", ""));
                release.setLanguage(releaseJson.optString("language", "FR"));
                planningList.add(release);
            }
        }

        return planningList;
    }

    // Équivalent de votre getMockPlanningData() en JS
    private List<PlanningRelease> generateMockPlanningData() {
        List<PlanningRelease> mockData = new ArrayList<>();

        String[] mangaNames = {
            "One Piece", "Naruto", "Demon Slayer", "Attack on Titan",
            "My Hero Academia", "Dragon Ball Super", "Jujutsu Kaisen",
            "Chainsaw Man", "Tokyo Ghoul", "Death Note"
        };

        String[] days = {"Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche", "Autres"};

        // Créer des données de test pour chaque jour
        for (int i = 0; i < mangaNames.length; i++) {
            PlanningRelease release = new PlanningRelease();
            release.setName(mangaNames[i]);
            release.setChapter((int)(Math.random() * 50) + 100);
            release.setImage("/img/no-cover.png");
            release.setDay(days[i % days.length]);
            release.setStatus("active");
            release.setTime(((int)(Math.random() * 12) + 8) + ":00");
            release.setLanguage("FR");
            mockData.add(release);
        }

        return mockData;
    }
}
