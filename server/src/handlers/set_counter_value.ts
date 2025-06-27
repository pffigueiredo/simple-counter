
import { db } from '../db';
import { countersTable } from '../db/schema';
import { type SetCounterValueInput, type Counter } from '../schema';
import { eq } from 'drizzle-orm';

export async function setCounterValue(input: SetCounterValueInput): Promise<Counter> {
  try {
    // First, check if a counter exists
    const existingCounters = await db.select()
      .from(countersTable)
      .limit(1)
      .execute();

    let result;

    if (existingCounters.length === 0) {
      // Create new counter with the specified value
      const inserted = await db.insert(countersTable)
        .values({
          value: input.value
        })
        .returning()
        .execute();
      
      result = inserted[0];
    } else {
      // Update existing counter
      const updated = await db.update(countersTable)
        .set({
          value: input.value,
          updated_at: new Date()
        })
        .where(eq(countersTable.id, existingCounters[0].id))
        .returning()
        .execute();
      
      result = updated[0];
    }

    return result;
  } catch (error) {
    console.error('Set counter value failed:', error);
    throw error;
  }
}
