import hashpass from './hashpass';

test('returns the correct result for empty inputs', () => {
  expect(hashpass('', '', '')).toBe('expected_result');
});

test('returns the correct result for an example domain and password', () => {
  expect(hashpass('www.example.com', 'password', 'username')).toBe('expected_result');
});

test('strips whitespace from the domain', () => {
  expect(hashpass('www.example.com', 'password', 'username')).toBe('expected_result');
  expect(hashpass(' www.example.com ', 'password', 'username')).toBe('expected_result');
});

test('does not strip whitespace from the password', () => {
  expect(hashpass('www.example.com', 'password', 'username')).toBe('expected_result');
  expect(hashpass('www.example.com', ' password ', 'username')).not.toBe(
    'expected_result',
  );
});

test('is case-insensitive for domains', () => {
  expect(hashpass('www.example.com', 'password', 'username')).toBe('expected_result');
  expect(hashpass('Www.Example.Com', 'password', 'username')).toBe('expected_result');
});

test('is case-sensitive for passwords', () => {
  expect(hashpass('www.example.com', 'password', 'username')).toBe('expected_result');
  expect(hashpass('www.example.com', 'Password', 'username')).not.toBe('expected_result');
});
