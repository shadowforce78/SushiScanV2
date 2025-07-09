package com.saumondeluxe.sushiscan.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.saumondeluxe.sushiscan.MangaDetailsActivity;
import com.saumondeluxe.sushiscan.R;
import com.saumondeluxe.sushiscan.model.Manga;
import com.saumondeluxe.sushiscan.network.ApiService;
import java.util.List;

public class HomepageFragment extends Fragment implements MangaAdapter.OnMangaClickListener {

    private RecyclerView mangaRecyclerView;
    private MangaAdapter mangaAdapter;
    private EditText searchInput;
    private Button searchButton;
    private ProgressBar progressBar;
    private TextView noResultsText;
    private ApiService apiService;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_homepage, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        initializeViews(view);
        setupRecyclerView();
        setupSearchBar();
        loadMangaList();
    }

    private void initializeViews(View view) {
        mangaRecyclerView = view.findViewById(R.id.mangaRecyclerView);
        searchInput = view.findViewById(R.id.searchInput);
        searchButton = view.findViewById(R.id.searchButton);
        progressBar = view.findViewById(R.id.progressBar);
        noResultsText = view.findViewById(R.id.noResultsText);
        apiService = ApiService.getInstance();
    }

    private void setupRecyclerView() {
        mangaAdapter = new MangaAdapter();
        mangaAdapter.setOnMangaClickListener(this);
        mangaRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        mangaRecyclerView.setAdapter(mangaAdapter);
    }

    private void setupSearchBar() {
        searchButton.setOnClickListener(v -> {
            String query = searchInput.getText().toString().trim();
            if (!query.isEmpty()) {
                searchManga(query);
            } else {
                loadMangaList();
            }
        });
    }

    private void loadMangaList() {
        showLoading(true);
        apiService.getMangaList()
                .whenComplete((mangaList, throwable) -> {
                    if (getActivity() != null) {
                        getActivity().runOnUiThread(() -> {
                            showLoading(false);
                            if (throwable != null) {
                                showError("Erreur lors du chargement des mangas");
                                return;
                            }
                            if (mangaList != null && !mangaList.isEmpty()) {
                                mangaAdapter.setMangaList(mangaList);
                                showNoResults(false);
                            } else {
                                showNoResults(true);
                            }
                        });
                    }
                });
    }

    private void searchManga(String query) {
        showLoading(true);
        apiService.searchManga(query)
                .whenComplete((results, throwable) -> {
                    if (getActivity() != null) {
                        getActivity().runOnUiThread(() -> {
                            showLoading(false);
                            if (throwable != null) {
                                showError("Erreur lors de la recherche");
                                return;
                            }
                            if (results != null && !results.isEmpty()) {
                                mangaAdapter.setMangaList(results);
                                showNoResults(false);
                            } else {
                                mangaAdapter.clearMangaList();
                                showNoResults(true);
                            }
                        });
                    }
                });
    }

    private void showLoading(boolean isLoading) {
        progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        mangaRecyclerView.setVisibility(isLoading ? View.GONE : View.VISIBLE);
    }

    private void showNoResults(boolean show) {
        noResultsText.setVisibility(show ? View.VISIBLE : View.GONE);
        mangaRecyclerView.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    private void showError(String message) {
        if (getContext() != null) {
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onMangaClick(Manga manga) {
        // Navigation vers MangaDetailsActivity avec l'encodedTitle
        Intent intent = new Intent(getActivity(), MangaDetailsActivity.class);
        intent.putExtra("encoded_title", manga.getEncodedTitle());
        startActivity(intent);
    }
}
