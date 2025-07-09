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
import com.saumondeluxe.sushiscan.model.Manga;
import java.util.ArrayList;
import java.util.List;

public class MangaAdapter extends RecyclerView.Adapter<MangaAdapter.MangaViewHolder> {

    private List<Manga> mangaList;
    private OnMangaClickListener onMangaClickListener;

    public interface OnMangaClickListener {
        void onMangaClick(Manga manga);
    }

    public MangaAdapter() {
        this.mangaList = new ArrayList<>();
    }

    public void setOnMangaClickListener(OnMangaClickListener listener) {
        this.onMangaClickListener = listener;
    }

    public void setMangaList(List<Manga> mangaList) {
        this.mangaList = mangaList != null ? mangaList : new ArrayList<>();
        notifyDataSetChanged();
    }

    public void clearMangaList() {
        this.mangaList.clear();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MangaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_manga, parent, false);
        return new MangaViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MangaViewHolder holder, int position) {
        Manga manga = mangaList.get(position);
        holder.bind(manga);
    }

    @Override
    public int getItemCount() {
        return mangaList.size();
    }

    class MangaViewHolder extends RecyclerView.ViewHolder {
        private ImageView mangaCover;
        private TextView mangaTitle;
        private TextView mangaInfo;

        public MangaViewHolder(@NonNull View itemView) {
            super(itemView);
            mangaCover = itemView.findViewById(R.id.mangaCover);
            mangaTitle = itemView.findViewById(R.id.mangaTitle);
            mangaInfo = itemView.findViewById(R.id.mangaInfo);

            itemView.setOnClickListener(v -> {
                if (onMangaClickListener != null) {
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        onMangaClickListener.onMangaClick(mangaList.get(position));
                    }
                }
            });
        }

        public void bind(Manga manga) {
            mangaTitle.setText(manga.getTitle());
            mangaInfo.setText("Tap to read");

            // Charger l'image avec Glide
            String imageUrl = manga.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                Glide.with(itemView.getContext())
                        .load(imageUrl)
                        .placeholder(R.drawable.ic_launcher_foreground)
                        .error(R.drawable.ic_launcher_foreground)
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .into(mangaCover);
            } else {
                // Utiliser l'image placeholder si pas d'URL
                mangaCover.setImageResource(R.drawable.ic_launcher_foreground);
            }
        }
    }
}
