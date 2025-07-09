package com.saumondeluxe.sushiscan.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.saumondeluxe.sushiscan.MangaDetailsActivity;
import com.saumondeluxe.sushiscan.R;
import com.saumondeluxe.sushiscan.model.Manga;
import com.saumondeluxe.sushiscan.network.ApiService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class CatalogueFragment extends Fragment implements MangaAdapter.OnMangaClickListener {

    private RecyclerView catalogueRecyclerView;
    private MangaAdapter mangaAdapter;
    private ProgressBar progressBar;
    private TextView noResultsText;
    private LinearLayout letterButtonsContainer;
    private ApiService apiService;

    // Données du catalogue
    private List<Manga> allMangaList;
    private String currentFilter = "All";

    // Lettres de filtrage (équivalent de votre tableau letters en JS)
    private final String[] letters = {
        "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0-9", "Other"
    };

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_catalogue, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupRecyclerView();
        setupLetterButtons();
        fetchCatalogue();
    }

    private void initializeViews(View view) {
        catalogueRecyclerView = view.findViewById(R.id.catalogueRecyclerView);
        progressBar = view.findViewById(R.id.catalogueProgressBar);
        noResultsText = view.findViewById(R.id.noResultsText);
        letterButtonsContainer = view.findViewById(R.id.letterButtonsContainer);
        apiService = ApiService.getInstance();
        allMangaList = new ArrayList<>();
    }

    private void setupRecyclerView() {
        mangaAdapter = new MangaAdapter();
        mangaAdapter.setOnMangaClickListener(this);
        catalogueRecyclerView.setLayoutManager(new GridLayoutManager(getContext(), 2));
        catalogueRecyclerView.setAdapter(mangaAdapter);
    }

    private void setupLetterButtons() {
        // Créer les boutons de filtrage par lettre (équivalent de votre forEach en JS)
        for (String letter : letters) {
            Button letterButton = new Button(getContext());
            letterButton.setText(letter);
            letterButton.setTextSize(12);
            letterButton.setPadding(24, 12, 24, 12);

            // Style du bouton
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            params.setMargins(8, 0, 8, 0);
            letterButton.setLayoutParams(params);

            // Marquer "All" comme sélectionné par défaut
            if (letter.equals("All")) {
                letterButton.setSelected(true);
                letterButton.setBackgroundColor(getResources().getColor(android.R.color.holo_blue_light, null));
            }

            // Équivalent de votre onclick en JS
            letterButton.setOnClickListener(v -> filterMangasByLetter(letter));

            letterButtonsContainer.addView(letterButton);
        }
    }

    // Équivalent de votre fonction fetchCatalogue() en JS
    private void fetchCatalogue() {
        showLoading(true);

        // D'abord récupérer le nombre total de mangas
        apiService.getMangaCount()
            .thenCompose(totalCount -> {
                if (totalCount == 0) {
                    return CompletableFuture.completedFuture(new ArrayList<Manga>());
                }

                // Pagination comme dans votre script JS
                int limit = 20;
                List<Manga> allMangas = new ArrayList<>();

                // Créer une chaîne de CompletableFuture pour la pagination séquentielle
                CompletableFuture<List<Manga>> result = CompletableFuture.completedFuture(allMangas);

                for (int i = 0; i < Math.ceil((double) totalCount / limit); i++) {
                    int skip = i * limit;
                    result = result.thenCompose(currentList ->
                        apiService.getMangaListPaginated(limit, skip)
                            .thenApply(newMangas -> {
                                if (newMangas != null && !newMangas.isEmpty()) {
                                    currentList.addAll(newMangas);
                                }
                                return currentList;
                            })
                    );
                }

                return result;
            })
            .thenAccept(mangaList -> {
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        showLoading(false);
                        if (mangaList != null && !mangaList.isEmpty()) {
                            allMangaList = mangaList;
                            displayMangaResults(allMangaList);
                            showToast("Récupéré " + mangaList.size() + " mangas du catalogue.");
                        } else {
                            showNoResults(true);
                            showToast("Aucun manga trouvé dans le catalogue.");
                        }
                    });
                }
            })
            .exceptionally(throwable -> {
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        showLoading(false);
                        showError("Erreur lors du chargement du catalogue: " + throwable.getMessage());
                    });
                }
                return null;
            });
    }

    // Équivalent de votre fonction filterMangasByLetter() en JS
    private void filterMangasByLetter(String selectedLetter) {
        updateLetterButtonSelection(selectedLetter);
        currentFilter = selectedLetter;

        List<Manga> filteredManga = allMangaList;

        if (!selectedLetter.equals("All")) {
            filteredManga = new ArrayList<>();

            for (Manga manga : allMangaList) {
                String firstLetter = manga.getTitle().substring(0, 1).toUpperCase();

                boolean matches = false;
                if (selectedLetter.equals("0-9")) {
                    matches = firstLetter.matches("[0-9]");
                } else if (selectedLetter.equals("Other")) {
                    String[] validLetters = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                                           "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
                    boolean isValidLetter = Arrays.asList(validLetters).contains(firstLetter);
                    boolean isNumber = firstLetter.matches("[0-9]");
                    matches = !isValidLetter && !isNumber;
                } else {
                    matches = firstLetter.equals(selectedLetter);
                }

                if (matches) {
                    filteredManga.add(manga);
                }
            }
        }

        displayMangaResults(filteredManga);
    }

    private void updateLetterButtonSelection(String selectedLetter) {
        // Mettre à jour la sélection visuelle des boutons
        for (int i = 0; i < letterButtonsContainer.getChildCount(); i++) {
            Button button = (Button) letterButtonsContainer.getChildAt(i);
            if (button.getText().toString().equals(selectedLetter)) {
                button.setSelected(true);
                button.setBackgroundColor(getResources().getColor(android.R.color.holo_blue_light, null));
            } else {
                button.setSelected(false);
                button.setBackgroundColor(getResources().getColor(android.R.color.darker_gray, null));
            }
        }
    }

    // Équivalent de votre fonction displayMangaResults() en JS
    private void displayMangaResults(List<Manga> mangaList) {
        if (mangaList == null || mangaList.isEmpty()) {
            showNoResults(true);
            return;
        }

        showNoResults(false);
        mangaAdapter.setMangaList(mangaList);
    }

    @Override
    public void onMangaClick(Manga manga) {
        // Navigation vers MangaDetailsActivity (équivalent de votre lien href en JS)
        Intent intent = new Intent(getActivity(), MangaDetailsActivity.class);
        intent.putExtra("encoded_title", manga.getEncodedTitle());
        startActivity(intent);
    }

    private void showLoading(boolean isLoading) {
        progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        catalogueRecyclerView.setVisibility(isLoading ? View.GONE : View.VISIBLE);
    }

    private void showNoResults(boolean show) {
        noResultsText.setVisibility(show ? View.VISIBLE : View.GONE);
        catalogueRecyclerView.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    private void showError(String message) {
        if (getContext() != null) {
            Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
        }
    }

    private void showToast(String message) {
        if (getContext() != null) {
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
        }
    }
}
