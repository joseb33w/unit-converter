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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),_linear-gradient(180deg,_#0b1020_0%,_#11182e_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Fast & precise</p>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Unit Converter</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Convert everyday and engineering units instantly across length, weight, temperature, volume, area, speed, and time with a clean, mobile-friendly interface.</p>
            </div>
            <div className="hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-6xl shadow-lg shadow-cyan-500/10 md:block">🔁</div>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {Object.entries(categories).map(([name, config]) => (
                <button
                  key={name}
                  onClick={() => handleCategory(name)}
                  className={`rounded-2xl border px-3 py-4 text-left transition-all duration-200 ${category === name ? 'border-cyan-300 bg-cyan-400/20 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-white/10'}`}
                >
                  <div className="mb-2 text-2xl">{config.icon}</div>
                  <div className="text-sm font-semibold">{name}</div>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-300">From</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-lg font-semibold text-white outline-none transition focus:border-cyan-300"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                >
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>{formatLabel(unit)}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapUnits}
                className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/15 text-2xl shadow-lg shadow-cyan-500/10 transition hover:scale-105 hover:bg-cyan-400/20"
                aria-label="Swap units"
              >
                ⇄
              </button>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-300">To</label>
                <div className="mb-3 flex min-h-[56px] items-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 px-4 py-3 text-lg font-bold text-cyan-200">
                  {result === '' ? '—' : Number(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                >
                  {unitList.map((unit) => (
                    <option key={unit} value={unit}>{formatLabel(unit)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4 text-sm leading-relaxed text-emerald-100">
              <span className="font-semibold text-emerald-200">Tip:</span> Switch categories to convert engineering-friendly measurements quickly, then tap swap to reverse the direction instantly.
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-bold">Live result</h2>
              <p className="mt-2 text-sm text-slate-300">Your conversion updates automatically as you type or change units.</p>
              <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 p-5">
                <div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">{category}</div>
                <div className="mt-3 text-4xl font-extrabold tracking-tight text-white break-words">
                  {result === '' ? '—' : Number(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
                <div className="mt-2 text-sm text-slate-200">{formatLabel(toUnit)}</div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-bold">Conversion details</h2>
              <div className="mt-4 space-y-3">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <span className="text-sm text-slate-300">{fact.label}</span>
                    <span className="ml-4 text-right text-sm font-semibold text-white">{fact.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-bold">Included categories</h2>
              <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {Object.entries(categories).map(([name, config]) => (
                  <li key={name} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <span className="mr-2">{config.icon}</span>{name}
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
