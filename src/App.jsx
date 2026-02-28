import { useState, useEffect, useCallback, useRef } from 'react'
import { DateTime } from 'luxon'
import { Sun, Moon, RotateCcw, Plus, X, Search, Minus } from 'lucide-react'

// Available cities to search from
const AVAILABLE_CITIES = [
  { city: 'New York', country: 'US', timezone: 'America/New_York', abbr: 'NYC' },
  { city: 'Los Angeles', country: 'US', timezone: 'America/Los_Angeles', abbr: 'LA' },
  { city: 'San Francisco', country: 'US', timezone: 'America/Los_Angeles', abbr: 'SF' },
  { city: 'Chicago', country: 'US', timezone: 'America/Chicago', abbr: 'CHI' },
  { city: 'Boston', country: 'US', timezone: 'America/New_York', abbr: 'BOS' },
  { city: 'Seattle', country: 'US', timezone: 'America/Los_Angeles', abbr: 'SEA' },
  { city: 'Denver', country: 'US', timezone: 'America/Denver', abbr: 'DEN' },
  { city: 'Miami', country: 'US', timezone: 'America/New_York', abbr: 'MIA' },
  { city: 'London', country: 'GB', timezone: 'Europe/London', abbr: 'LON' },
  { city: 'Paris', country: 'FR', timezone: 'Europe/Paris', abbr: 'PAR' },
  { city: 'Berlin', country: 'DE', timezone: 'Europe/Berlin', abbr: 'BER' },
  { city: 'Amsterdam', country: 'NL', timezone: 'Europe/Amsterdam', abbr: 'AMS' },
  { city: 'Rome', country: 'IT', timezone: 'Europe/Rome', abbr: 'ROM' },
  { city: 'Madrid', country: 'ES', timezone: 'Europe/Madrid', abbr: 'MAD' },
  { city: 'Dublin', country: 'IE', timezone: 'Europe/Dublin', abbr: 'DUB' },
  { city: 'Lisbon', country: 'PT', timezone: 'Europe/Lisbon', abbr: 'LIS' },
  { city: 'India', country: 'IN', timezone: 'Asia/Kolkata', abbr: 'IND' },
  { city: 'Mumbai', country: 'IN', timezone: 'Asia/Kolkata', abbr: 'BOM' },
  { city: 'Delhi', country: 'IN', timezone: 'Asia/Kolkata', abbr: 'DEL' },
  { city: 'Bangalore', country: 'IN', timezone: 'Asia/Kolkata', abbr: 'BLR' },
  { city: 'Tokyo', country: 'JP', timezone: 'Asia/Tokyo', abbr: 'TYO' },
  { city: 'Singapore', country: 'SG', timezone: 'Asia/Singapore', abbr: 'SIN' },
  { city: 'Hong Kong', country: 'HK', timezone: 'Asia/Hong_Kong', abbr: 'HKG' },
  { city: 'Shanghai', country: 'CN', timezone: 'Asia/Shanghai', abbr: 'SHA' },
  { city: 'Beijing', country: 'CN', timezone: 'Asia/Shanghai', abbr: 'BJS' },
  { city: 'Seoul', country: 'KR', timezone: 'Asia/Seoul', abbr: 'SEL' },
  { city: 'Sydney', country: 'AU', timezone: 'Australia/Sydney', abbr: 'SYD' },
  { city: 'Melbourne', country: 'AU', timezone: 'Australia/Melbourne', abbr: 'MEL' },
  { city: 'Auckland', country: 'NZ', timezone: 'Pacific/Auckland', abbr: 'AKL' },
  { city: 'Dubai', country: 'AE', timezone: 'Asia/Dubai', abbr: 'DXB' },
  { city: 'Tel Aviv', country: 'IL', timezone: 'Asia/Jerusalem', abbr: 'TLV' },
  { city: 'São Paulo', country: 'BR', timezone: 'America/Sao_Paulo', abbr: 'SAO' },
  { city: 'Mexico City', country: 'MX', timezone: 'America/Mexico_City', abbr: 'MEX' },
  { city: 'Toronto', country: 'CA', timezone: 'America/Toronto', abbr: 'YYZ' },
  { city: 'Vancouver', country: 'CA', timezone: 'America/Vancouver', abbr: 'YVR' },
  { city: 'Moscow', country: 'RU', timezone: 'Europe/Moscow', abbr: 'MOW' },
  { city: 'Istanbul', country: 'TR', timezone: 'Europe/Istanbul', abbr: 'IST' },
  { city: 'Cairo', country: 'EG', timezone: 'Africa/Cairo', abbr: 'CAI' },
  { city: 'Lagos', country: 'NG', timezone: 'Africa/Lagos', abbr: 'LOS' },
  { city: 'Johannesburg', country: 'ZA', timezone: 'Africa/Johannesburg', abbr: 'JNB' },
]

