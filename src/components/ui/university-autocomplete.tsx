import React, { useState, useEffect, useRef } from "react"
import { Search, MapPin, ExternalLink, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface University {
  name: string
  country: string
  "state-province": string | null
  web_pages: string[]
  domains: string[]
}

interface UniversityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const UniversityAutocomplete = React.forwardRef<HTMLInputElement, UniversityAutocompleteProps>(
  ({ value, onChange, placeholder = "Search universities...", className }, ref) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [universities, setUniversities] = useState<University[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const debounceRef = useRef<NodeJS.Timeout>()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Debounced search
    useEffect(() => {
      if (searchQuery.trim().length < 2) {
        setUniversities([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `http://universities.hipolabs.com/search?name=${encodeURIComponent(searchQuery.trim())}`
          )
          const data = await response.json()
          setUniversities(data.slice(0, 10)) // Limit to 10 results
        } catch (error) {
          console.error('Error fetching universities:', error)
          setUniversities([])
        } finally {
          setIsLoading(false)
        }
      }, 300)

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
      }
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSelectedIndex(-1)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Initialize search query with current value
    useEffect(() => {
      if (value && searchQuery !== value) {
        setSearchQuery(value)
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchQuery(newValue)
      setIsOpen(true)
      setSelectedIndex(-1)
      
      if (newValue.trim() === "") {
        onChange("")
      }
    }

    const handleSelectUniversity = (university: University) => {
      const universityName = `${university.name} (${university.country})`
      setSearchQuery(universityName)
      onChange(universityName)
      setIsOpen(false)
      setSelectedIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen || universities.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < universities.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : universities.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < universities.length) {
            handleSelectUniversity(universities[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }

    const handleFocus = () => {
      if (searchQuery.trim().length >= 2) {
        setIsOpen(true)
      }
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={ref || inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn("pl-10 pr-10 h-12", className)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
        </div>

        {isOpen && (searchQuery.trim().length >= 2) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Searching universities...</span>
              </div>
            ) : universities.length > 0 ? (
              <div className="py-2">
                {universities.map((university, index) => (
                  <div
                    key={`${university.name}-${university.country}-${index}`}
                    onClick={() => handleSelectUniversity(university)}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                      "border-b border-border/50 last:border-b-0",
                      selectedIndex === index && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm leading-tight mb-1 truncate">
                          {university.name}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {university["state-province"] 
                              ? `${university["state-province"]}, ${university.country}`
                              : university.country
                            }
                          </span>
                        </div>
                      </div>
                      {university.web_pages && university.web_pages.length > 0 && (
                        <div className="ml-2 flex-shrink-0">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim().length >= 2 && !isLoading ? (
              <div className="px-4 py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No universities found for "{searchQuery}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)

UniversityAutocomplete.displayName = "UniversityAutocomplete"