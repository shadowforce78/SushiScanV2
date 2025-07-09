package com.saumondeluxe.sushiscan;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.saumondeluxe.sushiscan.databinding.ActivityMainBinding;
import com.saumondeluxe.sushiscan.ui.TabsPagerAdapter;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private TabsPagerAdapter tabsPagerAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.toolbar);

        // Configuration du ViewPager2 et des onglets
        setupTabs();
    }

    private void setupTabs() {
        tabsPagerAdapter = new TabsPagerAdapter(this);
        ViewPager2 viewPager = binding.viewPager;
        viewPager.setAdapter(tabsPagerAdapter);

        TabLayout tabLayout = binding.tabLayout;
        new TabLayoutMediator(tabLayout, viewPager,
                (tab, position) -> tab.setText(tabsPagerAdapter.getTabTitle(position))
        ).attach();
    }
}