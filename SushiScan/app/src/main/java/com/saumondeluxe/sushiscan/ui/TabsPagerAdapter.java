package com.saumondeluxe.sushiscan.ui;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class TabsPagerAdapter extends FragmentStateAdapter {

    public TabsPagerAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new HomepageFragment();
            case 1:
                return new CatalogueFragment();
            case 2:
                return new PlanningFragment();
            case 3:
                return new SettingsFragment();
            case 4:
                return new ProfilFragment();
            default:
                return new HomepageFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 5; // Nombre d'onglets
    }

    public String getTabTitle(int position) {
        switch (position) {
            case 0:
                return "Homepage";
            case 1:
                return "Catalogue";
            case 2:
                return "Planning";
            case 3:
                return "Settings";
            case 4:
                return "Profil";
            default:
                return "";
        }
    }
}
