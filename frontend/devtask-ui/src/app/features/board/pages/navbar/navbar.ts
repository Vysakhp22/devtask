import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroArrowRightOnRectangle, heroCog6Tooth } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  viewProviders: [provideIcons({ heroChevronDown, heroArrowRightOnRectangle, heroCog6Tooth })],
  host: {
    '[attr.role]': '"banner"',
  },
})
export class Navbar {
  protected readonly isUserMenuOpen = signal(false);

  protected toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }

  protected closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }
}
