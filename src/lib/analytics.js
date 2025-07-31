import { config } from '@/config/environment';

class Analytics {
  constructor() {
    this.isEnabled = config.app.isProduction;
    this.events = [];
  }

  track(eventName, properties = {}) {
    if (!this.isEnabled) {
      console.log('Analytics Event:', eventName, properties);
      return;
    }

    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  async sendEvent(event) {
    try {
      // Replace with your analytics service (Google Analytics, Mixpanel, etc.)
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Predefined events for VTC app
  trackBookingStarted(bookingData) {
    this.track('booking_started', {
      vehicle_type: bookingData.vehicleType,
      passengers: bookingData.passengers,
      booking_type: bookingData.bookingType,
      has_stops: bookingData.stops.length > 0,
    });
  }

  trackBookingCompleted(bookingId, price, duration) {
    this.track('booking_completed', {
      booking_id: bookingId,
      price,
      duration_minutes: duration,
    });
  }

  trackDriverRegistration(step) {
    this.track('driver_registration', { step });
  }

  trackPageView(pageName) {
    this.track('page_view', { page: pageName });
  }

  trackError(error, context) {
    this.track('error_occurred', {
      error_message: error.message,
      error_code: error.code,
      context,
      stack: error.stack,
    });
  }
}

export const analytics = new Analytics();