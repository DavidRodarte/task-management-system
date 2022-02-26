function addNumbers(n1, n2) {
  return n1 + n2;
}

describe('Add numbers', () => {
  it('adds two numbers', () => {
    expect(addNumbers(2, 2)).toEqual(4);
  });
});