// Default timezones
const DEFAULT_TIMEZONES = [
  { id: 'ind', abbreviation: 'IND', timezone: 'Asia/Kolkata' },
  { id: 'bos', abbreviation: 'BOS', timezone: 'America/New_York' },
  { id: 'sf', abbreviation: 'SF', timezone: 'America/Los_Angeles' },
  { id: 'lon', abbreviation: 'LON', timezone: 'Europe/London' },
]

// LocalStorage key
const STORAGE_KEY = 'timezone-converter-locations'

// Parse URL parameters for timezone zones
function getTimezonesFromURL() {
  const params = new URLSearchParams(window.location.search)
  const zonesParam = params.get('zones')
  
  if (!zonesParam) return null
  
  const abbrs = zonesParam.split(',').map(s => s.trim().toUpperCase())
  const timezones = []
  
  for (const abbr of abbrs) {
    const city = AVAILABLE_CITIES.find(c => c.abbr.toUpperCase() === abbr)
    if (city) {
      timezones.push({
        id: `${city.abbr.toLowerCase()}-${Date.now()}-${Math.random()}`,
        abbreviation: city.abbr,
        timezone: city.timezone,
      })
    }
  }
  
  return timezones.length > 0 ? timezones : null
}

// Update URL with current timezone selections
function updateURL(timezones) {
  const abbrs = timezones.map(tz => tz.abbreviation).join(',')
  const url = new URL(window.location.href)
  url.searchParams.set('zones', abbrs)
  window.history.replaceState({}, '', url)
}

// Load timezones from URL, then localStorage, then defaults
function loadTimezones() {
  // First check URL
  const fromURL = getTimezonesFromURL()
  if (fromURL) return fromURL
  
  // Then check localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load timezones from localStorage:', e)
  }
  return DEFAULT_TIMEZONES
}

// Save timezones to localStorage
function saveTimezones(timezones) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones))
  } catch (e) {
    console.error('Failed to save timezones to localStorage:', e)
  }
}

// Check if it's day or night in a timezone
function isDayTime(isoString, timezone) {
  const dt = DateTime.fromISO(isoString, { zone: timezone })
  const hour = dt.hour
  return hour >= 6 && hour < 18
}

// Format time for display (e.g., "5:27 AM")
function formatTime(isoString, timezone) {
  if (!isoString) return ''
  const dt = DateTime.fromISO(isoString, { zone: timezone })
  return dt.toFormat("h:mm a")
}

// Parse user input time string and return DateTime
function parseTimeInput(input, currentIso, timezone) {
  const cleaned = input.trim().toUpperCase()
  
  // Try parsing various formats
  const formats = [
    "h:mm a",
    "h:mma", 
    "H:mm",
    "h a",
    "ha",
    "H"
  ]
  
  for (const fmt of formats) {
    const parsed = DateTime.fromFormat(cleaned, fmt, { zone: timezone })
    if (parsed.isValid) {
      const currentDt = DateTime.fromISO(currentIso, { zone: timezone })
      return currentDt.set({ hour: parsed.hour, minute: parsed.minute })
    }
  }
  
  return null
}

