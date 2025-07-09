package com.saumondeluxe.sushiscan;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.saumondeluxe.sushiscan.databinding.ActivityMangaDetailsBinding;
import com.saumondeluxe.sushiscan.model.Manga;
import com.saumondeluxe.sushiscan.model.ScanChapter;
import com.saumondeluxe.sushiscan.network.ApiService;
import java.util.List;

public class MangaDetailsActivity extends AppCompatActivity {

    private ActivityMangaDetailsBinding binding;
    private String encodedTitle;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMangaDetailsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        apiService = ApiService.getInstance();

        // Récupérer l'encodedTitle depuis l'Intent
        encodedTitle = getIntent().getStringExtra("encoded_title");
        if (encodedTitle == null) {
            Toast.makeText(this, "Erreur: Titre du manga manquant", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setupBackButton();
        fetchMangaDetails();
    }

    private void setupBackButton() {
        binding.backButton.setOnClickListener(v -> finish());
    }

    private void fetchMangaDetails() {
        // Équivalent de fetchMangaDetails en JavaScript
        apiService.getMangaDetailsWithInfo(encodedTitle)
                .thenAccept(manga -> {
                    runOnUiThread(() -> {
                        if (manga != null) {
                            displayMangaDetails(manga);
                        } else {
                            showError("Détails du manga non trouvés.");
                        }
                    });
                })
                .exceptionally(throwable -> {
                    runOnUiThread(() -> showError("Erreur lors du chargement: " + throwable.getMessage()));
                    return null;
                });
    }

    private void displayMangaDetails(Manga manga) {
        // Équivalent de displayMangaDetails en JavaScript

        // Afficher le titre
        binding.mangaTitle.setText(manga.getTitle());

        // Charger l'image de couverture
        if (manga.getImageUrl() != null && !manga.getImageUrl().isEmpty()) {
            Glide.with(this)
                    .load(manga.getImageUrl())
                    .placeholder(R.drawable.ic_launcher_foreground)
                    .error(R.drawable.ic_launcher_foreground)
                    .into(binding.mangaCover);
        }

        // Afficher les chapitres de scan
        List<ScanChapter> scanChapters = manga.getScanChapters();
        if (scanChapters != null && !scanChapters.isEmpty()) {
            binding.noScansMessage.setVisibility(View.GONE);
            displayScanChapters(scanChapters, manga.getTitle());
        } else {
            binding.noScansMessage.setVisibility(View.VISIBLE);
        }
    }

    private void displayScanChapters(List<ScanChapter> scanChapters, String mangaTitle) {
        LinearLayout container = binding.scanChaptersContainer;
        container.removeAllViews();

        for (ScanChapter scan : scanChapters) {
            // Créer une section pour chaque type de scan
            LinearLayout scanSection = new LinearLayout(this);
            scanSection.setOrientation(LinearLayout.VERTICAL);
            scanSection.setPadding(0, 16, 0, 16);

            // Titre du scan
            TextView scanTitle = new TextView(this);
            scanTitle.setText(scan.getName());
            scanTitle.setTextSize(20);
            scanTitle.setTextColor(getResources().getColor(android.R.color.black, getTheme()));
            scanTitle.setPadding(0, 0, 0, 8);
            scanSection.addView(scanTitle);

            // Nombre total de chapitres
            TextView totalChapters = new TextView(this);
            totalChapters.setText("Total Chapitres: " + scan.getTotalChapters());
            totalChapters.setTextSize(14);
            totalChapters.setPadding(0, 0, 0, 16);
            scanSection.addView(totalChapters);

            // Créer les boutons pour chaque chapitre
            LinearLayout chaptersLayout = new LinearLayout(this);
            chaptersLayout.setOrientation(LinearLayout.VERTICAL);

            for (int i = 1; i <= scan.getTotalChapters(); i++) {
                Button chapterButton = new Button(this);
                chapterButton.setText("Chapitre " + i);
                chapterButton.setLayoutParams(new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                ));
                chapterButton.setPadding(16, 8, 16, 8);

                final int chapterNumber = i;
                final String scanName = scan.getName();

                chapterButton.setOnClickListener(v -> {
                    // Équivalent du onclick en JavaScript
                    fetchAndDisplayScans(mangaTitle, scanName, chapterNumber);
                });

                chaptersLayout.addView(chapterButton);
            }

            scanSection.addView(chaptersLayout);
            container.addView(scanSection);
        }
    }

    private void fetchAndDisplayScans(String mangaTitle, String scanName, int chapterNumber) {
        // Équivalent de fetchScansPage + displayScans en JavaScript
        try {
            String encodedTitle = java.net.URLEncoder.encode(mangaTitle, java.nio.charset.StandardCharsets.UTF_8);
            String encodedScanType = java.net.URLEncoder.encode(scanName, java.nio.charset.StandardCharsets.UTF_8);

            apiService.getScansPage(encodedTitle, encodedScanType, chapterNumber)
                    .thenAccept(pages -> {
                        runOnUiThread(() -> {
                            if (pages != null && !pages.isEmpty()) {
                                // Naviguer vers une activité de lecture des scans
                                Intent intent = new Intent(this, ScanReaderActivity.class);
                                intent.putExtra("manga_title", mangaTitle);
                                intent.putExtra("scan_name", scanName);
                                intent.putExtra("chapter_number", chapterNumber);
                                // TODO: Passer les pages ou les charger dans la nouvelle activité
                                startActivity(intent);
                            } else {
                                Toast.makeText(this, "Aucune page trouvée pour ce chapitre", Toast.LENGTH_SHORT).show();
                            }
                        });
                    })
                    .exceptionally(throwable -> {
                        runOnUiThread(() ->
                            Toast.makeText(this, "Erreur lors du chargement des pages: " + throwable.getMessage(),
                                         Toast.LENGTH_SHORT).show());
                        return null;
                    });
        } catch (Exception e) {
            Toast.makeText(this, "Erreur d'encodage: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    private void showError(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }
}
