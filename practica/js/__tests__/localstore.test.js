import { getDataFromLocalStorage, updateLocalStorage } from "../index.redux.js";

beforeEach(() => {
  localStorage.clear();
})

afterEach(() => {
  localStorage.clear();
})

// Test the getDataFromLocalStorage function
test("getDataFromLocalStorage returns expected value", () => {
  const expectedValue = { articles: [] };
  localStorage.setItem("shoppingList", JSON.stringify(expectedValue));
  const result = getDataFromLocalStorage();
  expect(result).toEqual(expectedValue);
});

// Test the updateLocalStorage function
test("updateLocalStorage updates localStorage", () => {
  const newValue = { articles: [] };
  updateLocalStorage(newValue);
  const result = JSON.parse(localStorage.getItem("shoppingList"));
  expect(result).toEqual(newValue);
});