// City Search Modal Component
function CitySearchModal({ onSelect, onClose, existingTimezones }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const filteredCities = AVAILABLE_CITIES.filter(city => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      city.city.toLowerCase().includes(searchLower) ||
      city.country.toLowerCase().includes(searchLower) ||
      city.abbr.toLowerCase().includes(searchLower)
    const notAlreadyAdded = !existingTimezones.some(
      tz => tz.timezone === city.timezone && tz.abbreviation === city.abbr
    )
    return matchesSearch && notAlreadyAdded
  }).slice(0, 8)
  
  const handleSelect = (city) => {
    onSelect({
      id: `${city.abbr.toLowerCase()}-${Date.now()}`,
      abbreviation: city.abbr,
      timezone: city.timezone,
      fullName: `${city.city}, ${city.country}`
    })
    onClose()
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Add Location</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        
        {/* Search Input */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="max-h-72 overflow-y-auto px-3 pb-3">
          {filteredCities.length > 0 ? (
            <div className="space-y-1">
              {filteredCities.map((city) => {
                const now = DateTime.now().setZone(city.timezone)
                const cityTime = now.toFormat("h:mm a")
                const isDay = now.hour >= 6 && now.hour < 18
                
                return (
                  <button
                    key={`${city.abbr}-${city.city}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-left font-semibold text-slate-700">{city.abbr}</span>
                      <span className="text-slate-400 text-sm">{city.city}</span>
                    </div>
                    <div className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      ${isDay 
                        ? 'bg-amber-400 text-amber-900' 
                        : 'bg-slate-700 text-white'
                      }
                    `}>
                      {isDay ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" />
                      )}
                      {cityTime}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {search ? 'No cities found' : 'Search for a city'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// Editable Time Pill Component
function EditableTimePill({ time, timezone, isDay, onTimeChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)
  
  const timeStr = formatTime(time, timezone)
  
  const handleClick = () => {
    setInputValue(timeStr)
    setIsEditing(true)
  }
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Small delay to ensure input is mounted before selecting
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(0, inputRef.current.value.length)
        }
      }, 0)
    }
  }, [isEditing])
  
  const handleBlur = () => {
    setIsEditing(false)
    const parsed = parseTimeInput(inputValue, time, timezone)
    if (parsed) {
      onTimeChange(parsed.toISO())
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }
  
  return (
    <div
      onClick={!isEditing ? handleClick : undefined}
      style={{ fontSize: '1.25em' }}
      className={`
        group w-48 flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium
        transition-colors
        ${!isEditing ? 'cursor-pointer' : ''}
        ${isDay 
          ? `bg-amber-400 text-amber-900 ${!isEditing ? 'hover:bg-amber-300' : ''}` 
          : `bg-slate-700 text-white ${!isEditing ? 'hover:bg-slate-600' : ''}`
        }
      `}
    >
      {isDay ? (
        <Sun className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-out ${!isEditing ? 'group-hover:scale-110 group-hover:rotate-[20deg]' : ''}`} />
      ) : (
        <Moon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-out ${!isEditing ? 'group-hover:scale-110 group-hover:rotate-[20deg]' : ''}`} />
      )}
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ backgroundColor: isDay ? '#ffd568' : '#1e293b' }}
          className={`
            w-[6.5rem] font-medium outline-none text-center rounded px-1
            ${isDay ? 'text-amber-900' : 'text-white'}
          `}
        />
      ) : (
        <span className="w-[6.5rem] text-center">{timeStr}</span>
      )}
    </div>
  )
}

// Get minutes since midnight for slider
function getMinutesSinceMidnight(isoString, timezone) {
  const dt = DateTime.fromISO(isoString, { zone: timezone })
  return dt.hour * 60 + dt.minute
}

