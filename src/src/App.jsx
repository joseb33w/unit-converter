import { useMemo, useState } from 'react'

const categories = {
  Length: {
    icon: '📏',
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.344,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  Weight: {
    icon: '⚖️',
    units: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      pounds: 0.45359237,
      ounces: 0.028349523125,
      tons: 1000,
    },
  },
  Temperature: {
    icon: '🌡️',
    units: {
      Celsius: 'C',
      Fahrenheit: 'F',
      Kelvin: 'K',
    },
  },
  Volume: {
    icon: '🧪',
    units: {
      liters: 1,
      milliliters: 0.001,
      gallons_us: 3.785411784,
      quarts_us: 0.946352946,
      pints_us: 0.473176473,
      cups_us: 0.2365882365,
      fluid_ounces_us: 0.0295735295625,
    },
  },
  Area: {
    icon: '⬛',
    units: {
      square_meters: 1,
      square_kilometers: 1_000_000,
      square_feet: 0.09290304,
      square_yards: 0.83612736,
      acres: 4046.8564224,
      hectares: 10000,
    },
  },
  Speed: {
    icon: '🚀',
    units: {
      meters_per_second: 1,
      kilometers_per_hour: 0.2777777778,
      miles_per_hour: 0.44704,
      knots: 0.5144444444,
      feet_per_second: 0.3048,
    },
  },
  Time: {
    icon: '⏱️',
    units: {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800,
    },
  },
}

function convertTemperature(value, from, to) {
  let c
  if (from === 'Celsius') c = value
  else if (from === 'Fahrenheit') c = (value - 32) * (5 / 9)
  else c = value - 273.15

  if (to === 'Celsius') return c
  if (to === 'Fahrenheit') return c * (9 / 5) + 32
  return c + 273.15
}

function formatLabel(unit) {
  return unit
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

export default function App() {
  const [category, setCategory] = useState('Length')
  const [fromUnit, setFromUnit] = useState('meters')
  const [toUnit, setToUnit] = useState('feet')
  const [inputValue, setInputValue] = useState('1')

  const unitList = useMemo(() => Object.keys(categories[category].units), [category])

  const result = useMemo(() => {
    const value = parseFloat(inputValue)
    if (Number.isNaN(value)) return ''

    if (category === 'Temperature') {
      return convertTemperature(value, fromUnit, toUnit)
    }

    const fromFactor = categories[category].units[fromUnit]
    const toFactor = categories[category].units[toUnit]
    return (value * fromFactor) / toFactor
  }, [category, fromUnit, toUnit, inputValue])

  const quickFacts = useMemo(() => {
    if (result === '') return []
    return [
      { label: 'Converted value', value: Number(result).toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { label: 'From', value: formatLabel(fromUnit) },
      { label: 'To', value: formatLabel(toUnit) },
    ]
  }, [result, fromUnit, toUnit])

  function handleCategory(next) {
    const units = Object.keys(categories[next].units)
    setCategory(next)
    setFromUnit(units[0])
    setToUnit(units[1] || units[0])
    setInputValue('1')
  }

  function swapUnits() {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  return (
    <div className="app-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <div className="container">
        <header className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Fast & precise</p>
            <h1>Unit Converter</h1>
            <p className="hero-text">Convert everyday and engineering units instantly across length, weight, temperature, volume, area, speed, and time with a clean, mobile-friendly interface.</p>
          </div>
          <div className="hero-icon" aria-hidden="true">🔁</div>
        </header>

        <main className="main-grid">
          <section className="panel">
            <div className="category-grid">
              {Object.entries(categories).map(([name, config]) => (
                <button
                  key={name}
                  onClick={() => handleCategory(name)}
                  className={`category-btn ${category === name ? 'active' : ''}`}
                >
                  <div className="category-emoji">{config.icon}</div>
                  <div className="category-name">{name}</div>
                </button>
              ))}
            </div>

            <div className="converter-grid">
              <div className="field-card">
                <label className="field-label">From</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="field-input"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="field-select"
                >
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>{formatLabel(unit)}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapUnits}
                className="swap-btn"
                aria-label="Swap units"
              >
                ⇄
              </button>

              <div className="field-card">
                <label className="field-label">To</label>
                <div className="result-box">
                  {result === '' ? '—' : Number(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="field-select"
                >
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>{formatLabel(unit)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tip-box">
              <span>Tip:</span> Switch categories to convert engineering-friendly measurements quickly, then tap swap to reverse the direction instantly.
            </div>
          </section>

          <aside className="sidebar">
            <section className="panel">
              <h2>Live result</h2>
              <p className="section-text">Your conversion updates automatically as you type or change units.</p>
              <div className="live-card">
                <div className="live-category">{category}</div>
                <div className="live-value">{result === '' ? '—' : Number(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                <div className="live-unit">{formatLabel(toUnit)}</div>
              </div>
            </section>

            <section className="panel">
              <h2>Conversion details</h2>
              <div className="facts-list">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="fact-row">
                    <span className="fact-label">{fact.label}</span>
                    <span className="fact-value">{fact.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2>Included categories</h2>
              <ul className="included-list">
                {Object.entries(categories).map(([name, config]) => (
                  <li key={name} className="included-item">
                    <span>{config.icon}</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </main>
      </div>
    </div>
  )
}
