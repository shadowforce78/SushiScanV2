package com.saumondeluxe.sushiscan.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
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
import com.saumondeluxe.sushiscan.model.PlanningRelease;
import com.saumondeluxe.sushiscan.network.ApiService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PlanningFragment extends Fragment implements PlanningReleaseAdapter.OnReleaseClickListener {

    private LinearLayout weeklyScheduleContainer;
    private ProgressBar progressBar;
    private TextView loadingText;
    private LinearLayout errorContainer;
    private TextView errorText;
    private ApiService apiService;

    // Données du planning (équivalent de votre planningData en JS)
    private List<PlanningRelease> planningData;

    // Jours de la semaine (équivalent de votre tableau days en JS)
    private final String[] days = {"Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche", "Autres"};

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_planning, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeElements(view);
        loadPlanning();
    }

    // Équivalent de votre initializeElements() en JS
    private void initializeElements(View view) {
        weeklyScheduleContainer = view.findViewById(R.id.weeklyScheduleContainer);
        progressBar = view.findViewById(R.id.planningProgressBar);
        loadingText = view.findViewById(R.id.loadingText);
        errorContainer = view.findViewById(R.id.errorContainer);
        errorText = view.findViewById(R.id.errorText);
        apiService = ApiService.getInstance();
        planningData = new ArrayList<>();

        // Debug: Log des éléments trouvés (équivalent de votre console.log en JS)
        System.out.println("Planning elements initialized - Container found: " + (weeklyScheduleContainer != null));
    }

    // Équivalent de votre loadPlanning() en JS
    private void loadPlanning() {
        try {
            showLoading();

            apiService.getPlanning()
                .thenAccept(data -> {
                    if (getActivity() != null) {
                        getActivity().runOnUiThread(() -> {
                            planningData = data != null ? data : new ArrayList<>();
                            renderWeeklySchedule();
                        });
                    }
                })
                .exceptionally(throwable -> {
                    if (getActivity() != null) {
                        getActivity().runOnUiThread(() -> {
                            System.err.println("Error loading planning: " + throwable.getMessage());
                            showError("Impossible de charger le planning");
                        });
                    }
                    return null;
                });
        } catch (Exception error) {
            System.err.println("Error loading planning: " + error.getMessage());
            showError("Impossible de charger le planning");
        }
    }

    // Équivalent de votre renderWeeklySchedule() en JS
    private void renderWeeklySchedule() {
        if (weeklyScheduleContainer == null) {
            System.out.println("Planning container not found");
            return;
        }

        System.out.println("Rendering weekly schedule with data: " + planningData.size() + " items");

        Map<String, List<PlanningRelease>> groupedData = groupDataByDay(planningData);

        // Vider le container
        weeklyScheduleContainer.removeAllViews();

        // Créer une section pour chaque jour
        for (String day : days) {
            List<PlanningRelease> dayReleases = groupedData.get(day);
            if (dayReleases == null) {
                dayReleases = new ArrayList<>();
            }
            View daySection = renderDaySection(day, dayReleases);
            weeklyScheduleContainer.addView(daySection);
        }

        hideLoading();
    }

    // Équivalent de votre renderDaySection() en JS
    private View renderDaySection(String day, List<PlanningRelease> releases) {
        View dayView = LayoutInflater.from(getContext()).inflate(R.layout.item_day_section, weeklyScheduleContainer, false);

        TextView dayTitle = dayView.findViewById(R.id.dayTitle);
        TextView releaseCount = dayView.findViewById(R.id.releaseCount);
        RecyclerView dayRecyclerView = dayView.findViewById(R.id.dayRecyclerView);
        TextView noReleasesText = dayView.findViewById(R.id.noReleasesText);

        // Configurer le titre et le compteur
        dayTitle.setText(day);
        String countText = releases.size() + " sortie" + (releases.size() != 1 ? "s" : "");
        releaseCount.setText(countText);

        // Configurer le RecyclerView pour ce jour
        if (releases.size() > 0) {
            PlanningReleaseAdapter adapter = new PlanningReleaseAdapter();
            adapter.setOnReleaseClickListener(this);
            adapter.setReleaseList(releases);

            dayRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
            dayRecyclerView.setAdapter(adapter);
            dayRecyclerView.setVisibility(View.VISIBLE);
            noReleasesText.setVisibility(View.GONE);
        } else {
            dayRecyclerView.setVisibility(View.GONE);
            noReleasesText.setVisibility(View.VISIBLE);
            noReleasesText.setText("Aucune sortie prévue");
        }

        return dayView;
    }

    // Équivalent de votre groupDataByDay() en JS
    private Map<String, List<PlanningRelease>> groupDataByDay(List<PlanningRelease> planningData) {
        Map<String, List<PlanningRelease>> grouped = new HashMap<>();

        for (PlanningRelease item : planningData) {
            String day = item.getDay() != null ? item.getDay() : "Autres";

            if (!grouped.containsKey(day)) {
                grouped.put(day, new ArrayList<>());
            }
            grouped.get(day).add(item);
        }

        return grouped;
    }

    // Équivalent de votre openMangaDetails() en JS
    @Override
    public void onReleaseClick(PlanningRelease release) {
        try {
            String encodedTitle = java.net.URLEncoder.encode(release.getName(), java.nio.charset.StandardCharsets.UTF_8);
            Intent intent = new Intent(getActivity(), MangaDetailsActivity.class);
            intent.putExtra("encoded_title", encodedTitle);
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(getContext(), "Erreur lors de l'ouverture: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    // Équivalent de votre showLoading() en JS
    private void showLoading() {
        if (progressBar != null && loadingText != null) {
            progressBar.setVisibility(View.VISIBLE);
            loadingText.setVisibility(View.VISIBLE);
            errorContainer.setVisibility(View.GONE);
            weeklyScheduleContainer.setVisibility(View.GONE);
        }
    }

    private void hideLoading() {
        if (progressBar != null && loadingText != null) {
            progressBar.setVisibility(View.GONE);
            loadingText.setVisibility(View.GONE);
            weeklyScheduleContainer.setVisibility(View.VISIBLE);
        }
    }

    // Équivalent de votre showError() en JS
    private void showError(String message) {
        if (errorContainer != null && errorText != null) {
            progressBar.setVisibility(View.GONE);
            loadingText.setVisibility(View.GONE);
            weeklyScheduleContainer.setVisibility(View.GONE);
            errorContainer.setVisibility(View.VISIBLE);
            errorText.setText(message);
        }
    }
}