// Main App Component
function App() {
  const [centralTime, setCentralTime] = useState(() => DateTime.now().toISO())
  const [timezones, setTimezones] = useState(loadTimezones)
  const [showAddModal, setShowAddModal] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [addingId, setAddingId] = useState(null)
  const localTimezone = DateTime.local().zoneName
  
  // Save to localStorage and update URL whenever timezones change
  useEffect(() => {
    saveTimezones(timezones)
    updateURL(timezones)
  }, [timezones])
  
  // Add a new timezone with animation
  const addTimezone = (newTz) => {
    setAddingId(newTz.id)
    setTimezones(prev => [...prev, newTz])
    setTimeout(() => {
      setAddingId(null)
    }, 50)
  }
  
  // Remove a timezone with animation
  const removeTimezone = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      setTimezones(prev => prev.filter(tz => tz.id !== id))
      setRemovingId(null)
    }, 300)
  }

  // Update display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Just trigger re-render for current time display
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Handle slider change
  const handleSliderChange = useCallback((e) => {
    const minutes = parseInt(e.target.value, 10)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    const currentDt = DateTime.fromISO(centralTime, { zone: localTimezone })
    const newDt = currentDt.set({ hour: hours, minute: mins })
    setCentralTime(newDt.toISO())
  }, [centralTime, localTimezone])

  // Reset to current time
  const resetToNow = useCallback(() => {
    setCentralTime(DateTime.now().toISO())
  }, [])

  const sliderValue = getMinutesSinceMidnight(centralTime, localTimezone)
  const currentTimeFormatted = formatTime(centralTime, localTimezone)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 
            className="font-medium uppercase"
            style={{ letterSpacing: '1px', fontSize: '18px' }}
          >
            Timezone converter
          </h1>
          <button
            onClick={resetToNow}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to current time
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6">
        {/* Time Slider */}
        <div className="mb-8">
          <div className="relative pt-7">
            {/* Static Labels */}
            <div className="absolute top-0 left-0 text-sm text-slate-500 transition-opacity duration-200"
              style={{ opacity: Math.max(0, Math.min(1, (sliderValue - 180) / 120)) }}
            >
              12:00 AM
            </div>
            <div className="absolute top-0 right-0 text-sm text-slate-500 transition-opacity duration-200"
              style={{ opacity: Math.max(0, Math.min(1, (1439 - sliderValue - 180) / 120)) }}
            >
              11:59 PM
            </div>
            
            {/* Tooltip */}
            <div 
              className="absolute top-0 pointer-events-none flex flex-col items-center"
              style={{ 
                left: `calc(${(sliderValue / 1439) * 100}% + ${8 - (sliderValue / 1439) * 16}px)`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-lg whitespace-nowrap">
                {currentTimeFormatted}
              </div>
              <div className="w-2 h-2 bg-slate-700 rotate-45 -mt-1"></div>
            </div>
            <input
              type="range"
              min="0"
              max="1439"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer slider mt-3"
            />
          </div>
        </div>

        {/* Timezone List */}
        <div className="space-y-1">
          {timezones.map((tz) => {
            const isDay = isDayTime(centralTime, tz.timezone)
            
            const isAdding = addingId === tz.id
            const isRemoving = removingId === tz.id
            const isAnimating = isAdding || isRemoving
            
            return (
              <div
                key={tz.id}
                style={{
                  maxHeight: isAnimating ? '0px' : '100px',
                  paddingTop: isAnimating ? '0px' : '1rem',
                  paddingBottom: isAnimating ? '0px' : '1rem',
                }}
                className={`group flex items-center justify-between border-b border-slate-100 transition-all ease-out duration-300 overflow-hidden ${
                  isAnimating 
                    ? 'opacity-0 scale-95 border-transparent' 
                    : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Remove Button */}
                  {timezones.length > 1 && (
                    <button
                      onClick={() => removeTimezone(tz.id)}
                      className="w-6 h-6 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full transition-all"
                      title="Remove"
                    >
                      <Minus className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                  
                  {/* Location */}
                  <span className="text-slate-700 font-semibold" style={{ fontSize: '2rem' }}>
                    {tz.abbreviation}
                  </span>
                </div>
                
                {/* Editable Time Pill */}
                <EditableTimePill
                  time={centralTime}
                  timezone={tz.timezone}
                  isDay={isDay}
                  onTimeChange={setCentralTime}
                />
              </div>
            )
          })}
          
          {/* Add Location Button */}
          <div className="flex items-center justify-center py-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="h-8 flex items-center gap-2 px-4 rounded-full bg-slate-200 hover:bg-slate-300 transition-all"
              title="Add location"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 font-medium text-sm uppercase">ADD</span>
            </button>
          </div>
        </div>
        
        {/* Add Location Modal */}
        {showAddModal && (
          <CitySearchModal
            onSelect={addTimezone}
            onClose={() => setShowAddModal(false)}
            existingTimezones={timezones}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-slate-500 text-xs">
          Created by Lauren Vachon using Cursor
        </p>
      </footer>
    </div>
  )
}

export default App
