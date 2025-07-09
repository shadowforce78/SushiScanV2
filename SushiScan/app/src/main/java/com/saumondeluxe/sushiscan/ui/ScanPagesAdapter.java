package com.saumondeluxe.sushiscan.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.saumondeluxe.sushiscan.R;
import java.util.ArrayList;
import java.util.List;

public class ScanPagesAdapter extends RecyclerView.Adapter<ScanPagesAdapter.PageViewHolder> {

    private List<String> pageUrls;

    public ScanPagesAdapter() {
        this.pageUrls = new ArrayList<>();
    }

    public void setPageUrls(List<String> pageUrls) {
        this.pageUrls = pageUrls != null ? pageUrls : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public PageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_scan_page, parent, false);
        return new PageViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PageViewHolder holder, int position) {
        String pageUrl = pageUrls.get(position);
        holder.bind(pageUrl);
    }

    @Override
    public int getItemCount() {
        return pageUrls.size();
    }

    static class PageViewHolder extends RecyclerView.ViewHolder {
        private ImageView scanPageImage;

        public PageViewHolder(@NonNull View itemView) {
            super(itemView);
            scanPageImage = itemView.findViewById(R.id.scanPageImage);
        }

        public void bind(String pageUrl) {
            if (pageUrl != null && !pageUrl.isEmpty()) {
                Glide.with(itemView.getContext())
                        .load(pageUrl)
                        .placeholder(R.drawable.ic_launcher_foreground)
                        .error(R.drawable.ic_launcher_foreground)
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .into(scanPageImage);
            } else {
                scanPageImage.setImageResource(R.drawable.ic_launcher_foreground);
            }
        }
    }
}
