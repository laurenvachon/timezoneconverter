import { useState, useEffect, useCallback, useRef } from 'react'
import { DateTime } from 'luxon'
import { Sun, Moon, RotateCcw, Plus, X, Search, Minus, Sparkles } from 'lucide-react'

// Available cities to search from
const AVAILABLE_CITIES = [
  // United States
  { city: 'New York', state: 'NY', country: 'US', timezone: 'America/New_York', abbr: 'NYC' },
  { city: 'Los Angeles', state: 'CA', country: 'US', timezone: 'America/Los_Angeles', abbr: 'LA' },
  { city: 'San Francisco', state: 'CA', country: 'US', timezone: 'America/Los_Angeles', abbr: 'SF' },
  { city: 'Chicago', state: 'IL', country: 'US', timezone: 'America/Chicago', abbr: 'CHI' },
  { city: 'Boston', state: 'MA', country: 'US', timezone: 'America/New_York', abbr: 'BOS' },
  { city: 'Seattle', state: 'WA', country: 'US', timezone: 'America/Los_Angeles', abbr: 'SEA' },
  { city: 'Denver', state: 'CO', country: 'US', timezone: 'America/Denver', abbr: 'DEN' },
  { city: 'Miami', state: 'FL', country: 'US', timezone: 'America/New_York', abbr: 'MIA' },
  { city: 'Austin', state: 'TX', country: 'US', timezone: 'America/Chicago', abbr: 'AUS' },
  { city: 'Dallas', state: 'TX', country: 'US', timezone: 'America/Chicago', abbr: 'DFW' },
  { city: 'Houston', state: 'TX', country: 'US', timezone: 'America/Chicago', abbr: 'HOU' },
  { city: 'Phoenix', state: 'AZ', country: 'US', timezone: 'America/Phoenix', abbr: 'PHX' },
  { city: 'Atlanta', state: 'GA', country: 'US', timezone: 'America/New_York', abbr: 'ATL' },
  { city: 'Philadelphia', state: 'PA', country: 'US', timezone: 'America/New_York', abbr: 'PHL' },
  { city: 'Washington', state: 'DC', country: 'US', timezone: 'America/New_York', abbr: 'DCA' },
  { city: 'Las Vegas', state: 'NV', country: 'US', timezone: 'America/Los_Angeles', abbr: 'LAS' },
  { city: 'San Diego', state: 'CA', country: 'US', timezone: 'America/Los_Angeles', abbr: 'SAN' },
  { city: 'Portland', state: 'OR', country: 'US', timezone: 'America/Los_Angeles', abbr: 'PDX' },
  { city: 'Minneapolis', state: 'MN', country: 'US', timezone: 'America/Chicago', abbr: 'MSP' },
  { city: 'Detroit', state: 'MI', country: 'US', timezone: 'America/Detroit', abbr: 'DTW' },
  { city: 'Salt Lake City', state: 'UT', country: 'US', timezone: 'America/Denver', abbr: 'SLC' },
  { city: 'Nashville', state: 'TN', country: 'US', timezone: 'America/Chicago', abbr: 'BNA' },
  { city: 'Charlotte', state: 'NC', country: 'US', timezone: 'America/New_York', abbr: 'CLT' },
  { city: 'Raleigh', state: 'NC', country: 'US', timezone: 'America/New_York', abbr: 'RDU' },
  { city: 'Orlando', state: 'FL', country: 'US', timezone: 'America/New_York', abbr: 'MCO' },
  { city: 'Tampa', state: 'FL', country: 'US', timezone: 'America/New_York', abbr: 'TPA' },
  { city: 'Honolulu', state: 'HI', country: 'US', timezone: 'Pacific/Honolulu', abbr: 'HNL' },
  { city: 'Anchorage', state: 'AK', country: 'US', timezone: 'America/Anchorage', abbr: 'ANC' },
  // Canada
  { city: 'Toronto', state: 'ON', country: 'CA', timezone: 'America/Toronto', abbr: 'YYZ' },
  { city: 'Vancouver', state: 'BC', country: 'CA', timezone: 'America/Vancouver', abbr: 'YVR' },
  { city: 'Montreal', state: 'QC', country: 'CA', timezone: 'America/Toronto', abbr: 'YUL' },
  { city: 'Calgary', state: 'AB', country: 'CA', timezone: 'America/Edmonton', abbr: 'YYC' },
  { city: 'Edmonton', state: 'AB', country: 'CA', timezone: 'America/Edmonton', abbr: 'YEG' },
  { city: 'Ottawa', state: 'ON', country: 'CA', timezone: 'America/Toronto', abbr: 'YOW' },
  // Europe
  { city: 'London', country: 'UK', timezone: 'Europe/London', abbr: 'LON' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', abbr: 'PAR' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', abbr: 'BER' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', abbr: 'AMS' },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', abbr: 'ROM' },
  { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', abbr: 'MAD' },
  { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', abbr: 'BCN' },
  { city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', abbr: 'DUB' },
  { city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', abbr: 'LIS' },
  { city: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', abbr: 'VIE' },
  { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', abbr: 'ZRH' },
  { city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich', abbr: 'GVA' },
  { city: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', abbr: 'BRU' },
  { city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', abbr: 'ARN' },
  { city: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen', abbr: 'CPH' },
  { city: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', abbr: 'OSL' },
  { city: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', abbr: 'HEL' },
  { city: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', abbr: 'PRG' },
  { city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', abbr: 'WAW' },
  { city: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest', abbr: 'BUD' },
  { city: 'Athens', country: 'Greece', timezone: 'Europe/Athens', abbr: 'ATH' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', abbr: 'MOW' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', abbr: 'IST' },
  // India
  { city: 'India', country: 'India', timezone: 'Asia/Kolkata', abbr: 'IND' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', abbr: 'BOM' },
  { city: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', abbr: 'DEL' },
  { city: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', abbr: 'BLR' },
  { city: 'Chennai', country: 'India', timezone: 'Asia/Kolkata', abbr: 'MAA' },
  { city: 'Hyderabad', country: 'India', timezone: 'Asia/Kolkata', abbr: 'HYD' },
  { city: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata', abbr: 'CCU' },
  { city: 'Pune', country: 'India', timezone: 'Asia/Kolkata', abbr: 'PNQ' },
  // Asia Pacific
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', abbr: 'TYO' },
  { city: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', abbr: 'KIX' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', abbr: 'SIN' },
  { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', abbr: 'HKG' },
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', abbr: 'SHA' },
  { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', abbr: 'BJS' },
  { city: 'Shenzhen', country: 'China', timezone: 'Asia/Shanghai', abbr: 'SZX' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', abbr: 'SEL' },
  { city: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', abbr: 'TPE' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', abbr: 'BKK' },
  { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', abbr: 'KUL' },
  { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', abbr: 'JKT' },
  { city: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', abbr: 'MNL' },
  { city: 'Ho Chi Minh', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', abbr: 'SGN' },
  { city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', abbr: 'HAN' },
  // Australia & New Zealand
  { city: 'Sydney', state: 'NSW', country: 'AU', timezone: 'Australia/Sydney', abbr: 'SYD' },
  { city: 'Melbourne', state: 'VIC', country: 'AU', timezone: 'Australia/Melbourne', abbr: 'MEL' },
  { city: 'Brisbane', state: 'QLD', country: 'AU', timezone: 'Australia/Brisbane', abbr: 'BNE' },
  { city: 'Perth', state: 'WA', country: 'AU', timezone: 'Australia/Perth', abbr: 'PER' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', abbr: 'AKL' },
  { city: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland', abbr: 'WLG' },
  // Middle East
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', abbr: 'DXB' },
  { city: 'Abu Dhabi', country: 'UAE', timezone: 'Asia/Dubai', abbr: 'AUH' },
  { city: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', abbr: 'TLV' },
  { city: 'Jerusalem', country: 'Israel', timezone: 'Asia/Jerusalem', abbr: 'JRS' },
  { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', abbr: 'RUH' },
  { city: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar', abbr: 'DOH' },
  // Latin America
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', abbr: 'SAO' },
  { city: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo', abbr: 'GIG' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', abbr: 'MEX' },
  { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', abbr: 'EZE' },
  { city: 'Santiago', country: 'Chile', timezone: 'America/Santiago', abbr: 'SCL' },
  { city: 'Lima', country: 'Peru', timezone: 'America/Lima', abbr: 'LIM' },
  { city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota', abbr: 'BOG' },
  // Africa
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', abbr: 'CAI' },
  { city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', abbr: 'LOS' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', abbr: 'JNB' },
  { city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', abbr: 'CPT' },
  { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', abbr: 'NBO' },
  { city: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca', abbr: 'CMN' },
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
      city.abbr.toLowerCase().includes(searchLower) ||
      (city.state && city.state.toLowerCase().includes(searchLower))
    const notAlreadyAdded = !existingTimezones.some(
      tz => tz.timezone === city.timezone && tz.abbreviation === city.abbr
    )
    return matchesSearch && notAlreadyAdded
  }).slice(0, 8)
  
  const getLocationDisplay = (city) => {
    if (city.state) {
      return `${city.city}, ${city.state}`
    }
    return `${city.city}, ${city.country}`
  }
  
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
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]"
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
                      <span className="text-slate-400 text-sm">{getLocationDisplay(city)}</span>
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

// Custom working hours by timezone
const CUSTOM_WORK_HOURS = {
  'Asia/Kolkata': [
    { start: 9, end: 16 },      // 9 AM - 4 PM IST
    { start: 21, end: 23 },     // 9 PM - 11 PM IST (overlap with US)
  ],
  'Europe/London': [
    { start: 9, end: 17.5 },    // 9 AM - 5:30 PM GMT
  ],
}

// Default working hours for other timezones
const DEFAULT_WORK_HOURS = [
  { start: 9, end: 18 },        // 9 AM - 6 PM
]

// Check if a given hour is within working hours for a timezone
function isInWorkHours(hour, timezone) {
  const workPeriods = CUSTOM_WORK_HOURS[timezone] || DEFAULT_WORK_HOURS
  return workPeriods.some(period => hour >= period.start && hour < period.end)
}

// Check if hour is in extended/reasonable hours (for partial scoring)
function isInExtendedHours(hour, timezone) {
  // For India, also consider 8 AM - 11 PM as reasonable
  if (timezone === 'Asia/Kolkata') {
    return hour >= 8 && hour < 23
  }
  // For others, 8 AM - 8 PM
  return hour >= 8 && hour < 20
}

// Calculate optimal overlap for all timezones
function calculateOptimalOverlap(timezones) {
  if (timezones.length === 0) return null
  
  const now = DateTime.now()
  // Round up to the next 15-minute mark
  const minutesToNext15 = 15 - (now.minute % 15)
  const startTime = now.plus({ minutes: minutesToNext15 }).set({ second: 0, millisecond: 0 })
  
  let bestSlot = null
  let bestScore = -1
  
  // Check each 15-minute slot in the next 24 hours (on the hour, :15, :30, :45)
  for (let minutesFromStart = 0; minutesFromStart < 24 * 60; minutesFromStart += 15) {
    const checkTime = startTime.plus({ minutes: minutesFromStart })
    const minutesFromNow = minutesToNext15 + minutesFromStart
    let score = 0
    let allInWorkHours = true
    
    for (const tz of timezones) {
      const localTime = checkTime.setZone(tz.timezone)
      const hour = localTime.hour + localTime.minute / 60
      
      if (isInWorkHours(hour, tz.timezone)) {
        score += 2  // Full points for work hours
      } else if (isInExtendedHours(hour, tz.timezone)) {
        score += 1  // Partial points for extended hours
        allInWorkHours = false
      } else {
        allInWorkHours = false
      }
    }
    
    // Prefer slots where all are in work hours, then by score
    const effectiveScore = allInWorkHours ? score + 100 : score
    
    if (effectiveScore > bestScore) {
      bestScore = effectiveScore
      bestSlot = {
        time: checkTime,
        minutesFromNow,
        allInWorkHours,
        score
      }
    }
  }
  
  return bestSlot
}

// Optimal Overlap Component
function OptimalOverlap({ timezones, removingId, addingId }) {
  if (timezones.length < 2) return null
  
  const overlap = calculateOptimalOverlap(timezones)
  if (!overlap) return null
  
  const hoursFromNow = Math.round(overlap.minutesFromNow / 60)
  const timeLabel = hoursFromNow === 0 
    ? 'now' 
    : hoursFromNow === 1 
      ? 'in 1 hour' 
      : `in ${hoursFromNow} hours`
  
  return (
    <div className="bg-blue-50 rounded-lg p-5 mt-6 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-900" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-1">Optimal Overlap Found</h3>
          <p className="text-slate-600 text-sm mb-3">
            The most productive slot for all {timezones.length} locations is {timeLabel}.
          </p>
          <div className="flex flex-wrap -mr-2 -mb-2">
            {timezones.map((tz) => {
              const localTime = overlap.time.setZone(tz.timezone)
              const timeStr = localTime.toFormat("h:mm a")
              const isRemoving = removingId === tz.id
              const isAdding = addingId === tz.id
              const isAnimating = isRemoving || isAdding
              
              return (
                <div 
                  key={tz.id}
                  style={{
                    width: isAnimating ? '0px' : 'auto',
                    marginRight: isAnimating ? '0px' : '0.5rem',
                    marginBottom: isAnimating ? '0px' : '0.5rem',
                  }}
                  className="transition-all duration-300 ease-out overflow-hidden"
                >
                  <div 
                    className={`
                      bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 font-medium whitespace-nowrap
                      transition-opacity duration-300 ease-out
                      ${isAnimating ? 'opacity-0' : 'opacity-100'}
                    `}
                  >
                    {timeStr} ({tz.abbreviation})
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
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
    <div className="min-h-screen bg-white w-screen max-w-full">
      {/* Header */}
      <header className="bg-slate-800 text-white py-4 w-full">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 sm:px-6">
          <h1 
            className="font-medium uppercase"
            style={{ letterSpacing: '1px', fontSize: '18px' }}
          >
            Timezone converter
          </h1>
          <button
            onClick={resetToNow}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 flex-shrink-0" />
            <span className="sm:hidden">Reset</span>
            <span className="hidden sm:inline">Reset to current time</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
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
        
        {/* Optimal Overlap Insight */}
        <OptimalOverlap timezones={timezones} removingId={removingId} addingId={addingId} />
        
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
