import {computed, Injectable, signal} from '@angular/core';

export interface AppTheme {
  name: string;
  icon: string;
}


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private appTheme = signal<'light' | 'dark' | 'system'>('system');

  private themes: AppTheme[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' },
  ];

  selectedTheme = computed(() =>
    this.themes.find((t) => t.name === this.appTheme())
  );

  getThemes() {
    return this.themes;
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);
  }
}
