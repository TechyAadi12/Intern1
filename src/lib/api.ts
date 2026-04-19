import type { Signal } from '../types';
import { mockSignals } from '../data/mockData';

const LATENCY = 600; // artificial latency in ms
const ERROR_RATE = 0.05; // 5% chance to fail

export const fetchSignals = async (): Promise<Signal[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random error for robust edge case handling
      if (Math.random() < ERROR_RATE) {
        reject(new Error('Failed to fetch signals. Network unstable.'));
      } else {
        // Return a copy to avoid mutating the original mock data
        resolve(structuredClone(mockSignals));
      }
    }, LATENCY);
  });
};

export const updateSignalStatus = async (id: string, updates: Partial<Signal>): Promise<Signal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const signal = mockSignals.find(s => s.id === id);
      if (!signal) throw new Error('Signal not found');
      
      const updated = { ...signal, ...updates };
      return resolve(updated);
    }, 400);
  });
};
