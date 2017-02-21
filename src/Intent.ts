export interface IntentSlot {
  name: string;
  type: string;
}

export interface IntentSlots {
  [id: string]: IntentSlot;
};

export interface Intent {
  name: string;
  slots: IntentSlots;
}
