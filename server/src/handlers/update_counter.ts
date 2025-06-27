
import { db } from '../db';
import { countersTable } from '../db/schema';
import { type UpdateCounterInput, type Counter } from '../schema';
import { eq } from 'drizzle-orm';

export async function updateCounter(input: UpdateCounterInput): Promise<Counter> {
  try {
    // Get the current counter (assuming there's only one counter with id=1)
    // If no counter exists, create one with default value 0
    let currentCounter = await db.select()
      .from(countersTable)
      .where(eq(countersTable.id, 1))
      .execute();

    let currentValue = 0;
    
    if (currentCounter.length === 0) {
      // Create initial counter if it doesn't exist
      const newCounter = await db.insert(countersTable)
        .values({ value: 0 })
        .returning()
        .execute();
      currentValue = newCounter[0].value;
    } else {
      currentValue = currentCounter[0].value;
    }

    // Calculate new value based on operation
    let newValue: number;
    switch (input.operation) {
      case 'increment':
        newValue = currentValue + 1;
        break;
      case 'decrement':
        newValue = currentValue - 1;
        break;
      case 'reset':
        newValue = 0;
        break;
    }

    // Update the counter with new value
    const result = await db.update(countersTable)
      .set({ 
        value: newValue,
        updated_at: new Date()
      })
      .where(eq(countersTable.id, 1))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Counter update failed:', error);
    throw error;
  }
}
