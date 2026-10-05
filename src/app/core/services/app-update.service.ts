import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class AppUpdateService {
  private static readonly CHECK_THROTTLE_MS = 60 * 1000;
  private lastCheck = 0;
  private readonly swUpdate = inject(SwUpdate);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  start(): void {
    if (!this.isBrowser) {
      return;
    }
    window.addEventListener('visibilitychange', () => this.onActivated());
    window.addEventListener('focus', () => this.onActivated());
  }

  private onActivated(): void {
    if (document.visibilityState !== 'visible' || !navigator.onLine) {
      return;
    }
    if (!this.swUpdate.isEnabled) {
      return;
    }
    const now = Date.now();
    if (now - this.lastCheck < AppUpdateService.CHECK_THROTTLE_MS) {
      return;
    }
    this.lastCheck = now;
    this.ngZone.runOutsideAngular(() => {
      this.swUpdate.checkForUpdate().catch(() => undefined);
    });
  }
}
