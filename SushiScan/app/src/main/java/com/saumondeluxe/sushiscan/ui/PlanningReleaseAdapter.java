package com.saumondeluxe.sushiscan.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.saumondeluxe.sushiscan.R;
import com.saumondeluxe.sushiscan.model.PlanningRelease;
import java.util.ArrayList;
import java.util.List;

public class PlanningReleaseAdapter extends RecyclerView.Adapter<PlanningReleaseAdapter.ReleaseViewHolder> {

    private List<PlanningRelease> releaseList;
    private OnReleaseClickListener onReleaseClickListener;

    public interface OnReleaseClickListener {
        void onReleaseClick(PlanningRelease release);
    }

    public PlanningReleaseAdapter() {
        this.releaseList = new ArrayList<>();
    }

    public void setOnReleaseClickListener(OnReleaseClickListener listener) {
        this.onReleaseClickListener = listener;
    }

    public void setReleaseList(List<PlanningRelease> releaseList) {
        this.releaseList = releaseList != null ? releaseList : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ReleaseViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_planning_release, parent, false);
        return new ReleaseViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReleaseViewHolder holder, int position) {
        PlanningRelease release = releaseList.get(position);
        holder.bind(release);
    }

    @Override
    public int getItemCount() {
        return releaseList.size();
    }

    class ReleaseViewHolder extends RecyclerView.ViewHolder {
        private ImageView releaseImage;
        private TextView releaseName;
        private TextView releaseChapter;
        private TextView releaseTime;
        private TextView releaseLanguage;
        private TextView releaseStatus;

        public ReleaseViewHolder(@NonNull View itemView) {
            super(itemView);
            releaseImage = itemView.findViewById(R.id.releaseImage);
            releaseName = itemView.findViewById(R.id.releaseName);
            releaseChapter = itemView.findViewById(R.id.releaseChapter);
            releaseTime = itemView.findViewById(R.id.releaseTime);
            releaseLanguage = itemView.findViewById(R.id.releaseLanguage);
            releaseStatus = itemView.findViewById(R.id.releaseStatus);

            itemView.setOnClickListener(v -> {
                if (onReleaseClickListener != null) {
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        onReleaseClickListener.onReleaseClick(releaseList.get(position));
                    }
                }
            });
        }

        public void bind(PlanningRelease release) {
            releaseName.setText(release.getName());

            // Afficher le chapitre
            if (release.getChapter() != null) {
                releaseChapter.setText("Chapitre " + release.getChapter());
            } else {
                releaseChapter.setText("Chapitre TBD");
            }

            // Afficher l'heure si disponible
            if (release.getTime() != null && !release.getTime().isEmpty()) {
                releaseTime.setText(release.getTime());
                releaseTime.setVisibility(View.VISIBLE);
            } else {
                releaseTime.setVisibility(View.GONE);
            }

            // Afficher la langue si disponible
            if (release.getLanguage() != null && !release.getLanguage().isEmpty()) {
                releaseLanguage.setText(release.getLanguage());
                releaseLanguage.setVisibility(View.VISIBLE);
            } else {
                releaseLanguage.setVisibility(View.GONE);
            }

            // Afficher le statut
            if (release.getStatus() != null && !release.getStatus().isEmpty()) {
                releaseStatus.setText(release.getStatus());
                releaseStatus.setVisibility(View.VISIBLE);
            } else {
                releaseStatus.setVisibility(View.GONE);
            }

            // Charger l'image avec Glide
            String imageUrl = release.getImage();
            if (imageUrl != null && !imageUrl.isEmpty() && !imageUrl.equals("/img/no-cover.png")) {
                Glide.with(itemView.getContext())
                        .load(imageUrl)
                        .placeholder(R.drawable.ic_launcher_foreground)
                        .error(R.drawable.ic_launcher_foreground)
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .into(releaseImage);
            } else {
                releaseImage.setImageResource(R.drawable.ic_launcher_foreground);
            }
        }
    }
}
