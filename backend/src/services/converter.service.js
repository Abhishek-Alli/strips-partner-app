/**
 * Converter Service
 *
 * Pure math unit conversions for length, area, weight, volume, temperature.
 * No database required — conversion factors are defined as constants.
 */

// Each unit has a `toBase` factor: value_in_unit * toBase = value_in_base_unit
// Conversions: result = value * fromUnit.toBase / toUnit.toBase
// Exception: temperature uses special formulas

const CATEGORIES = {
  length: {
    id: 'length',
    name: 'Length',
    icon: '📏',
    baseUnit: 'm',
    units: [
      { id: 'mm',  name: 'Millimeter', symbol: 'mm',  toBase: 0.001 },
      { id: 'cm',  name: 'Centimeter', symbol: 'cm',  toBase: 0.01 },
      { id: 'm',   name: 'Meter',      symbol: 'm',   toBase: 1 },
      { id: 'km',  name: 'Kilometer',  symbol: 'km',  toBase: 1000 },
      { id: 'in',  name: 'Inch',       symbol: 'in',  toBase: 0.0254 },
      { id: 'ft',  name: 'Feet',       symbol: 'ft',  toBase: 0.3048 },
      { id: 'yd',  name: 'Yard',       symbol: 'yd',  toBase: 0.9144 },
      { id: 'mi',  name: 'Mile',       symbol: 'mi',  toBase: 1609.344 },
    ],
  },
  area: {
    id: 'area',
    name: 'Area',
    icon: '⬛',
    baseUnit: 'sqm',
    units: [
      { id: 'sqmm',    name: 'Sq Millimeter', symbol: 'mm²',    toBase: 0.000001 },
      { id: 'sqcm',    name: 'Sq Centimeter', symbol: 'cm²',    toBase: 0.0001 },
      { id: 'sqm',     name: 'Sq Meter',      symbol: 'm²',     toBase: 1 },
      { id: 'sqkm',    name: 'Sq Kilometer',  symbol: 'km²',    toBase: 1000000 },
      { id: 'sqft',    name: 'Sq Feet',        symbol: 'ft²',    toBase: 0.092903 },
      { id: 'sqyd',    name: 'Sq Yard',        symbol: 'yd²',    toBase: 0.836127 },
      { id: 'acre',    name: 'Acre',           symbol: 'ac',     toBase: 4046.86 },
      { id: 'hectare', name: 'Hectare',        symbol: 'ha',     toBase: 10000 },
      { id: 'gunta',   name: 'Gunta',          symbol: 'gunta',  toBase: 101.171 },
      { id: 'cent',    name: 'Cent',           symbol: 'cent',   toBase: 40.4686 },
      { id: 'bigha',   name: 'Bigha',          symbol: 'bigha',  toBase: 2529.28 },
      { id: 'marla',   name: 'Marla',          symbol: 'marla',  toBase: 25.2929 },
    ],
  },
  weight: {
    id: 'weight',
    name: 'Weight',
    icon: '⚖️',
    baseUnit: 'kg',
    units: [
      { id: 'mg',      name: 'Milligram', symbol: 'mg',      toBase: 0.000001 },
      { id: 'g',       name: 'Gram',      symbol: 'g',       toBase: 0.001 },
      { id: 'kg',      name: 'Kilogram',  symbol: 'kg',      toBase: 1 },
      { id: 'tonne',   name: 'Tonne',     symbol: 't',       toBase: 1000 },
      { id: 'lb',      name: 'Pound',     symbol: 'lb',      toBase: 0.453592 },
      { id: 'oz',      name: 'Ounce',     symbol: 'oz',      toBase: 0.0283495 },
      { id: 'quintal', name: 'Quintal',   symbol: 'qtl',     toBase: 100 },
    ],
  },
  volume: {
    id: 'volume',
    name: 'Volume',
    icon: '🧊',
    baseUnit: 'cum',
    units: [
      { id: 'ml',   name: 'Milliliter',   symbol: 'ml',  toBase: 0.000001 },
      { id: 'l',    name: 'Liter',         symbol: 'L',   toBase: 0.001 },
      { id: 'cum',  name: 'Cubic Meter',   symbol: 'm³',  toBase: 1 },
      { id: 'cft',  name: 'Cubic Feet',    symbol: 'ft³', toBase: 0.0283168 },
      { id: 'cyd',  name: 'Cubic Yard',    symbol: 'yd³', toBase: 0.764555 },
      { id: 'gal',  name: 'Gallon (US)',   symbol: 'gal', toBase: 0.00378541 },
      { id: 'limp', name: 'Gallon (Imp)',  symbol: 'imp', toBase: 0.00454609 },
    ],
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius',    symbol: '°C' },
      { id: 'f', name: 'Fahrenheit', symbol: '°F' },
      { id: 'k', name: 'Kelvin',     symbol: 'K' },
    ],
  },
};

/**
 * Convert temperature (special case — not multiplicative)
 */
function convertTemperature(value, fromId, toId) {
  if (fromId === toId) return value;

  // Convert to Celsius first
  let celsius;
  if (fromId === 'c') celsius = value;
  else if (fromId === 'f') celsius = (value - 32) * 5 / 9;
  else if (fromId === 'k') celsius = value - 273.15;
  else throw new Error(`Unknown temperature unit: ${fromId}`);

  // Convert from Celsius to target
  if (toId === 'c') return celsius;
  if (toId === 'f') return (celsius * 9 / 5) + 32;
  if (toId === 'k') return celsius + 273.15;
  throw new Error(`Unknown temperature unit: ${toId}`);
}

/**
 * Get all converter categories with their units
 */
export function getConverterCategories() {
  return Object.values(CATEGORIES).map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    units: cat.units.map(u => ({ id: u.id, name: u.name, symbol: u.symbol })),
  }));
}

/**
 * Convert a value from one unit to another
 * @param {string} category - Category id (length, area, weight, volume, temperature)
 * @param {string} fromUnit - Source unit id
 * @param {string} toUnit - Target unit id
 * @param {number} value - Value to convert
 * @returns {{ result: number, formula: string }}
 */
export function convert(category, fromUnit, toUnit, value) {
  const cat = CATEGORIES[category];
  if (!cat) throw new Error(`Unknown category: ${category}`);

  const numValue = parseFloat(value);
  if (isNaN(numValue)) throw new Error('Value must be a number');

  if (fromUnit === toUnit) {
    return { result: numValue, formula: `1 ${fromUnit} = 1 ${toUnit}` };
  }

  // Temperature has special handling
  if (category === 'temperature') {
    const result = convertTemperature(numValue, fromUnit, toUnit);
    const fromSym = cat.units.find(u => u.id === fromUnit)?.symbol || fromUnit;
    const toSym   = cat.units.find(u => u.id === toUnit)?.symbol || toUnit;
    return {
      result: Math.round(result * 1000000) / 1000000,
      formula: `Formula: ${fromSym} → ${toSym}`,
    };
  }

  // Standard multiplicative conversion
  const from = cat.units.find(u => u.id === fromUnit);
  const to   = cat.units.find(u => u.id === toUnit);
  if (!from) throw new Error(`Unknown unit: ${fromUnit} in ${category}`);
  if (!to)   throw new Error(`Unknown unit: ${toUnit} in ${category}`);

  const result = numValue * from.toBase / to.toBase;
  const factor = from.toBase / to.toBase;

  return {
    result: Math.round(result * 1000000) / 1000000,
    formula: `1 ${from.symbol} = ${Math.round(factor * 1000000) / 1000000} ${to.symbol}`,
  };
}
