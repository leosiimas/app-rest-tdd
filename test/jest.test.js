test('Devo conhecer as principais assertativas do jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
});

test('Devo saber trabalhar com OBJ', () => {
  const obj = {
    nome: 'John',
    email: 'john@mail.com',
  };

  expect(obj).toHaveProperty('nome');
  expect(obj).toHaveProperty('nome', 'John');
  expect(obj.nome).toBe('John');

  const obj2 = {
    nome: 'John',
    email: 'john@mail.com',
  };

  expect(obj).toEqual(obj2);
});
