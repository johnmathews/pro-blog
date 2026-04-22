import { describe, it, expect } from 'vitest'
import { normalizeCategory } from '../lib/mdx'

describe('normalizeCategory', () => {
  it('returns ["uncategorized"] for undefined input', () => {
    expect(normalizeCategory(undefined)).toEqual(['uncategorized'])
  })

  it('returns ["uncategorized"] for null input', () => {
    expect(normalizeCategory(null)).toEqual(['uncategorized'])
  })

  it('returns ["uncategorized"] for empty string', () => {
    expect(normalizeCategory('')).toEqual(['uncategorized'])
  })

  it('splits a simple string category into an array', () => {
    expect(normalizeCategory('technical')).toEqual(['technical'])
  })

  it('splits space-separated categories', () => {
    expect(normalizeCategory('technical.snippet technical.data')).toEqual([
      'technical.snippet',
      'technical.data',
    ])
  })

  it('converts slashes to dots', () => {
    expect(normalizeCategory('technical/snippet')).toEqual(['technical.snippet'])
  })

  it('converts ">" separators to dots', () => {
    expect(normalizeCategory('technical > snippet')).toEqual(['technical.snippet'])
  })

  it('strips commas', () => {
    expect(normalizeCategory('technical.snippet, technical.data')).toEqual([
      'technical.snippet',
      'technical.data',
    ])
  })

  it('normalizes array categories', () => {
    expect(normalizeCategory(['technical/snippet', 'technical/data'])).toEqual([
      'technical.snippet',
      'technical.data',
    ])
  })

  it('handles array with ">" separators', () => {
    expect(normalizeCategory(['technical > web'])).toEqual(['technical.web'])
  })
})
