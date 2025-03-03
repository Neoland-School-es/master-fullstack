import { getInputValue, setInputValue } from "../index.redux.js";

// Test input creation and value
test('input creation and value', () => {
  const input = document.createElement('input');
  setInputValue(input, 'test');
  expect(input.value).toBe('test');
});

// Test input value
test('input value', () => {
  const input = document.createElement('input');
  setInputValue(input, 'test');
  expect(getInputValue(input)).toBe('test');
});
