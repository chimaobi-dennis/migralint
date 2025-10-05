import React, { useState, useEffect, useRef } from "react"
import { Search, MapPin, ExternalLink, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"

interface University {
  id: number
  name: string
  country: string | null
  state: string | null
  website: string | null
  country_code: string | null
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

      debounceRef.current = setTimeout(() => {
        const fetchData = async () => {
          try {
            const query = searchQuery.trim()
            if (!query) {
              setUniversities([])
              return
            }

            // First, let's check if there's any data in the table at all
            const { data: totalCount } = await supabase
              .from("universities")
              .select("id", { count: "exact" })
              .limit(1)
            
            console.log("Total universities in table:", totalCount)

            const { data, error } = await supabase
              .from("universities")
              .select("id,name,country,website,country_code,state")
              .or(
                `name.ilike.%${query}%,country.ilike.%${query}%,website.ilike.%${query}%,state.ilike.%${query}%`
              )
              .limit(10)

            if (error) {
              console.error("Error fetching universities:", error)
              console.error("Error details:", error.message, error.details, error.hint)
              setUniversities([])
              return
            }

            console.log("Universities query result:", { query, data, count: data?.length })

            const mapped: University[] = (data || []).map((u) => ({
              id: Number(u.id),
              name: u.name ?? "",
              country: u.country,
              website: u.website,
              country_code: u.country_code,
              state: u.state,
            }))

            setUniversities(mapped)
          } catch (err) {
            console.error("Unexpected error fetching universities:", err)
            setUniversities([])
          } finally {
            setIsLoading(false)
          }
        }

        fetchData()
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
      const countryLabel = university.country ?? ""
      const universityName = `${university.name} (${countryLabel})`
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
                    key={`${university.id}-${index}`}
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
                            {university.state
                              ? `${university.state}${university.country ? ", " + university.country : ""}`
                              : university.country ?? ""
                            }
                          </span>
                        </div>
                      </div>
                      {university.website && (
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