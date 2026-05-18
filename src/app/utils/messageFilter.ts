// Message filtering utility to prevent off-platform contact sharing

export interface FilterResult {
  isAllowed: boolean;
  reason?: string;
  blockedTerms?: string[];
}

const BLOCKED_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g,
  venmo: /\b(venmo|vnmo)\b/gi,
  zelle: /\b(zelle|zele)\b/gi,
  cashapp: /\b(cash\s*app|cashapp|\$cashtag)\b/gi,
  paypal: /\b(paypal|pay\s*pal)\b/gi,
  telegram: /\b(telegram|@\w+|t\.me)\b/gi,
  whatsapp: /\b(whatsapp|whats\s*app)\b/gi,
  offPlatform: /\b(contact\s+(me\s+)?(outside|off)\s+(the\s+)?app|pay\s+(me\s+)?outside|off\s*platform|outside\s*(the\s+)?platform)\b/gi,
  externalContact: /\b(text\s+me|call\s+me|email\s+me|dm\s+me|message\s+me\s+on)\b/gi
};

export function filterMessage(message: string): FilterResult {
  const blockedTerms: string[] = [];
  let isAllowed = true;
  let reason = '';

  // Check each pattern
  for (const [type, pattern] of Object.entries(BLOCKED_PATTERNS)) {
    const matches = message.match(pattern);
    if (matches && matches.length > 0) {
      isAllowed = false;
      blockedTerms.push(...matches);

      switch (type) {
        case 'email':
          reason = 'Email addresses are not allowed';
          break;
        case 'phone':
          reason = 'Phone numbers are not allowed';
          break;
        case 'venmo':
        case 'zelle':
        case 'cashapp':
        case 'paypal':
          reason = 'Payment service information is not allowed';
          break;
        case 'telegram':
        case 'whatsapp':
          reason = 'External messaging app information is not allowed';
          break;
        case 'offPlatform':
        case 'externalContact':
          reason = 'Sharing contact information outside the platform is not allowed';
          break;
      }

      break; // Stop at first violation
    }
  }

  return {
    isAllowed,
    reason: isAllowed ? undefined : reason,
    blockedTerms: blockedTerms.length > 0 ? blockedTerms : undefined
  };
}

export function getFilterWarningMessage(userType: 'participant' | 'employer'): string {
  if (userType === 'participant') {
    return 'Sharing contact information outside the platform is not allowed. If you continue, your account may be blocked and your payment will not be refunded.';
  } else {
    return 'Employer contact information must stay inside the platform. Sharing outside contact details may result in account suspension.';
  }
}
