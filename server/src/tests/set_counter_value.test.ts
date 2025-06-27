
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { countersTable } from '../db/schema';
import { type SetCounterValueInput } from '../schema';
import { setCounterValue } from '../handlers/set_counter_value';
import { eq } from 'drizzle-orm';

// Test inputs
const setToTenInput: SetCounterValueInput = {
  value: 10
};

const setToZeroInput: SetCounterValueInput = {
  value: 0
};

const setToNegativeInput: SetCounterValueInput = {
  value: -5
};

describe('setCounterValue', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create counter with specified value when none exists', async () => {
    const result = await setCounterValue(setToTenInput);

    // Basic field validation
    expect(result.value).toEqual(10);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save counter to database when creating', async () => {
    const result = await setCounterValue(setToTenInput);

    // Query database to verify
    const counters = await db.select()
      .from(countersTable)
      .where(eq(countersTable.id, result.id))
      .execute();

    expect(counters).toHaveLength(1);
    expect(counters[0].value).toEqual(10);
    expect(counters[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update existing counter value', async () => {
    // First create a counter
    await db.insert(countersTable)
      .values({ value: 5 })
      .execute();

    // Then set it to a new value
    const result = await setCounterValue(setToTenInput);

    expect(result.value).toEqual(10);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update counter in database', async () => {
    // Create initial counter
    const initial = await db.insert(countersTable)
      .values({ value: 5 })
      .returning()
      .execute();

    // Update the counter
    const result = await setCounterValue(setToTenInput);

    // Verify only one counter exists with updated value
    const allCounters = await db.select()
      .from(countersTable)
      .execute();

    expect(allCounters).toHaveLength(1);
    expect(allCounters[0].id).toEqual(initial[0].id);
    expect(allCounters[0].value).toEqual(10);
    expect(allCounters[0].updated_at).toBeInstanceOf(Date);
    expect(allCounters[0].updated_at > initial[0].updated_at).toBe(true);
  });

  it('should handle zero value', async () => {
    const result = await setCounterValue(setToZeroInput);

    expect(result.value).toEqual(0);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should handle negative values', async () => {
    const result = await setCounterValue(setToNegativeInput);

    expect(result.value).toEqual(-5);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update timestamp when setting value', async () => {
    // Create initial counter
    const initial = await db.insert(countersTable)
      .values({ value: 1 })
      .returning()
      .execute();

    const initialTime = initial[0].updated_at;

    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Set new value
    const result = await setCounterValue(setToTenInput);

    expect(result.updated_at > initialTime).toBe(true);
  });
});
