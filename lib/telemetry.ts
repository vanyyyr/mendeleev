type TelemetryActionType = 
  | 'ELEMENT_VIEWED'
  | 'ANSWER_CORRECT'
  | 'ANSWER_INCORRECT'
  | 'HINT_REQUESTED';

interface TelemetryPayload {
  userId: string;
  actionType: TelemetryActionType;
  elementId?: number;
  questionId?: number;
  userAnswer?: string;
  aiHint?: string;
}

export async function trackEvent(payload: TelemetryPayload): Promise<void> {
  try {
    await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send telemetry:', error);
  }
}
