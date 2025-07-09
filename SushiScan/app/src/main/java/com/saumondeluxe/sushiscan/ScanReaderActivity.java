package com.saumondeluxe.sushiscan;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;
import com.saumondeluxe.sushiscan.databinding.ActivityScanReaderBinding;
import com.saumondeluxe.sushiscan.network.ApiService;
import com.saumondeluxe.sushiscan.ui.ScanPagesAdapter;
import java.util.List;

public class ScanReaderActivity extends AppCompatActivity {

    private ActivityScanReaderBinding binding;
    private ScanPagesAdapter scanPagesAdapter;
    private ApiService apiService;

    private String mangaTitle;
    private String scanName;
    private int chapterNumber;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityScanReaderBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        apiService = ApiService.getInstance();
        scanPagesAdapter = new ScanPagesAdapter();

        getIntentData();
        setupViews();
        fetchAndDisplayScans();
    }

    private void getIntentData() {
        Intent intent = getIntent();
        mangaTitle = intent.getStringExtra("manga_title");
        scanName = intent.getStringExtra("scan_name");
        chapterNumber = intent.getIntExtra("chapter_number", 1);

        if (mangaTitle == null || scanName == null) {
            Toast.makeText(this, "Erreur: Données du chapitre manquantes", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void setupViews() {
        // Configuration du bouton retour (équivalent de votre backButton en JS)
        binding.backButton.setOnClickListener(v -> finish());

        // Configuration du ViewPager2 pour afficher les pages comme dans votre displayScans()
        binding.scanPagesViewPager.setAdapter(scanPagesAdapter);

        // Configuration de l'indicateur de page
        binding.scanPagesViewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                updatePageIndicator(position + 1, scanPagesAdapter.getItemCount());
            }
        });

        // Affichage des informations du chapitre
        binding.chapterInfo.setText(String.format("%s - %s - Chapitre %d",
                                                  mangaTitle, scanName, chapterNumber));
    }

    // Équivalent de votre fetchScansPage() + displayScans() en JS
    private void fetchAndDisplayScans() {
        try {
            String encodedTitle = java.net.URLEncoder.encode(mangaTitle, java.nio.charset.StandardCharsets.UTF_8);
            String encodedScanType = java.net.URLEncoder.encode(scanName, java.nio.charset.StandardCharsets.UTF_8);

            // Utiliser la même logique que votre fetchScansPage() en JS
            apiService.getScansPage(encodedTitle, encodedScanType, chapterNumber)
                    .thenAccept(pages -> {
                        runOnUiThread(() -> displayScans(pages));
                    })
                    .exceptionally(throwable -> {
                        runOnUiThread(() -> {
                            Toast.makeText(this, "Erreur lors du chargement des pages: " + throwable.getMessage(),
                                         Toast.LENGTH_SHORT).show();
                            finish();
                        });
                        return null;
                    });
        } catch (Exception e) {
            Toast.makeText(this, "Erreur d'encodage: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    // Équivalent de votre displayScans() en JS
    private void displayScans(List<String> pages) {
        // Vérifier si les pages existent (équivalent de votre vérification en JS)
        if (pages == null || pages.isEmpty()) {
            Toast.makeText(this, "Aucune page trouvée pour ce chapitre", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Afficher les pages dans le ViewPager2 (équivalent de votre forEach qui ajoute des img)
        scanPagesAdapter.setPageUrls(pages);
        updatePageIndicator(1, pages.size());

        Toast.makeText(this, "Chargement de " + pages.size() + " pages", Toast.LENGTH_SHORT).show();
    }

    private void updatePageIndicator(int currentPage, int totalPages) {
        binding.pageIndicator.setText(String.format("Page %d sur %d", currentPage, totalPages));
    }
}
