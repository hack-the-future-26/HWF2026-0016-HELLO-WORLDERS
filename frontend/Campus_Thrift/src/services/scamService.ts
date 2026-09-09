import { ScamAnalysisResult, ScamSignal, ScamSeverity } from '../types';

/**
 * Frontend Advisory Scam & Safety Check Service
 * 
 * NOTE: This is a frontend heuristic ruleset designed to provide helpful,
 * non-blocking advisory tips for students. It is NOT real AI and does not
 * guarantee fraud prevention. It NEVER automatically blocks or rejects a listing.
 */
class ScamService {
  public analyzeListing(
    title: string,
    description: string,
    price: number,
    category: string
  ): ScamAnalysisResult {
    const text = `${title} ${description}`.toLowerCase();
    const signals: ScamSignal[] = [];

    // 1. Check for off-platform payment indicators (High Risk)
    const offPlatformKeywords = [
      'gift card', 'google play card', 'apple gift card',
      'wire transfer', 'western union', 'crypto', 'bitcoin',
      'telegram', 't.me', 'whatsapp', 'zelle me first',
      'send deposit', 'venmo before meeting', 'cashapp deposit'
    ];

    for (const kw of offPlatformKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'danger',
          title: 'Off-Platform Payment or Contact Request Detected',
          description: `The listing mentions "${kw}". Scammers frequently ask for advance deposits or gift cards.`,
          advice: 'Safety check: Never send advance deposits or off-platform payments. Complete exchanges in person at a campus safe zone.'
        });
        break; // Only one off-platform alert needed
      }
    }

    // 2. Check for suspicious external URLs
    const urlPattern = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi;
    if (urlPattern.test(text)) {
      signals.push({
        severity: 'warning',
        title: 'External Link in Description',
        description: 'Listing contains an external web link or URL shortener.',
        advice: 'Safety check: Avoid opening unfamiliar external links that could lead to phishing websites.'
      });
    }

    // 3. Check for high urgency pressure language
    const urgencyKeywords = [
      'must sell today or throwing out', 'need gone in 1 hour',
      'urgent moving sale today only', 'immediate transfer needed',
      'first one to transfer cash gets it'
    ];

    for (const kw of urgencyKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'info',
          title: 'High-Urgency Phrasing Detected',
          description: 'The description uses high-pressure language urging immediate action.',
          advice: 'Safety check: Take your time to review the seller profile and confirm meeting details in daylight.'
        });
        break;
      }
    }

    // 4. Check for off-campus courier / shipping claims
    const shippingKeywords = [
      'my uncle will ship', 'will send courier', 'deliver to your house',
      'out of town right now', 'currently deployed', 'shipping company will contact you'
    ];

    for (const kw of shippingKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'warning',
          title: 'Unusual Delivery / Remote Shipping Offer',
          description: 'The listing mentions remote shipping or courier delivery rather than local student exchange.',
          advice: 'Safety check: Campus-Thrift is designed for local student handoffs. Avoid remote delivery arrangements.'
        });
        break;
      }
    }

    // 5. Price anomaly heuristic
    if ((category === 'electronics' || category === 'bicycles') && price > 0 && price <= 10) {
      signals.push({
        severity: 'warning',
        title: 'Unusually Low Price for Category',
        description: `Price (\$${price}) is unusually low for ${category}. Could be for parts, a replica, or a demo listing.`,
        advice: 'Safety check: Test device functionality or mechanical condition in person before paying.'
      });
    }

    // Calculate maximum severity
    let maxSeverity: ScamSeverity = 'info';
    if (signals.some(s => s.severity === 'danger')) {
      maxSeverity = 'danger';
    } else if (signals.some(s => s.severity === 'warning')) {
      maxSeverity = 'warning';
    }

    return {
      hasWarning: signals.length > 0,
      maxSeverity,
      signals
    };
  }
}

export const scamService = new ScamService();
